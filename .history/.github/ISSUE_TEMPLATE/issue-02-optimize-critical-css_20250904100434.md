---
name: Feature Request  
about: Optimize critical CSS scope for faster LCP
title: "perf: refine critical CSS to hero/header essentials only"
labels: type:feature, perf, priority:high
assignees: ''
---

## Feature Request Summary

Reduce the inline critical CSS block to only the absolute essentials needed for hero and header rendering, pushing other rules to the deferred stylesheet to minimize HTML size and parsing time.

## User Value

Smaller critical CSS means faster HTML parsing and quicker time to first paint, directly contributing to improved LCP performance. Current inline CSS is 1,635 bytes raw - we should target <1,200 bytes.

## Current State

From performance budget: `"inlineCriticalCssRaw": 1635` bytes

- Critical CSS includes more than just hero/header essentials
- Some styles that could be deferred are currently inlined
- Need to identify true critical path styles vs. nice-to-have styles

## Acceptance Criteria

```gherkin
Given the critical CSS is currently 1,635 bytes
When we optimize the inline CSS scope
Then the inline critical CSS should be <1,200 bytes
And hero section (h1.giant-text) should render immediately without FOUC
And header/navigation should render immediately  
And other content can load progressively from deferred CSS
And no visual regression occurs during CSS load transition

Non-Functional:
- LCP element (h1.giant-text) must have all required styles inlined
- Above-the-fold content should not flash/reflow when deferred CSS loads
- Font display swap should work correctly with critical font styles
```

## Technical Approach

1. **Audit current inline CSS**: Identify what's currently in the critical block
2. **Critical path analysis**: Determine minimum styles needed for LCP element
3. **Move non-critical styles**: Push layout, animations, and below-fold styles to deferred CSS
4. **Essential styles only**:
   - Font loading and typography for hero text
   - Header layout and positioning
   - Container layouts for above-the-fold content
   - Color variables (if used in critical styles)

## References / Files

- Current inline critical CSS in generated `dist/index.html`
- `src/index.css` - main stylesheet  
- `src/akaru-styles.css` - additional styles
- `src/App.css` - component styles
- Performance standup notes for LCP element identification

## Definition of Done

- [ ] Inline critical CSS reduced to <1,200 bytes
- [ ] LCP element renders without FOUC
- [ ] Header/nav renders immediately on load
- [ ] Visual regression test passes on all breakpoints
- [ ] Deferred CSS loads without visible style jumps
- [ ] Performance budget check passes

## Estimated Effort

**3 story points** - CSS analysis, refactoring, and testing

## Notes / Risks

- **Risk**: FOUC during CSS transition → **Mitigation**: Progressive enhancement approach
- **Risk**: Breaking typography rendering → **Mitigation**: Font fallback metrics alignment
- **Dependencies**: Should be done after blocking CSS elimination (#1)

## Success Metrics

- Critical CSS size: 1,635 bytes → <1,200 bytes (26% reduction)
- LCP improvement target: 0.1-0.2s faster parsing
- Zero visual regressions during load sequence
