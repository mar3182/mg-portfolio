# Akaru.fr — Detailed Technical Specification

## HOMEPAGE BEHAVIOR (CRITICAL)

### Overall Structure
The homepage is a **SINGLE FULL-HEIGHT VIEWPORT** that contains a horizontal scroll-hijacked project showcase. It does NOT auto-advance. The user controls navigation entirely through scrolling.

---

## SECTION 1: HERO (100vh, Sticky)

### Layout: Split Screen
```
┌─────────────────────────────────────────────────────────────────────────┐
│  TOP NAV (Fixed, z-index highest)                                       │
│  ┌────────────────────────────────┬────────────────────────────────────┐│
│  │                                │     Projects  Expertise  Agency   ││
│  │                                │     Contact   MENU (•)            ││
│  └────────────────────────────────┴────────────────────────────────────┘│
├──────────────────────┬──────────────────────────────────────────────────┤
│                      │                                                  │
│  LEFT PANEL          │  RIGHT PANEL (Dynamic Project Area)              │
│  (Fixed/Static)      │                                                  │
│  ~350-400px width    │  - Giant background number (01, 02...)           │
│                      │  - Project image (slides from right)             │
│  ┌────────────────┐  │  - Year label                                    │
│  │   AKARU        │  │  - Category (ART DIRECTION, E-COMMERCE...)       │
│  │   (Logo)       │  │  - Project subtitle/description                  │
│  └────────────────┘  │  - "SEE PROJECT" CTA button                      │
│                      │                                                  │
│  With a focus on...  │                                                  │
│  (Mission text)      │                                                  │
│                      │                                                  │
│  ──────────────────  │                                                  │
│  IG  LN  TW  FB      │  ┌─────────────────────────────────────────────┐ │
│  (Social links)      │  │ • • • •   (Dots)        01/04  (Counter)    │ │
│                      │  └─────────────────────────────────────────────┘ │
└──────────────────────┴──────────────────────────────────────────────────┘
```

---

## SCROLL BEHAVIOR (THE MOST IMPORTANT PART)

### Phase 1: Horizontal Navigation (Scroll-Hijack)
- **Trigger**: User scrolls DOWN while hero is visible
- **Effect**: Instead of page scrolling, projects transition HORIZONTALLY
- **Direction**: Scroll DOWN = next project (01 → 02 → 03 → 04)
- **Direction**: Scroll UP = previous project (04 → 03 → 02 → 01)

### Phase 2: Transition to Vertical
- **Trigger**: User is on LAST project (04) and scrolls DOWN
- **Effect**: Scroll-hijack releases, page scrolls vertically to next section
- **Return**: When scrolling back UP into hero from sections below, scroll-hijack re-engages

### Scroll Sensitivity
- **Threshold**: ~50-100px of scroll delta before triggering transition
- **Cooldown**: ~600-800ms between transitions (prevents rapid cycling)
- **Gesture**: Both wheel and touch/swipe supported

---

## PROJECT SLIDE TRANSITIONS

### When Transitioning to NEXT Project (scroll down):

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Current image | Slide LEFT + fade out | 600ms | ease-out |
| Current number | Scale up 1.1x + fade out + slide left | 600ms | ease-out |
| Current text | Fade out + slide left 20px | 400ms | ease-out |
| New image | Slide in from RIGHT (100% → 0) | 700ms | cubic-bezier(0.32, 0.72, 0, 1) |
| New number | Fade in + scale (0.8 → 1) + slide from right | 700ms | cubic-bezier(0.32, 0.72, 0, 1) |
| New text | Staggered fade in + slide up (y: 20 → 0) | 400-500ms | ease-out, stagger 50-80ms |

### When Transitioning to PREVIOUS Project (scroll up):
- Reverse of above (elements slide RIGHT instead of LEFT)

---

## ELEMENT DETAILS

### 1. Giant Background Number
- **Font size**: ~300-500px (clamp based on viewport)
- **Weight**: 900 (black/heavy)
- **Opacity**: ~0.08-0.12 (very subtle)
- **Color**: Project accent color (each project has unique color)
- **Position**: Right side, vertically centered
- **Letter-spacing**: Negative (-10 to -20px) for tight feel

### 2. Project Image
- **Size**: ~40-45% of right panel width
- **Max-width**: ~500-550px
- **Aspect ratio**: ~4:5 (portrait)
- **Position**: Right side, ~8% from edge, vertically centered
- **Shadow**: Large soft shadow (0 40px 80px rgba(0,0,0,0.4))
- **Border-radius**: 4-8px

### 3. Project Info Stack
- **Position**: Left side of right panel
- **Gap**: 10-12px between elements
- **Max-width**: ~300-350px

#### Year
- Font-size: 12px
- Weight: 500
- Letter-spacing: 2px
- Color: rgba(255,255,255,0.5)

#### Category
- Font-size: 11px
- Weight: 700
- Letter-spacing: 3px
- Color: Project accent color
- Text-transform: uppercase

#### Subtitle/Description
- Font-size: 13-14px
- Weight: 400
- Line-height: 1.6
- Color: rgba(255,255,255,0.6)
- Text-transform: uppercase

#### CTA Button
- Padding: 14px 28px
- Font-size: 11px
- Weight: 700
- Letter-spacing: 2px
- Border: 2px solid (project accent color)
- Color: Project accent color
- Background: transparent
- Hover: Background fills with accent color, text becomes dark

### 4. Navigation Dots
- **Position**: Bottom left of right panel (~60px from edges)
- **Size**: 10px diameter each
- **Gap**: 10px between dots
- **Inactive**: rgba(255,255,255,0.25)
- **Active**: Project accent color + scale 1.4x
- **Hover**: Scale 1.5x
- **Click**: Jumps directly to that project

### 5. Counter
- **Position**: Bottom right of right panel (~60px from edges)
- **Format**: "01/04"
- **Current number**: 44-48px, weight 800, white
- **Total**: 16px, weight 500, rgba(255,255,255,0.4)

### 6. Scroll Indicator (Optional)
- **Position**: Bottom center
- **Text**: "SCROLL" (10px, 600 weight, letter-spacing 3px)
- **Line**: 1px wide, 40px tall, gradient fade
- **Animation**: Subtle pulse/bob animation

---

## LEFT PANEL (FIXED)

### Logo
- Text: "AKARU" (or your brand)
- Font-size: 22-24px
- Weight: 800
- Letter-spacing: 5-6px
- Color: White

### Mission Statement
- Font-size: 14px
- Line-height: 1.9
- Color: rgba(255,255,255,0.5)
- Max-width: 260-280px
- Position: Vertically centered in panel

### Social Links
- Separator: 1px line, rgba(255,255,255,0.1)
- Links: 10px font, 600 weight, letter-spacing 2px
- Color: rgba(255,255,255,0.4)
- Hover: White
- Gap: 24px between links

### Panel Border
- Right border: 1px solid rgba(255,255,255,0.08)

---

## SECTIONS BELOW HERO

After the horizontal project showcase, vertical scrolling reveals:

### 1. Expertise Section
- Horizontal scrolling cards OR grid layout
- Each card has: number, title, tags, CTA link
- Cards animate in on scroll (whileInView)

### 2. About/Agency Section
- Large typography statement
- Value words (creative, passionate, independent)
- Team photos (optional)

### 3. Contact Section
- Email, address, phone
- Social links
- Footer

---

## TIMING SPECIFICATIONS

| Interaction | Delay | Duration |
|-------------|-------|----------|
| Scroll threshold | 0 | - |
| Transition cooldown | - | 600-800ms |
| Image slide | 0ms | 600-700ms |
| Number animation | 0ms | 600-700ms |
| Text stagger start | 100ms | - |
| Text item delay | 50-80ms | 400ms each |
| Hover effects | 0ms | 300ms |
| Dot click feedback | 0ms | 200ms |

---

## EASING CURVES

```css
/* Primary transition (smooth, organic) */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Secondary (snappy) */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Framer Motion default */
--ease-smooth: cubic-bezier(0.32, 0.72, 0, 1);
```

---

## COLOR PALETTE (Per Project)

Each project has a unique accent color used for:
- Background number
- Category text
- CTA button border/hover
- Active dot

Example colors:
```
Project 01: #ff6b5b (coral red)
Project 02: #ff9a3c (orange)
Project 03: #e879f9 (pink/magenta)
Project 04: #00ff88 (green)
```

---

## RESPONSIVE BEHAVIOR

### Desktop (>1100px)
- Full split-screen layout
- Left panel visible

### Tablet (900-1100px)
- Left panel narrower (~280px)
- Image slightly smaller

### Mobile (<900px)
- Left panel hidden entirely
- Full-width project display
- Image as background with overlay
- Info stacked at bottom
- Dots and counter repositioned

---

## MOUSE/CURSOR

The default cursor is VISIBLE on this page. There is no custom cursor hiding. Standard pointer cursor on interactive elements.

---

## KEY DIFFERENCES FROM PREVIOUS IMPLEMENTATIONS

1. **NO AUTO-ADVANCE** — User controls everything via scroll
2. **SCROLL-HIJACK** — Vertical scroll triggers horizontal transitions
3. **THRESHOLD** — Small scrolls are ignored; meaningful scroll triggers transition
4. **COOLDOWN** — Prevents rapid-fire transitions
5. **RELEASE** — At last project, scroll is released for vertical navigation
6. **RE-ENGAGE** — Scrolling back up re-enables horizontal navigation
