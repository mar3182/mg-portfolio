# ASSET CREATION BRIEF

## 🎯 Doel

Dit document beschrijft alle visuele assets die nodig zijn voor het T-Portfolio. Het principe is **authenticiteit boven gemak** — elk beeld moet menselijk gemaakt of gefotografeerd zijn, geen AI-generatie of stock.

---

## 📸 PORTRET FOTOGRAFIE

### Overzicht
We hebben **3 portretvarianten** nodig van dezelfde persoon, allen vanuit dezelfde fotoshoot voor consistentie.

### Specificaties

| Variant    | Houding                 | Kleur/Sfeer                      | Bestandsnaam          |
| ---------- | ----------------------- | -------------------------------- | --------------------- |
| **Center** | Frontaal, naar camera   | B&W, neutraal, kalm              | `portrait-center.png` |
| **Design** | 3/4 profiel naar links  | Warme tinten (amber, terracotta) | `portrait-design.png` |
| **Tech**   | 3/4 profiel naar rechts | Koele tinten (blauw, cyaan)      | `portrait-tech.png`   |

### Technische Eisen
- **Resolutie**: Minimaal 2000 x 3000 pixels (portrait orientation)
- **Formaat**: PNG met transparante achtergrond
- **Belichting**: Zachte, diffuse verlichting voor makkelijke kleurbewerking
- **Kleding**: Neutraal, tijdloos (donkere of witte effen kleding werkt het best)
- **Achtergrond bij shoot**: Effen wit of grijs voor makkelijke uitsnede

### Nabewerking
- **Center**: Conversie naar genuanceerd B&W met lichte contrast boost
- **Design**: Warm color grade, zachte schaduw, artistiek gevoel
- **Tech**: Koel color grade, scherpe details, technisch gevoel

### Uitdrukkingen
- **Center**: Rustig, uitnodigend, licht tevreden — "Ik wacht op je"
- **Design**: Creatief peinzend, naar iets kijkend buiten frame links
- **Tech**: Gefocust, analytisch, naar iets kijkend buiten frame rechts

---

## 🎨 HANDGEMAAKTE ACHTERGRONDEN

### Design World Achtergrond

| Asset                   | Techniek            | Beschrijving                |
| ----------------------- | ------------------- | --------------------------- |
| `bg-design-organic.png` | Aquarel of olieverf | Abstracte warme achtergrond |

**Specificaties:**
- **Grootte**: 3000 x 2000 pixels minimum
- **Kleuren**: Terracotta, amber, gebroken wit, zachte oker
- **Stijl**: Organisch, vloeiend, asymmetrisch
- **Voorkeur**: Echte verf op papier/doek, gescand in hoge resolutie

**Voorbeeld referentie:**
- Mark Rothko's kleurvelden (maar warmer/lichter)
- Abstract expressionisme met zachte randen

### Tech World Achtergrond

| Asset              | Techniek | Beschrijving                 |
| ------------------ | -------- | ---------------------------- |
| `bg-tech-grid.svg` | Vector   | Subtiel circuit/grid patroon |

**Specificaties:**
- **Formaat**: SVG (vector, schaalbaar)
- **Elementen**: Dunne lijnen, nodes, connecties
- **Kleuren**: Zeer subtiel blauw (#3a7cc4) op donker (#0f1419)
- **Opaciteit**: Laag (3-8%) — het moet amper zichtbaar zijn

**Optie**: Dit kan ook gecodeerd worden (CSS/SVG), al zou een getekende versie beter zijn.

---

## 📄 TEXTUREN

### Papier Textuur

| Asset               | Bron                 | Gebruik              |
| ------------------- | -------------------- | -------------------- |
| `texture-paper.png` | Scan van echt papier | Design world overlay |

**Specificaties:**
- **Bron**: Hoogwaardig tekenpapier of aquarelpapier
- **Scan**: 600 DPI, seamless tileable
- **Grootte**: 1000 x 1000 pixels
- **Bewerking**: Converteren naar grayscale, normaliseren levels

### Canvas/Doek Textuur

| Asset                | Bron               | Gebruik              |
| -------------------- | ------------------ | -------------------- |
| `texture-canvas.png` | Scan van echt doek | Design world overlay |

**Specificaties:**
- Idem als papier textuur
- **Bron**: Echt schildersdoek (linnen of katoen)

---

## 🖌️ DECORATIEVE ELEMENTEN

### Penseel-Strokes

| Asset                | Techniek                     | Beschrijving                 |
| -------------------- | ---------------------------- | ---------------------------- |
| `brush-stroke-1.svg` | Handgeschilderd + vectorized | Horizontale vloeiende stroke |
| `brush-stroke-2.svg` | Handgeschilderd + vectorized | Diagonale beweging           |
| `brush-stroke-3.svg` | Handgeschilderd + vectorized | Subtiele accent mark         |

**Proces:**
1. Schilder strokes met echte verf op papier (inkt of acryl)
2. Scan in hoge resolutie (600 DPI)
3. Vectoriseer in Illustrator (Image Trace met verfijning)
4. Exporteer als schaalbare SVG

**Kleuren**: Monochroom (zwart), kleur wordt via CSS toegepast

### Inkt Spetters

| Asset            | Techniek             | Beschrijving                |
| ---------------- | -------------------- | --------------------------- |
| `ink-splash.png` | Echte inkt op papier | Organische spetter patronen |

**Specificaties:**
- **Techniek**: Drop echte inkt op papier, laat drogen, scan
- **Resolutie**: 600 DPI scan
- **Bewerking**: Transparante achtergrond, alleen de inkt behouden

### Botanische Elementen

| Asset             | Techniek                  | Beschrijving        |
| ----------------- | ------------------------- | ------------------- |
| `botanical-1.svg` | Handgetekend + vectorized | Subtiel blad of tak |
| `botanical-2.svg` | Handgetekend + vectorized | Variatie            |

**Specificaties:**
- **Stijl**: Minimalistisch, lijn-tekening, niet te gedetailleerd
- **Formaat**: SVG, enkele kleur
- **Gebruik**: Decoratieve accenten in Design world

---

## 🖼️ PROJECT VISUALS

### Per Project Nodig

| Type              | Beschrijving                    | Formaat            |
| ----------------- | ------------------------------- | ------------------ |
| **Hero Image**    | Hoofd projectbeeld              | 1920 x 1080 px min |
| **Process Shots** | Schetsen, wireframes, iteraties | Variabel           |
| **Detail Shots**  | Close-ups van craftsmanship     | 800 x 800 px min   |

### Principes

1. **Echte screenshots** van werkende applicaties
2. **Echte foto's** van fysiek werk (print, verpakking)
3. **Proces documentatie** — schetsen, notities, whiteboard
4. **Geen mockups** tenzij absoluut noodzakelijk
5. **Consistente belichting** en stijl per project

---

## ✅ CHECKLIST

### Prioriteit 1 — Onmisbaar
- [ ] Portrait center (B&W)
- [ ] Portrait design (warm)
- [ ] Portrait tech (cool)

### Prioriteit 2 — Sfeer bepalend
- [ ] Achtergrond design (aquarel)
- [ ] Papier textuur scan
- [ ] Canvas textuur scan

### Prioriteit 3 — Verfijning
- [ ] Penseel-strokes (3x)
- [ ] Inkt spatters
- [ ] Botanische elementen (2x)

### Prioriteit 4 — Projectwerk
- [ ] Project hero images (per project)
- [ ] Process documentatie
- [ ] Detail shots

---

## 📝 NOTITIES

### Waarom Geen AI?

1. **Authenticiteit** — Klanten betalen voor menselijke creativiteit, niet algoritmes
2. **Differentiatie** — In een wereld vol AI-content, valt handgemaakt werk op
3. **Consistentie** — Menselijke input garandeert samenhangende visuele taal
4. **Verhaal** — Elk handgemaakt element heeft een verhaal

### Waarom Geen Stock?

1. **Uniciteit** — Niemand anders heeft dezelfde beelden
2. **Merkidentiteit** — Custom beelden versterken het merk
3. **Kwaliteitscontrole** — Volledige controle over visuele taal

### Investering vs. Rendement

De investering in authentieke assets betaalt zich terug door:
- Hogere klantperceptie van waarde
- Betere conversie van bezoekers naar leads
- Sterker onderscheidend vermogen in markt
- Portfolio dat zelf het bewijs is van ambacht

---

*Document versie 1.0 — Februari 2025*
