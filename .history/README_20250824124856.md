# M.G. Portfolio V2 - T-Shaped Professional

> A modern, immersive portfolio website featuring horizontal and vertical scrolling animations that visually represent the T-shaped professional concept.

## 🎨 Design Philosophy

This portfolio is designed around the concept of a **T-shaped professional** - someone with broad knowledge across multiple disciplines (horizontal bar) and deep expertise in specific areas (vertical bar). The design translates this concept into a visual experience through:

- **Horizontal scrolling animations** that represent breadth of knowledge
- **Vertical content depth** within each section showing specialization
- **Color-coded sections** that create distinct spaces for different expertise areas
- **Smooth transitions** that connect all areas of knowledge seamlessly

## ✨ Key Features

### 🎭 Visual Design
- **Immersive scrolling experience** with horizontal movement between sections
- **Color palette** inspired by modern design trends (cream, sage, dusty rose, lavender, soft blue)
- **Typography hierarchy** with bold, readable fonts and careful spacing
- **T-shaped visual metaphor** integrated throughout the design
- **Responsive design** that works beautifully on all devices

### 🎬 Animations & Interactions
- **Horizontal scroll effect** triggered by vertical scrolling
- **Parallax backgrounds** with morphing geometric shapes
- **Staggered content animations** as sections come into view
- **Floating card animations** for visual interest
- **Hover effects** with smooth micro-interactions
- **Loading animations** for enhanced user experience

### 🏗 Technical Architecture
- **React 18** with modern functional components and hooks
- **Framer Motion** for advanced animations and scroll-triggered effects
- **Tailwind CSS** for responsive design and utility-first styling
- **Vite** for fast development and optimized production builds
- **Modern JavaScript** (ES6+) with clean, maintainable code

## 📱 Sections Overview

### 🏠 Home
- Hero section with animated T-shaped visual
- Professional tagline and call-to-action
- Smooth introduction to the portfolio experience

### 👨‍💻 About
- T-shaped professional explanation
- Experience timeline with achievements
- Skills and personality traits
- Quick facts and CV download

### 🎯 Expertise
- Three main areas: Frontend, Backend, UI/UX Design
- Detailed skill breakdowns
- Experience metrics and project counts
- Interactive skill tags

### 💼 Projects
- Six featured projects with detailed descriptions
- Performance metrics and impact statements
- Technology stack for each project
- Visual project cards with hover effects

### 📞 Contact
- Contact form with validation
- Professional contact information
- Availability status indicator
- Social media links

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager
- Git for version control

### Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd mg-portfolio-v2

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm run dev

# Open http://localhost:5173 in your browser
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## 🎨 Customization Guide

### Colors
The color palette is defined in CSS custom properties in `src/App.css`:
```css
:root {
  --color-cream: #f5f5dc;
  --color-sage: #9caf88;
  --color-dusty-rose: #d4a5a5;
  --color-lavender: #b8a9d4;
  --color-soft-blue: #a8c8e1;
  --color-charcoal: #2d2d2d;
}
```

### Content
Update the following files to customize content:
- **Personal information:** `src/App.jsx` (name, contact details, bio)
- **Projects:** Update the `projects` array in `src/App.jsx`
- **Experience:** Update the `experience` array in `src/App.jsx`
- **Skills:** Update the `expertise` array in `src/App.jsx`

### Animations
Animations are controlled through Framer Motion variants in `src/App.jsx`:
- **Scroll animations:** Adjust `useScroll` and `useTransform` values
- **Stagger effects:** Modify `staggerContainer` variants
- **Hover effects:** Update CSS classes in `src/App.css`

## 📊 Performance

### Lighthouse Scores
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 95+

### Optimizations
- Code splitting with dynamic imports
- Image optimization and lazy loading
- CSS purging for smaller bundle sizes
- Gzip compression for static assets
- Reduced motion support for accessibility

## 🌐 Browser Support

- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+, Samsung Internet 14+
- **Features:** CSS Grid, Flexbox, CSS Custom Properties, ES6+

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints at:
- **Mobile:** 320px - 768px
- **Tablet:** 769px - 1024px
- **Desktop:** 1025px+

Special considerations:
- Touch-friendly interactions on mobile
- Simplified animations on smaller screens
- Optimized typography scaling
- Landscape orientation support

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader optimization
- High contrast mode support
- Reduced motion preferences

### Focus Management
- Visible focus indicators
- Logical tab order
- Skip navigation links
- ARIA labels where needed

## 🔧 Technical Details

### Dependencies
```json
{
  "react": "^18.2.0",
  "framer-motion": "^10.16.4",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.0"
}
```

### Build Output
- **HTML:** Minified with meta tags
- **CSS:** Purged and compressed (~17KB gzipped)
- **JavaScript:** Tree-shaken and minified (~113KB gzipped)
- **Assets:** Optimized images and fonts

### File Structure
```
mg-portfolio-v2/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   └── ui/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions including:
- Static hosting (Vercel, Netlify, GitHub Pages)
- DigitalOcean App Platform
- DigitalOcean Droplet with Nginx
- Docker containerization

## 🤝 Contributing & Agile Workflow

This project uses timeboxed sprint branches. See `docs/AGILE_PLAN.md` for full process.

Quick start:

1. Ensure an Issue exists (or create one using templates).
2. Checkout sprint branch (e.g. `sprint/01-expertise-metrics`).
3. Create feature branch: `git checkout -b feat/<slug>`.
4. Commit with Conventional Commits (`feat(expertise): ...`).
5. Open PR to sprint branch (auto-link Issue: "Closes #ID").
6. Pass lint & build; request review; merge (squash).

Artifacts:

- Plan: `docs/AGILE_PLAN.md`
- Sprint Backlog Template: `docs/SAMPLE_SPRINT_BACKLOG.md`
- Issue Templates: `.github/ISSUE_TEMPLATE/`
- PR Template: `.github/pull_request_template.md`

Definition of Done highlights:

- Build & lint pass
- No new console errors
- Responsive & accessible baseline
- Motion respects reduced motion (or follow-up Issue)
- Docs updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design inspiration:** Modern web design trends and Akaru.fr
- **Animation library:** Framer Motion team
- **Icons:** Lucide React
- **Styling:** Tailwind CSS team
- **Build tool:** Vite team

## 📞 Contact & Author

**M.G.** - T-Shaped Professional
- **Email:** hello@mg-portfolio.com
- **Phone:** +1 (555) 123-4567
- **Location:** New York, NY

---

**Built with ❤️ and modern web technologies to showcase the T-shaped professional concept.**

