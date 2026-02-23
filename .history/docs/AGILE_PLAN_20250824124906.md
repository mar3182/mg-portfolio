# Agile Delivery & Sprint Planning Guide

This repository follows a lightweight, incremental Agile workflow to evolve the portfolio toward an Akaru-inspired interactive experience.

## 1. Core Principles
1. Always releasable: `main` must stay production ready.
2. Ship user-visible or structural value every sprint.
3. Small, traceable changes (Issue ↔ Branch ↔ PR ↔ Merge).
4. Prefer iteration over big-bang features; deliver vertical slices.
5. Performance, accessibility, and motion quality are first-class.
6. Transparency: everything tracked via Issues (no hidden work).

## 2. Sprint Cadence
Default sprint length: 2 weeks.

| Day     | Ceremony                 | Output                          |
| ------- | ------------------------ | ------------------------------- |
| 1 (AM)  | Planning                 | Sprint Goal + Committed Backlog |
| Daily   | Mini stand-up (async ok) | Yesterday / Today / Blockers    |
| Mid     | Backlog Refinement       | Groomed next sprint candidates  |
| Last −1 | Review Prep              | Demo build & notes              |
| Last    | Review + Retro           | Feedback + Action Items         |

If velocity unclear early, shorten to 1‑week sprints until stable.

## 3. Branching Model
Primary branches:
- `main` – Production. Only from approved sprint or release merges.
- `develop` – (Optional) Integration. Use once parallel sprint work grows.
- `sprint/<NN>-<goal-slug>` – Timeboxed sprint branch (e.g. `sprint/01-expertise-metrics`).

Working branches (always from active sprint branch):
- `feat/<slug>` new feature (e.g. `feat/expertise-section`).
- `fix/<slug>` bug fix.
- `chore/<slug>` tooling / refactor.
- `perf/<slug>` performance improvements.
- `docs/<slug>` documentation changes.

Hotfix (urgent production defect):
1. Branch from `main` → `hotfix/<slug>`.
2. PR back into `main`.
3. Cherry-pick or merge into active sprint branch (and `develop` if used).

## 4. Workflow Steps
1. Create / refine Issue with Acceptance Criteria & estimate.
2. Create branch from sprint branch.
3. Commit using Conventional Commits.
4. Open PR to sprint branch (auto‑link Issue: "Closes #ID").
5. Review (self + peer). Lint/build must pass.
6. Merge (Squash) into sprint branch.
7. End of sprint: Merge sprint branch into `develop` (if used) then PR `develop` → `main` with Release Notes.

## 5. Definition of Ready (DoR)
An Issue is Ready when:
- Clear problem / user value statement.
- Acceptance Criteria defined.
- Dependencies identified.
- Estimation added.
- UX reference / design link (if visual feature) OR explicit "N/A".

## 6. Definition of Done (DoD)
Work item is Done when:
- Acceptance Criteria satisfied & manually verified.
- `pnpm run build` succeeds; no new runtime errors or unhandled rejections.
- `pnpm run lint` passes (no added warnings unless justified & tracked).
- Responsive sanity check (mobile ~375px, mid ~768px, desktop ≥1280px) passes.
- Basic a11y: semantic container, focusable interactive elements, visible focus outline.
- Prefers reduced motion respected OR follow-up Issue created.
- Docs updated (README / component comments if public contract changed).
- Linked Issue closed by merged PR.

## 7. Estimation Scale
- XS (0.5) – micro copy / style tweak
- S (1) – small component or config
- M (2) – component + animation or light data shape
- L (3) – multi-component or complex state
- XL (5) – cross-section feature / multiple states
Anything >5 → split.

## 8. Conventional Commits
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`, `build:`, `ci:`

Optional scope example: `feat(expertise): add category image swap`.

## 9. Backlog Structure
Categories / epics (sample):
- Interaction & Motion
- Content Sections (Expertise, Agency, Projects)
- Performance & Tooling
- Accessibility & SEO
- Visual Polish / Theming

Use labels: `type:feature`, `type:bug`, `type:chore`, `a11y`, `perf`, `design`, `priority:high|med|low`.

## 10. Sample Initial Backlog
| ID  | Title                          | Type    | Est |
| --- | ------------------------------ | ------- | --- |
| #1  | Expertise section skeleton     | feature | 3   |
| #2  | Expertise metrics & counters   | feature | 5   |
| #3  | Custom cursor follower         | feature | 2   |
| #4  | Reduced motion wrapper         | chore   | 1   |
| #5  | Prefetch project detail assets | perf    | 2   |
| #6  | Scroll spy nav dots            | feature | 3   |
| #7  | Accessibility baseline audit   | chore   | 2   |

## 11. Sprint Goal Template
"Improve breadth of content by adding Expertise foundations (section structure + metrics) while maintaining performance (no >5% bundle growth)."

## 12. Acceptance Criteria Template
```
Given <context>
When <action>
Then <observable outcome>

Non-Functional:
- Performance: …
- A11y: …
- Motion: obey reduced motion
```

## 13. Release Notes Template
```
## Sprint <NN> – <Goal> (YYYY-MM-DD)
### Added
- …
### Changed
- …
### Fixed
- …
### Performance/A11y
- …
### Known Issues
- (linked #IDs)
```

## 14. Quality Gates (Manual v1)
Run before merging PR:
1. Lint: `pnpm run lint`
2. Build: `pnpm run build`
3. Local smoke: navigate all routes; check console clean
4. Basic Lighthouse (Performance + A11y ≥ baseline -5)
5. Tab through interactive elements

## 15. Future Automation (Planned)
- GitHub Action: lint + build on PR
- Preview deploy (Vercel / Netlify) per PR
- Playwright smoke tests (core routes load without error)
- Visual regression snapshots (later)

## 16. Risk & Debt Tracking
If a known compromise is made, create `type:chore` issue tagged `debt` with context & exit criteria.

## 17. Security & Secrets
No secrets committed. Use `.env` (gitignored) for any API keys (future). Document additions in README.

---
Living document — refine after each retrospective.
