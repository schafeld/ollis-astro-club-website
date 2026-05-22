# Implementation Roadmap

## Current State

The Nuxt migration is already the active website at the repository root.

Already migrated and working:

- homepage
- news list
- news detail
- info landing page
- info links
- info live with NASA APOD
- impressum
- games landing page and game subroutes
- fun landing page and interactive wheel
- legacy `/zufallszahlen` route
- root deploy flow to Nuxt via PM2

## Remaining Work

### Phase 1 — Finish Nuxt Parity Tail

- [ ] Wire real Auth0 integration in the Nuxt app
- [ ] Replace the dashboard placeholder with actual authenticated flows
- [ ] Review placeholder game/fun subpages and decide which need full implementations vs. intentional stubs
- [ ] Add a shared locale guard/helper to reduce repeated page-level validation

### Phase 2 — Sanity Ownership Cleanup

- [ ] Move Sanity schema source of truth out of the legacy Next subfolder
- [ ] Decide whether schemas should live in the Nuxt root or in a dedicated shared package
- [ ] Add webhook-based invalidation or another faster content refresh strategy if needed

### Phase 3 — Vue Tooling

- [ ] Add Vue unit/component testing to the root app
- [ ] Decide whether to migrate Storybook to Vue or drop it entirely
- [ ] Add CI validation beyond `npm run build`

### Phase 4 — User Features

- [ ] Implement authentication-backed dashboard pages
- [ ] Add bookmarks and highscores storage
- [ ] Decide whether MySQL is needed or whether auth metadata is enough initially

### Phase 5 — Polish

- [ ] Accessibility review
- [ ] SEO review for the Nuxt root app
- [ ] Error page polish
- [ ] Performance review on slower mobile connections

## Legacy Subfolder

The old Next app in `ollis-astro-club-next-js/` is not part of the launch roadmap anymore. It is a reference asset and migration fallback only.
