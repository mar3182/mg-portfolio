---
name: Feature Request
about: Add priority hints for critical resources
title: "perf: add fetchpriority hints for critical resources"
labels: type:feature, perf, priority:low
assignees: ''
---

## Feature Request Summary

Add `fetchpriority="high"` to critical resources like primary fonts and main JavaScript bundle while setting appropriate priority levels for other resources to optimize loading sequence.

## User Value

Priority hints help browsers understand which resources are most important for initial page rendering, potentially improving LCP by ensuring critical resources are fetched first.

## Current State

- No fetchpriority attributes currently implemented
- Browser using default priority heuristics
- Opportunity for optimization based on performance standup notes

## Acceptance Criteria

```gherkin
Given the current resource loading setup
When priority hints are implemented
Then critical fonts should have fetchpriority="high"
And main JavaScript bundle should have appropriate priority
And non-critical resources should have lower priority
And LCP should show measurable improvement or no regression
And all browsers should handle fallback gracefully

Non-Functional:
- Implementation should be backward compatible
- Performance budget should not be impacted
- Should work correctly in both dev and production builds
```

## Technical Approach

1. **Critical Resource Identification**:
   - Primary Inter font files
   - Main JavaScript bundle  
   - Critical CSS (already inlined)

2. **Implementation**:
   - Add fetchpriority="high" to font preload links
   - Set appropriate priority for main JS bundle
   - Consider fetchpriority="low" for non-critical assets

3. **Testing**:
   - Verify browser support and fallback behavior
   - Measure impact on resource loading timing
   - Test across different connection speeds

## References / Files

- `dist/index.html` - where priority hints will be added
- `public/fonts/fonts.css` - font loading setup
- Network performance analysis from previous optimization work

## Definition of Done

- [ ] Critical fonts have fetchpriority="high" 
- [ ] Main JS bundle has appropriate priority hint
- [ ] Non-critical resources have lower priority where beneficial
- [ ] Browser compatibility verified
- [ ] Performance impact measured (neutral or positive)
- [ ] Works in both dev and production builds

## Estimated Effort

**1 story point** - Simple HTML attribute additions with testing

## Notes / Risks

- **Risk**: Browser support variations → **Mitigation**: Graceful degradation approach
- **Risk**: Minimal impact on modern browsers → **Mitigation**: Measure before/after
- **Low priority**: Can be done after critical CSS/font optimizations

## Success Metrics

- Priority hints correctly applied to identified resources
- No negative performance impact measured  
- LCP improvement or maintenance of current performance
