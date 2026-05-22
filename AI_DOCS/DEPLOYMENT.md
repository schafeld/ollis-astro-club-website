# Deployment & Environment Variables

## Overview

The deployed website is now the Nuxt 4 app at the repository root. Production builds create a Nitro server, and PM2 runs that server via `npm run start`.

The GitHub Actions workflow in `.github/workflows/deploy.yml` deploys by SSH to the Ionos VPS, pulls the latest code, runs `npm ci`, builds the Nuxt app, and restarts PM2.

## Production Runtime Model

- Project path on server: `/var/www/ollis-astro-club`
- PM2 process name: `ollis-astro-club`
- Build command: `npm run build`
- Start command: `npm run start`
- Actual server entrypoint: `node .output/server/index.mjs`

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `AUTH0_SECRET` | Later | Reserved for future Auth0 integration in Nuxt |
| `AUTH0_DOMAIN` | Later | Future Auth0 tenant domain |
| `AUTH0_CLIENT_ID` | Later | Future Auth0 app client ID |
| `AUTH0_CLIENT_SECRET` | Later | Future Auth0 app client secret |
| `APP_BASE_URL` | Later | Future auth callback base URL |
| `NUXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes, if Sanity is active | Sanity project ID |
| `NUXT_PUBLIC_SANITY_DATASET` or `NEXT_PUBLIC_SANITY_DATASET` | Yes, if Sanity is active | Sanity dataset name |
| `NUXT_PUBLIC_SANITY_API_VERSION` or `NEXT_PUBLIC_SANITY_API_VERSION` | No | Optional Sanity API version override |
| `SANITY_API_TOKEN` | Optional | Needed only for server-side mutations or tooling |
| `NASA_API_KEY` | Recommended | NASA API key for APOD; `DEMO_KEY` fallback is used in dev if missing |
| `DATABASE_URL` | Later | Reserved for future database-backed features |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL retained for compatibility |

## Important Build-Time Behavior

Sanity public config is embedded into the client bundle at build time. After changing any of these values, rebuild the app and restart PM2:

- `NUXT_PUBLIC_SANITY_PROJECT_ID`
- `NUXT_PUBLIC_SANITY_DATASET`
- `NUXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

`NASA_API_KEY` is read through Nuxt runtime config and also requires a rebuild in the current deployment flow because the app is rebuilt on deploy and started as a compiled Nitro server.

## Local Development

Edit the existing root `.env.local` file.

The root `nuxt.config.ts` explicitly loads `.env.local` and `.env`, so local development and production both use the same root env file layout.

Example:

```dotenv
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=f18pduhr
NEXT_PUBLIC_SANITY_DATASET=production

# NASA
NASA_API_KEY=your-nasa-key

# Compatibility / general app metadata
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## VPS Setup

### 1. SSH into the server

```bash
ssh deploy@www.ollis-astro-club.com
```

### 2. Go to the project directory

```bash
cd /var/www/ollis-astro-club
```

### 3. Create the env file if needed

```bash
touch .env.local
chmod 600 .env.local
```

### 4. Populate the env file

```dotenv
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production

# Optional explicit API version
# NEXT_PUBLIC_SANITY_API_VERSION=2025-03-01

# NASA
NASA_API_KEY=<your-nasa-api-key>

# Optional compatibility metadata
NEXT_PUBLIC_SITE_URL=https://www.ollis-astro-club.com

# Future auth / database values may stay present even if Nuxt does not use them yet
AUTH0_SECRET=<future>
AUTH0_DOMAIN=<future>
AUTH0_CLIENT_ID=<future>
AUTH0_CLIENT_SECRET=<future>
APP_BASE_URL=https://www.ollis-astro-club.com
DATABASE_URL=<future>
```

### 5. Manual rebuild / restart

```bash
npm ci
npm run build
pm2 restart ollis-astro-club
pm2 status
```

## GitHub Actions Deployment

Current workflow behavior:

```yaml
cd /var/www/ollis-astro-club
pm2 stop ollis-astro-club 2>/dev/null || true
git pull origin main
npm ci
npm run build
pm2 delete ollis-astro-club 2>/dev/null || true
pm2 start npm --name "ollis-astro-club" -- start
pm2 save
```

This now deploys the root Nuxt app, not the legacy Next app.

## Verification

After deployment, verify:

```bash
pm2 status
curl -I https://www.ollis-astro-club.com/de
```

Expected result: `HTTP/1.1 200 OK`.

## Notes

- The old Next app in `ollis-astro-club-next-js/` is not part of production deployment anymore.
- Storybook is also no longer part of the production build pipeline.
- If Vue Storybook is added later, deploy it with a separate workflow or separate static publish step.
