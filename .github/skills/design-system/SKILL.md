---
name: design-system
description: Defines how to use the project design system tokens, theme variables, and responsive breakpoints.
---

## Design System

- Treat `src/app/src/design-system/` as the source of truth for shared styling primitives.
- Keep component-level styles focused on layout and composition; put reusable tokens and rules in design-system files.
- Use project theme variables from `src/app/src/design-system/theme.scss`; do not duplicate color values in feature/component styles.
- For responsive behavior, use mixins and tokens from `src/app/src/design-system/breakpoints.scss`.

## Breakpoints

- Prefer `@include media-up(...)`, `@include media-down(...)`, and `@include media-between(...)` over raw `@media` queries.
- Use named breakpoints (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) for consistency.
- Keep breakpoint choices intentional and minimal; avoid adding one-off pixel values unless strictly necessary.

## Token Usage

- Reuse existing CSS custom properties (`--bs-*`) from theme scope instead of introducing ad-hoc color/shadow/radius values.
- Keep spacing and typography choices aligned with existing project conventions and Bootstrap scale.
- If a new reusable token is needed, add it to the design system rather than a single component file.

## Maintainability

- Prefer small, composable SCSS abstractions over deeply nested selectors.
- Avoid style duplication across sections; extract repeated patterns into shared design-system utilities where appropriate.
- Keep naming clear and descriptive for future contributors.
