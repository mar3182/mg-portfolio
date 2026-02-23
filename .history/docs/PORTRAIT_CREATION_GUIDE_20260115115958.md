# Creating Your Split-Portrait Image

This guide explains how to create the dual-identity portrait effect like Adham Dannaway's website.

## Required Images

You need **3 versions** of your portrait:

1. **`portrait-base.png`** - The clean, unedited forward-facing portrait
2. **`portrait-design.png`** - The "designer" side with artistic treatment
3. **`portrait-tech.png`** - The "coder" side with digital treatment

## Step 1: Take the Base Photo

### Requirements:
- **Forward-facing** portrait (looking directly at camera)
- **Neutral expression** (slight confidence, approachable)
- **Clean background** (white, gray, or remove later)
- **High resolution**: Minimum 1200x1600px, ideally 2000x2600px
- **Good lighting**: Even, soft lighting on both sides of face
- **From chest up**: Include shoulders and some torso

### Tips:
- Use a tripod for consistency
- Wear a simple, neutral-colored shirt (like Adham's white t-shirt)
- Hair styled neatly
- Stand/sit straight

---

## Step 2: Prepare the Base Image

### In Photoshop/GIMP:
1. Open your photo
2. **Remove background** or make it transparent
3. **Crop** to focus on head/shoulders
4. **Color correct** for even skin tones
5. **Export** as `portrait-base.png` (PNG with transparency)

---

## Step 3: Create the Design Side

This is the LEFT side - artistic, painterly, colorful.

### Option A: Manual in Photoshop
1. Duplicate `portrait-base.png`
2. Create a layer mask for the left half
3. Apply artistic effects:
   - **Watercolor/paint strokes** overlayed on skin
   - **Bold splashes** of color (orange, teal, yellow, pink)
   - **Organic brush strokes** that follow facial contours
   - **Drip effects** going downward
   - **Textured overlays** (paint, paper grain)
4. Keep the eye visible through the paint
5. Export as `portrait-design.png`

### Option B: AI Generation (Midjourney)
```
/imagine portrait photo of a person, left half transformed into 
abstract painted art, colorful paint splashes covering face, 
watercolor strokes, artistic editorial style, 
orange teal yellow paint drips, high fashion --ar 3:4 --v 6
```

### Option C: Photoshop Actions/Plugins
- **Topaz Studio 2** - Artistic AI effects
- **Filter Forge** - Painting effects
- **Prisma** - Style transfer
- **Action sets** from Envato Elements

### Key Design Elements:
- 🎨 Paint splashes (watercolor feel)
- 🖌️ Brush strokes visible
- 🌈 Colors: warm oranges, teals, yellows
- 💧 Organic, flowing, imperfect
- 👁️ Keep at least one eye partially visible

---

## Step 4: Create the Tech Side

This is the RIGHT side - digital, code, geometric.

### Option A: Manual in Photoshop
1. Duplicate `portrait-base.png`
2. Create a layer mask for the right half
3. Apply tech effects:
   - **Code snippets** floating around (HTML, CSS, JS)
   - **Geometric patterns** or grid lines
   - **Matrix/glitch effects**
   - **Cool blue color grading**
   - **Tech keywords**: HTML5, CSS3, React, Node.js
4. Export as `portrait-tech.png`

### Option B: AI Generation
```
/imagine portrait photo of a developer, right half showing 
floating code snippets, html css tags overlay, digital matrix effect,
tech aesthetic, blue color grading, geometric lines --ar 3:4 --v 6
```

### Key Tech Elements:
- 💻 Code snippets: `<html>`, `{ color: #000; }`, `function()`
- 📐 Geometric lines and grids
- 🔵 Colors: cool blues, white text
- ⚡ Clean, precise, digital
- 🔲 Monospace fonts for code

---

## Step 5: File Placement

Place all three images in the `/public/` folder:

```
public/
├── portrait-base.png
├── portrait-design.png
└── portrait-tech.png
```

---

## Recommended Dimensions

| Image | Size | Format |
|-------|------|--------|
| `portrait-base.png` | 800×1000px | PNG-24 with alpha |
| `portrait-design.png` | 800×1000px | PNG-24 with alpha |
| `portrait-tech.png` | 800×1000px | PNG-24 with alpha |

**Tip**: Keep file sizes under 500KB each for performance. Use TinyPNG to compress.

---

## AI Tools for Creating the Effect

### 1. **Midjourney** (Recommended)
Best for artistic/painterly side. Use image-to-image with your photo.

### 2. **DALL-E 3** (ChatGPT Plus)
Good for both sides. Upload your photo and describe the transformation.

### 3. **Stable Diffusion + ControlNet**
Most control. Use your photo as input with artistic style LoRAs.

### 4. **Adobe Firefly**
Integrated in Photoshop. Use Generative Fill to add effects.

### 5. **Canva**
Has "Magic Edit" features and artistic filters that can help.

---

## Quick Photoshop Workflow

```
1. Open portrait
2. Duplicate layer twice (Design, Tech)
3. Design layer:
   - Add layer mask (gradient left→right, white→black)
   - Apply Filter > Filter Gallery > Artistic > Watercolor
   - Add paint brush overlay layer
   - Blend mode: Multiply/Overlay
4. Tech layer:
   - Add layer mask (gradient right→left, white→black)
   - Add code text layers
   - Apply slight blue color overlay
5. Export each layer separately as PNG
```

---

## Testing the Effect

Once you have all three images:

1. Run the dev server: `pnpm run dev`
2. Navigate to http://localhost:5173
3. Move your mouse left/right to see the split effect
4. Adjust images if needed

---

## Fallback / Placeholder

If you don't have images yet, create simple placeholders:

```bash
# Create placeholder images
convert -size 800x1000 xc:gray public/portrait-base.png
convert -size 800x1000 xc:orange public/portrait-design.png  
convert -size 800x1000 xc:blue public/portrait-tech.png
```

Or use a stock photo as a starting point to test the component.

---

## Need Help?

Common issues:
- **Images not showing**: Check file paths are exact (`/portrait-base.png`)
- **Misaligned**: All 3 images must be identical dimensions
- **Slow loading**: Compress images to under 500KB each
- **Harsh split**: Add feathering to the edges of your treatments
