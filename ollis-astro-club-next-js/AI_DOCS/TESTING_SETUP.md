# Testing & Storybook Setup

**Date:** March 24, 2026  
**Status:** ✅ Complete

## Overview

Added comprehensive component testing and documentation system using Storybook and Vitest.

## What Was Added

### Storybook (v10.3.3)

**Purpose:** Interactive component showcase and documentation

**Features:**
- ✅ Visual component library at `/ui-library` route
- ✅ Dark/light theme switching
- ✅ Accessibility testing with a11y addon
- ✅ Automated documentation from TypeScript types
- ✅ Responsive preview modes

**Available Scripts:**
```bash
npm run storybook         # Dev server at localhost:6006
npm run build-storybook   # Build static site → public/storybook-static
```

**Public Access:**
- Built Storybook is served at `/ui-library` via Next.js rewrites
- No separate deployment needed — part of Next.js build

**Stories Created:**
- `components/ui/Button.stories.tsx` — All button variants
- `components/ui/Card.stories.tsx` — Card with/without rotation
- `components/ui/Badge.stories.tsx` — All badge variants
- `components/ui/ThemeToggle.stories.tsx` — Theme toggle component

### Unit Testing (Vitest + React Testing Library)

**Purpose:** Automated component behavior testing

**Features:**
- ✅ Fast unit testing with Vitest
- ✅ React Testing Library for component testing
- ✅ jsdom environment for DOM simulation
- ✅ @testing-library/jest-dom matchers
- ✅ Separate test projects (unit vs. Storybook browser tests)

**Available Scripts:**
```bash
npm test              # Run all unit tests once
npm run test:watch    # Watch mode (re-runs on changes)
npm run test:ui       # Interactive UI test runner
```

**Tests Created:**
- `components/ui/Button.test.tsx` — 6 tests (variants, props, disabled state)
- `components/ui/Card.test.tsx` — 5 tests (children, className, rotate)
- `components/ui/Badge.test.tsx` — 6 tests (variants, className, children)

**Test Results:** ✅ All 17 tests passing

### Configuration Files

**New Files:**
- `.storybook/main.ts` — Storybook configuration
- `.storybook/preview.ts` — Theme integration, global styles
- `vitest.config.ts` — Vitest with dual projects (unit + Storybook)
- `vitest.setup.ts` — Testing library setup
- `TESTING.md` — Complete testing documentation

**Modified Files:**
- `package.json` — Added test & Storybook scripts
- `next.config.ts` — Rewrites for `/ui-library` route
- `.gitignore` — Ignore Storybook build output

## Package Dependencies Added

### Storybook Core:
- `storybook` ^10.3.3
- `@storybook/nextjs-vite` ^10.3.3
- `@storybook/addon-themes` (for theme switching)
- `@storybook/addon-a11y` (accessibility checks)
- `@storybook/addon-docs` (automated docs)
- `@storybook/addon-vitest` (story-based tests)
- `@chromatic-com/storybook` ^5.0.2

### Testing:
- `vitest` ^4.1.1
- `@vitest/ui` ^4.1.1 (interactive test runner)
- `@vitest/browser-playwright` ^4.1.1
- `@vitest/coverage-v8` ^4.1.1
- `@testing-library/react` (component testing)
- `@testing-library/jest-dom` (DOM matchers)
- `@testing-library/user-event` (user interaction simulation)
- `@vitejs/plugin-react` ^6.0.1 (React support for Vite)
- `jsdom` (DOM environment)
- `playwright` ^1.58.2 (browser automation)

### Build Tools:
- `vite` ^8.0.2 (bundler for Storybook)
- `eslint-plugin-storybook` ^10.3.3

## Design System Integration

Storybook is fully integrated with the hand-drawn design system:

**Theme Support:**
- Global styles imported from `app/globals.css`
- CSS variables for colors, borders, shadows
- Theme switcher uses `withThemeByClassName` decorator
- Light/dark mode preview toggle in toolbar

**Wobbly Borders:**
- All custom CSS classes (`.wobbly`, `.wobbly-sm`, etc.) work in Storybook
- Hard offset shadows render correctly
- Paper texture background visible in preview

## Next Steps (Future)

**Testing Coverage:**
- [ ] Add tests for layout components (Header, Footer)
- [ ] Add tests for Sanity components (PortableTextRenderer)
- [ ] Add interaction tests using @storybook/test
- [ ] Set up visual regression testing with Chromatic

**Storybook:**
- [ ] Add stories for layout components
- [ ] Add stories for page templates
- [ ] Document component composition patterns
- [ ] Create design tokens story

**CI/CD:**
- [ ] Run tests in CI pipeline
- [ ] Deploy Storybook to separate subdomain (optional)
- [ ] Add test coverage reporting

## Notes

**Public Route Strategy:**
- Storybook is built to `public/storybook-static`
- Next.js rewrites `/ui-library` → `/storybook-static/`
- No separate hosting needed
- Can be protected with auth if needed

**Testing Philosophy:**
- Test user-facing behavior, not implementation
- Use accessibility queries (getByRole, getByLabelText)
- Keep tests simple and maintainable
- Fast feedback loop with watch mode

**Why Vitest over Jest:**
- Faster startup and execution
- Better ESM support
- Vite-compatible (same bundler as Storybook)
- Modern API, compatible with Jest matchers

## Documentation

See [TESTING.md](../TESTING.md) for complete guide on:
- Running Storybook
- Writing stories
- Running tests
- Writing tests
- CI/CD integration
