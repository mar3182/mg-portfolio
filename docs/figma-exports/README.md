# Living Portrait — Figma Export Guide

## Files Included

| File                         | Purpose                         |
| ---------------------------- | ------------------------------- |
| `living-portrait-layers.svg` | Full layered design (1920×1080) |

---

## How to Import into Figma

1. **File → Import** (or `Cmd/Ctrl + Shift + K`)
2. Select `living-portrait-layers.svg`
3. All elements will be editable groups

---

## Layer Structure

```
Living Portrait
├── Background/
│   ├── Base (dark gradient)
│   ├── Focal-Glow (center light)
│   ├── Warm-Atmosphere (design side)
│   └── Cool-Atmosphere (tech side)
│
├── Shapes/
│   ├── Design-Shapes/
│   │   ├── Shape-Coral
│   │   └── Shape-Orange
│   └── Tech-Shapes/
│       ├── Shape-Purple
│       └── Shape-Blue
│
├── Portraits/
│   ├── Portrait-Design-Left (placeholder)
│   ├── Portrait-Center-Main (placeholder)
│   └── Portrait-Tech-Right (placeholder + circuit overlay)
│
├── Typography/
│   ├── Design-Label ("CREATIVE DESIGNER")
│   ├── Center-Headline ("TECH & DESIGN")
│   ├── Subline
│   └── Tech-Label ("FULL STACK DEVELOPER")
│
├── Navigation/
│   ├── Sidebar-BG
│   ├── Logo
│   ├── Nav-Links
│   └── Nav-Social
│
├── Social-Right/
│   ├── Icons
│   └── Social-Line
│
├── UI/
│   ├── Cursor
│   └── Footer-Hint
│
└── Animation-Guides/ (helper layer)
    ├── Design Zone (0%-35%)
    ├── Neutral Zone (35%-65%)
    ├── Tech Zone (65%-100%)
    └── Scroll-Arrows
```

---

## Color Tokens

### Design Palette (Warm)
| Name   | Hex       | Usage                 |
| ------ | --------- | --------------------- |
| Coral  | `#ff6b5b` | Primary design accent |
| Orange | `#ff9a3c` | Secondary warm        |
| Peach  | `#ffb4a9` | Soft highlight        |

### Tech Palette (Cool)
| Name       | Hex       | Usage               |
| ---------- | --------- | ------------------- |
| Neon Green | `#00ff88` | Primary tech accent |
| Cyan       | `#00e5ff` | Secondary cool      |
| Purple     | `#8b5cf6` | Accent              |
| Blue       | `#3b82f6` | Supporting          |

### Backgrounds
| Name      | Hex       | Usage           |
| --------- | --------- | --------------- |
| Dark Base | `#0a0a0a` | Main background |
| Focal     | `#151515` | Center area     |

---

## Portrait Placeholders

The SVG contains placeholders for the three portraits. In Figma:

1. **Select** the placeholder rectangle
2. **Replace** with your actual portrait images:
   - Left: `portrait-design-left.png` (warm filter)
   - Center: `portrait-base.png` (B&W filter)
   - Right: `portrait-tech-right.png` (tech tint)

---

## Horizontal Animation Concept

The `Animation-Guides` layer shows the three zones:

```
┌─────────────────┬─────────────────┬─────────────────┐
│   DESIGN ZONE   │   NEUTRAL ZONE  │    TECH ZONE    │
│    (0%-35%)     │   (35%-65%)     │   (65%-100%)    │
│                 │                 │                 │
│  ← warm colors  │    balanced     │  cool colors →  │
│  ← design text  │    both visible │  tech text →    │
│  ← left portrait│   center focus  │  right portrait→│
└─────────────────┴─────────────────┴─────────────────┘
         ←── Mouse/Scroll Position ──→
```

**Ideas for horizontal animation:**
- Scroll/drag to move between zones
- Portraits slide in/out from edges
- Typography fades based on position
- Background atmospheres blend

---

## Tips for Figma Editing

1. **Turn off Animation-Guides** layer for clean export
2. **Lock Background** layer while editing portraits
3. **Use Auto Layout** on Navigation for easy reordering
4. **Create variants** for Design/Neutral/Tech states
5. **Add prototyping** with horizontal scroll triggers

---

## Quick Edits You Might Want

### Portrait Size/Position
- Current: Left/Right = 320×540px, Center = 500×750px
- All portraits can be resized freely in Figma
- Consider making them larger/smaller based on emphasis

### Horizontal Layout Ideas
1. **Single portrait that transforms** as you scroll
2. **Carousel** with portraits sliding in sequence
3. **Parallax layers** with different scroll speeds
4. **Full-width portrait** with overlay effects

---

Happy designing! 🎨
