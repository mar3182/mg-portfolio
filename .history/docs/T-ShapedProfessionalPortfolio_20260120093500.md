T-Shaped Professional Portfolio
Immersive Hero Navigation System
AI Coding Agent Documentation
01 — Project Overview
Objective

Build an award-level, immersive hero experience that spatially expresses a T-shaped professional:

Horizontal axis → breadth of thinking (Design ↔ Technology)

Vertical axis → depth of execution

Portrait → emotional and spatial anchor

This is not a traditional portfolio.
Navigation is the concept.

02 — Core Concept
One Sentence

A T-shaped professional expressed as a navigable space, where breadth is explored horizontally, depth vertically, and identity is felt through motion.

Core Principle

The interface represents a mind, not a UI.

Users should feel they are:

Exploring how I think

Choosing a direction of attention

Going deeper only after committing

03 — Mental Model
Axes Definition
Horizontal Axis — Breadth

Continuous spectrum from Design to Technology

Represents mindset, philosophy, approach

Controlled via mouse / trackpad horizontal movement

Vertical Axis — Depth

Represents execution, detail, craft

Becomes meaningful only after horizontal intent

Controlled via vertical scroll

04 — Identity Axis (Global State)
Definition

A single continuous value:

identity ∈ [0 … 1]

Value	Meaning
0	Design
0.5	Neutral / Dual Identity
1	Technology
Implementation Rule

All systems derive from this single motion value.

No duplicated logic.
No independent animation states.

05 — Technical Architecture
ROOT EXPERIENCE
│
├── Identity Controller (useMotionValue)
│
├── Portrait System
│   ├── Gaze direction
│   ├── Opacity blending
│   └── Subtle parallax
│
├── Environment System
│   ├── Background gradients
│   ├── Decorative layers
│   └── Motion mood
│
└── Navigation System
    ├── Horizontal scrub
    ├── Vertical depth unlock
    └── Axis constraints

06 — Portrait System Specification
Purpose

The portrait is:

The axis origin

The emotional guide

The constant presence

It does not move out of the way.
The world re-orients around her attention.

States
Identity	Portrait
Design	Looks left
Neutral	Split / forward
Tech	Looks right
Motion Rules

Crossfade between states

No scaling

No rotation

Subtle parallax only (±15–20px)

Timing

Slight delay behind identity changes

Slow easing

Cinematic restraint

07 — Navigation Design
Horizontal Navigation (Primary)

Intent:
Feels like scrubbing through ways of thinking.

Characteristics:

Momentum-based

Resistance near center

Softer at edges

No visible scrollbar

Behavior:

Drives identity axis

Influences entire environment

Vertical Navigation (Secondary)

Intent:
Feels like drilling into depth.

Rules:

Minimal effect near identity center

Progressively unlocks toward edges

Slower than standard scroll

This teaches:

Choose a direction, then go deep.

08 — Visual Language System
Design Side (Left)

Organic forms

Warmer tones

Fluid motion

Natural rhythms

Tech Side (Right)

Structured forms

Cooler tones

Grid / matrix logic

Precise motion

Neutral

Calm

Balanced

Minimal contrast

09 — Motion Timing Specification
Global Principles

Motion reacts slightly slower than input

Long easing > fast response

Weight over responsiveness

Identity Axis Motion
Property	Value
Type	Spring
Stiffness	40–60
Damping	25–30
Mass	~1
Dead zone	±5% around center
Portrait Motion
Aspect	Spec
Parallax	±15–20px
Opacity	Crossfade
Delay	80–120ms
Easing	easeOut / spring
Environment Motion
Layer	Behavior
Background	Slow color interpolation
Decorative	Low-frequency oscillation
Grain	Static
Vertical Motion
Property	Spec
Activation	After horizontal commitment
Speed	Slower than native scroll
Easing	easeInOut
Idle Behavior

After ~2–3 seconds:

Identity drifts toward center

Motion slows

Environment calms

10 — UX Rules (Non-Negotiable)

No visible scrollbars

No early explanation

Discovery through interaction

Portrait remains emotionally central

Fewer elements > more features

11 — Technical Constraints

React

Framer Motion

Tailwind-compatible

Desktop-first

Accessible motion

No Three.js / WebGL

Production-ready code

12 — One-Screen MVP Build Plan
Goal

One screen that communicates the entire concept, even without projects.

MVP Steps

Identity Controller

Single motion value

Mouse X → identity

Idle reset

Hero Portrait

3 states

Opacity blend

Parallax

Environment Reaction

Background gradient interpolation

One organic layer

One structured layer

Axis Constraints

Vertical muted at center

Vertical unlocks toward edges

Minimal Orientation Cue

“Design” / “Technology”

Brief, subtle, fades out

Stop Here

If this screen works, the system works.
Do not add projects yet.

13 — Judge-Facing Concept Statement

The T-Shaped Mind

This portfolio translates the concept of a T-shaped professional into a navigable space.

Horizontal movement represents breadth — how I move between design and technology.
Vertical movement represents depth — how deeply I execute within each domain.

The portrait sits at the intersection of both axes, acting as an emotional and conceptual anchor.
As the visitor explores, the environment responds to the direction of attention.

Navigation is not an interface layer — it is the narrative.

14 — Success Criteria

A visitor should feel:

“I’m exploring a mind, not a website”

“This person thinks in systems”

“Design and engineering are inseparable”

A judge should feel:

Conceptual clarity

Confidence

Restraint

Originality without gimmicks

15 — Final Instruction to the AI Agent

Favor fewer elements, slower motion, and stronger intent.
If an element does not reinforce breadth vs depth, remove it.