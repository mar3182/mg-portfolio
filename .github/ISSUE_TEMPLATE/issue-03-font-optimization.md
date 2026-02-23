---
name: Feature Request
about: Optimize Inter font with subsetting and font-size-adjust
title: "perf: optimize Inter font loading with subset and fallback metrics"
labels: type:feature, perf, priority:medium
assignees: ''
---

## Feature Request Summary

Optimize the Inter font loading by creating a Latin subset and implementing font-size-adjust for better fallback font metrics alignment, reducing font-related layout shifts and improving font load performance.

## User Value

Faster font loading and better fallback font metrics will reduce cumulative layout shift (CLS) and contribute to LCP improvements by ensuring text renders optimally during font loading phases.

## Current State

From performance standup: "Font Optimization: Subset Inter (Latin basic); add `font-size-adjust`; evaluate optional second stage swap for full set"

- Inter variable font is loaded but not optimized  
- No font subsetting implemented
- No font-size-adjust for fallback alignment
- Potential for layout shift during font swap

## Acceptance Criteria

```gherkin
Given the current Inter font loading setup
When we optimize font loading
Then Inter should be subset to Latin basic characters only
And font-size-adjust should align fallback fonts with Inter metrics  
And font loading should use font-display: swap correctly
And no layout shift should occur during font transition
And font file size should be measurably smaller

Non-Functional:
- Font load time should improve by 20-30%
- CLS score should not regress
- Typography should render identically after optimization
- Support for extended characters can be evaluated in future sprint
```

## Technical Approach

1. **Font Subsetting**:
   - Create Latin subset of Inter variable font
   - Include basic punctuation and numbers
   - Evaluate character requirements for current content

2. **Font-size-adjust Implementation**:
   - Measure Inter font metrics (x-height, cap-height)
   - Calculate size-adjust values for system font fallbacks
   - Implement in CSS with proper fallback stack

3. **Loading Optimization**:
   - Ensure proper font-display: swap
   - Consider preload for critical font weights
   - Test font loading performance

## References / Files

- `public/fonts/fonts.css` - current font declarations
- Performance standup recommendations
- Font files in `public/fonts/` directory
- CSS custom properties for font families

## Definition of Done

- [ ] Inter font subset to Latin basic created and implemented
- [ ] font-size-adjust values calculated and applied  
- [ ] Font file size reduced measurably
- [ ] No layout shift during font loading
- [ ] Typography renders identically before/after
- [ ] Performance budget check passes

## Estimated Effort

**2 story points** - Font optimization and CSS updates

## Notes / Risks

- **Risk**: Breaking international character support → **Mitigation**: Document character requirements first
- **Risk**: Fallback metrics misalignment → **Mitigation**: Thorough testing with dev tools font blocking
- **Tools needed**: Font subsetting tools or service

## Success Metrics

- Font file size reduction: Target 30-40% smaller
- Font load time improvement measured
- Zero layout shift during font transitions
- Maintained typography quality
