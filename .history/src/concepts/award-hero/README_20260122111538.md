# Award Hero Concept

An award-winning portfolio hero design with sophisticated interactions and controlled imperfection.

## Access

Navigate to: `http://localhost:5173/concepts/award-hero`

## Features Implemented

### 1. ✅ Navigation with Character
- **Magnetic text effect** - nav items follow cursor with spring physics
- **Micro-interactions** - smooth hover animations
- **Creative section names:**
  - Works → **Selected Work**
  - Blogs → **Thoughts**
  - Contact → **Let's Collaborate**

### 2. ✅ Motion Throughout
- **Parallax portraits** - subtle mouse-tracking on all three portraits
- **Matrix particles** - gently drifting background particles
- **Rotating gradient shapes** - organic shapes slowly rotating
- **Hair flow animation** - subtle strand movement on warm portrait
- **Circuit pattern reveal** - animated SVG paths on tech portrait

### 3. ✅ Typography with Animation
- **Letter-spacing animation** on "TECH & DESIGN" during load
- **Human subline**: "Where systems meet emotion"
- **Staggered reveal** timing for visual hierarchy

### 4. ✅ Personal Manifesto
> "I design digital experiences where logic and emotion coexist."

### 5. ✅ Controlled Imperfection (Asymmetry)
- Center portrait **offset vertically** by 30px
- Purple gradient shape **bleeds outside** the grid
- **Decorative stars** at non-grid positions
- Typography **not centered** - left-aligned with offset

### 6. ✅ Custom Cursor System
- **Default state** - minimal ring cursor
- **Link state** - expanded with glow
- **View state** - large circle with "View" text

## Portrait Images

Place your portrait images in the `public/concepts/award-hero/` directory:
- `portrait-left.png` - Tech/Matrix version (profile view, green tint)
- `portrait-center.png` - Main B&W portrait (front facing)
- `portrait-right.png` - Warm/Creative version (profile view, orange/red tones)

For testing without images, the component shows gradient placeholders.

## Customization

### Colors
Edit `styles/award-hero.css`:
- Matrix green: `#00ff88`
- Pink accent: `#FF6B9D`
- Purple blob: `#8B5CF6`
- Orange accent: `#FF9F43`

### Animation Speeds
Edit individual component files to adjust:
- `GradientShapes.jsx` - rotation speeds
- `MatrixParticles.jsx` - particle drift speeds
- `HeroPortraits.jsx` - parallax intensities

## Technical Notes

- Uses **Framer Motion** for all animations
- **Spring physics** for cursor and magnetic effects
- **CSS-in-JS via motion styles** for dynamic parallax
- Fully **responsive** with mobile fallbacks
- **Cursor hidden on mobile** (touch devices)
