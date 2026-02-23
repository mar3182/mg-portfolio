---
name: Feature Request
about: Ensure LCP element owns LCP cleanly without interference
title: "perf: optimize LCP element (h1.giant-text) rendering"
labels: type:feature, perf, priority:medium
assignees: ''
---

## Feature Request Summary

Optimize the LCP element (h1.giant-text) to ensure it renders as quickly as possible without late style mutations, layout shifts, or rendering interference from other elements.

## User Value

By optimizing the element that determines LCP timing, we directly impact the core web vital that affects SEO rankings and user experience perception of site speed.

## Current State

From performance analysis:
- LCP Element: `h1.giant-text` (confirmed stable)
- LCP: 3.0s (target: <2.5s)
- Need to ensure "no late style mutations" for this element

## Acceptance Criteria

```gherkin
Given h1.giant-text is the LCP element
When the page loads
Then h1.giant-text should render with all final styles immediately
And no layout shifts should affect this element after initial render
And font loading should not cause text reflow
And the element should have explicit sizing constraints
And LCP timing should improve measurably

Non-Functional:
- Element should have explicit line-height and letter-spacing
- Font fallback metrics should align with final font
- No JavaScript should mutate styles after initial render
- Element should work correctly with reduced motion preferences
```

## Technical Approach

1. **Style Analysis**:
   - Audit current CSS for h1.giant-text
   - Identify any dynamic style changes
   - Ensure all styles are declared explicitly

2. **Font Optimization**:
   - Explicit line-height and letter-spacing values
   - Font fallback metrics alignment with Inter
   - Ensure font-display: swap doesn't cause layout shift

3. **Layout Stability**:
   - Add explicit dimensions where possible
   - Prevent any post-load JavaScript mutations
   - Test with font loading blocked to verify fallback behavior

4. **Performance Verification**:
   - Measure LCP timing before/after
   - Verify element stability in lighthouse
   - Test across different connection speeds

## References / Files

- Current LCP element in hero section
- Typography styles in CSS files
- Font loading implementation
- Performance standup notes on LCP progression

## Definition of Done

- [ ] h1.giant-text has explicit style properties (line-height, letter-spacing)
- [ ] Font fallback metrics align with Inter to prevent layout shift
- [ ] No JavaScript mutations affect the element post-render
- [ ] LCP timing improves or remains stable
- [ ] Element renders consistently across browsers
- [ ] Performance budget check passes

## Estimated Effort

**2 story points** - CSS optimization and cross-browser testing

## Notes / Risks

- **Risk**: Over-constraining styles affects responsive behavior → **Mitigation**: Test on all breakpoints
- **Risk**: Font loading changes affect other text → **Mitigation**: Scope changes to hero element only
- **Dependency**: Should coordinate with font optimization (#3)

## Success Metrics

- LCP element renders with stable metrics
- No layout shifts detected for this element
- LCP timing improvement or maintenance
- Consistent rendering across browsers and devices

## Related Issues

- #3: Font optimization with fallback metrics
- Performance monitoring for LCP tracking
