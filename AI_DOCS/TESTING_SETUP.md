# Testing Setup

## Current Status

The deployed root app is Nuxt 4. A Vue-specific automated test setup has not been migrated yet.

What is true today:

- root Nuxt app: no dedicated unit/component test suite yet
- root Nuxt app: validated primarily with `npm run build`
- legacy Next app in `ollis-astro-club-next-js/`: still contains the old Storybook and React/Vitest setup for reference only

## Current Validation Command

For the active website, use:

```bash
npm run build
```

This is the required validation step after meaningful route, layout, config, or Sanity integration changes.

## Legacy Testing Assets

The old testing/tooling setup still exists under:

```text
ollis-astro-club-next-js/
```

That includes:

- Storybook configuration
- React Testing Library tests
- Vitest config for the old React app

These are no longer part of the production deployment flow.

## Recommended Future Nuxt Testing Stack

When the Vue test migration starts, use a Nuxt/Vue-native setup such as:

- Vitest
- Vue Test Utils
- jsdom
- optional Storybook for Vue if a component library is revived

## Suggested Next Testing Milestones

1. Add Vitest to the root Nuxt app.
2. Add Vue component tests for shared shell components.
3. Add tests for `PortableTextRenderer.vue` and Sanity-driven rendering.
4. Add smoke tests for locale-prefixed routes.
5. Add CI execution for the root `npm run build` plus the future Vue test suite.

## Notes

- The previous documentation about `/ui-library`, Next rewrites, and React Testing Library no longer applies to the active root website.
- If a Vue Storybook is added later, document it separately rather than reusing the old Next-specific notes.
