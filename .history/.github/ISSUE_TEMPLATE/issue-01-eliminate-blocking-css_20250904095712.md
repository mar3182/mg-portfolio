---
name: Feature Request
about: Eliminate blocking CSS link completely
title: "perf: eliminate blocking CSS link to complete deferred loading"
labels: type:feature, perf, priority:high
assignees: ''
---

## Feature Request Summary

Complete the CSS deferral implementation by eliminating the blocking CSS link that's currently negating the benefits of the preload + onload swap pattern.

## User Value

This change will directly impact LCP performance by removing render-blocking CSS, allowing the page to start painting sooner and helping achieve the <2.5s LCP target.

## Current State

From the performance standup notes:
- Deferred CSS implemented via `requestIdleCallback + preload` 
- BUT: "blocking stylesheet still injected by Vite; needs final removal"
- This creates duplicate CSS inclusion (both deferred preload + standard blocking link)

## Acceptance Criteria

```gherkin
Given the application builds with Vite
When the HTML is generated  
Then only the preload + onload CSS pattern should be present
And no blocking <link rel="stylesheet"> should exist in the HTML
And critical CSS should remain inlined in <head>
And the page should render correctly on first load

Non-Functional:
- LCP should improve measurably (target contribution: 0.2-0.3s)
- No visual regression on any breakpoint
- Deferred CSS should load within 100ms of page load
```

## Technical Approach

Based on `vite.config.js` analysis, the current `defer-non-critical-css` plugin needs enhancement:

1. **Prevent Vite CSS injection**: Modify the plugin to completely suppress the default CSS link injection
2. **HTML transformation**: Ensure the transform correctly replaces ALL stylesheet links (not just assets)  
3. **Critical CSS preservation**: Keep fonts.css and inlined critical styles untouched
4. **Testing**: Verify on build output that no blocking CSS links remain

## References / Files

- `vite.config.js` - current defer plugin implementation
- `src/index.css` - main stylesheet being deferred
- `docs/performance-standup-2025-08-29.md` - performance analysis
- Generated `dist/index.html` - check final HTML output

## Definition of Done

- [ ] `pnpm run build` produces HTML with no blocking CSS links
- [ ] CSS loads via preload + onload pattern only  
- [ ] Visual regression test on 3 breakpoints passes
- [ ] LCP measurement shows improvement
- [ ] Performance budget check passes
- [ ] Dev mode still works correctly

## Estimated Effort

**2 story points** - CSS build optimization with testing

## Notes / Risks

- **Risk**: Breaking dev mode hot reload → **Mitigation**: Test dev mode thoroughly
- **Risk**: FOUC (Flash of Unstyled Content) → **Mitigation**: Ensure critical CSS coverage is sufficient
- **Dependency**: This blocks other performance optimizations, should be completed first
