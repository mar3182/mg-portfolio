# Performance Budget Ratcheting

This project uses an automated performance budget system that prevents regressions and "locks in" improvements.

## How It Works

### Budget Files
- `perf-budgets.json` - Stores current performance limits (bytes)
- `dist/perf-budget-report.json` - Generated after each build with actual measurements

### Ratcheting Logic
When a metric is performing **significantly better** than its budget:
- **Trigger**: Current size < 90% of budget limit
- **New limit**: `max(current_size * 1.05, current_size + 512 bytes)`
- **Safety**: Always keeps headroom above current performance

## Usage

### Manual Testing
```bash
# Check current performance vs budgets
pnpm run perf:budget

# Preview what ratcheting would do (no changes)
pnpm run perf:budget-dry
# or
PERF_RATCHET=dry pnpm run perf:budget

# Apply ratcheting (updates perf-budgets.json)
PERF_RATCHET=1 pnpm run build
```

### CI Workflows

#### Pull Requests (`.github/workflows/perf-budget.yml`)
- ✅ Enforce current budgets (fail if exceeded)
- 🔍 Show dry-run preview of potential budget changes
- 📊 Upload performance report as artifact

#### Main Branch (`.github/workflows/auto-ratchet.yml`)
- 🔒 **Auto-ratchet** budgets after merges to main
- 📝 Automatically commit tightened budgets
- 🚨 Only triggers when meaningful improvements detected

## Current Budgets

| Metric                | Current Limit | Purpose                                        |
| --------------------- | ------------- | ---------------------------------------------- |
| `main-entry-js`       | ~91KB gzip    | Core app bundle size                           |
| `total-initial-js`    | ~139KB gzip   | All JS loaded initially (main + modulepreload) |
| `deferred-main-css`   | ~26KB gzip    | Non-critical CSS bundle                        |
| `inline-critical-css` | ~1.6KB raw    | Above-the-fold CSS in `<style>`                |

## Benefits

1. **Prevents Regressions**: Budgets never get looser accidentally
2. **Locks in Improvements**: Optimizations become permanent constraints
3. **Zero Maintenance**: Budgets update automatically after performance improvements
4. **Visibility**: Clear tracking of performance trends over time

## Safety Features

- **Conservative headroom**: Always keeps 5% buffer above current performance
- **Minimum absolute headroom**: At least 512 bytes spare
- **Dry-run mode**: Preview changes before applying
- **Manual override**: Can disable with `BUDGET_SKIP=1`

## Customization

Edit `scripts/perf-budget.mjs` to adjust:
- **Trigger threshold**: Change `RATIO_TRIGGER` (default 0.9 = 90%)
- **Headroom factors**: Modify `MIN_HEADROOM_FACTOR` and `MIN_ABSOLUTE_HEADROOM`
- **Budget metrics**: Add new measurements to track

## Troubleshooting

### "No ratcheting changes" 
Current performance isn't sufficiently better than budgets (needs to be <90% of limit).

### "Budget violation" 
Performance regressed. Either:
1. Optimize the code to get back under budget
2. Temporarily set `BUDGET_SKIP=1` while investigating
3. Manually adjust `perf-budgets.json` if the regression is intentional

### Auto-ratchet not working
- Check that the workflow has write permissions (`GITHUB_TOKEN`)
- Ensure it only runs on pushes to main (not PRs)
- Verify the performance improvement is substantial enough to trigger ratcheting
