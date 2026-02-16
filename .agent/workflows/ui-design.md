---
description: UI/UX design guidelines for building premium interfaces
---

# UI/UX Design Prompt Template

## Design Checklist

Before building any UI, define these:

- [ ] **Project context** — What problem does this solve? Who uses it?
- [ ] **Aesthetic direction** — Minimalist, Maximalist, Retro, Luxury, Playful, Brutalist, Dark/Moody
- [ ] **Visual references** — Name 2-3 real products (Linear, Stripe, Spotify, etc.)
- [ ] **Color palette** — Specific hex codes for dark/light modes
- [ ] **Typography** — Named fonts (not "clean font")
- [ ] **Animations** — Timing, easing, triggers, stagger delays
- [ ] **Dark mode** — Pure black (#000000) + accent colors
- [ ] **Interaction details** — Hover, click, focus states
- [ ] **What NOT to do** — Constraints/boundaries
- [ ] **Responsive** — Mobile-first approach
- [ ] **Accessibility** — WCAG AA contrast, keyboard nav

## Animation Guidelines

Be explicit with animations:

- **Page load**: Cards fade in from bottom with 80ms stagger
- **Hover**: Lift effect (2px up) + shadow, 200ms ease-out
- **Transitions**: Use `cubic-bezier(0.16, 1, 0.3, 1)` for snappy feel
- **Duration**: 200-400ms for interactions, 500-800ms for page transitions

## Dark Mode Best Practices

- Background: Pure black (#000000)
- Surface elements: Use `rgba(255,255,255, 0.04-0.08)` overlays
- Text: #FFFFFF primary, #A0A0A0 secondary
- Borders: Very subtle `rgba()` with low opacity
- Shadows: `rgba()` with low opacity
- All elements must pass WCAG AA contrast

## Typography Hierarchy

- Display: 2.5rem, weight 700
- H1: 2rem, weight 700
- H2: 1.5rem, weight 600
- Body: 1rem, weight 400
- Small: 0.875rem, weight 400
- Caption: 0.75rem, weight 500

## Color Selection

- Pick ONE dominant accent (not two competing ones)
- Use 3-4 shades of neutral for depth
- Accent should pass contrast on both dark and light backgrounds
- Danger/Success: Red/Green that work in both modes

## What to AVOID

- Generic fonts without personality
- Overused color schemes (plain blue/red/green)
- No animation states (static feels dead)
- Gray-on-gray dark mode (use true black)
- AI-generated placeholder aesthetics
