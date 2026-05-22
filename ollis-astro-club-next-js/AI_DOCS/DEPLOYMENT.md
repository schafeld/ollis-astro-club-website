# Deployment & Environment Variables

## Overview

This project requires several API keys and secrets for authentication, CMS, and external APIs. This document explains how to configure them locally and on the Ionos VPS production server.

## Local Development

Copy `.env.local` (already provided in the repo root) and fill in the values:

```bash
cp .env.local .env.local  # already exists, just edit it
```

For local development, the Auth0 dummy admin works without real credentials — the app detects unconfigured Auth0 env vars and falls back to a hardcoded dev admin.

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `AUTH0_SECRET` | Yes | Random string (min 32 chars) for session encryption. Generate with: `openssl rand -hex 32` |
| `AUTH0_DOMAIN` | Yes | Your Auth0 tenant domain (e.g., `your-tenant.eu.auth0.com`) |
| `AUTH0_CLIENT_ID` | Yes | Auth0 application Client ID |
| `AUTH0_CLIENT_SECRET` | Yes | Auth0 application Client Secret |
| `APP_BASE_URL` | Yes | Your app's base URL (`http://localhost:3000` locally, `https://www.ollis-astro-club.com` in prod) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Later | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Later | Sanity dataset name (usually `production`) |
| `SANITY_API_TOKEN` | Later | Sanity API token (read access) |
| `NASA_API_KEY` | Later | NASA API key (free at https://api.nasa.gov) |
| `DATABASE_URL` | Later | MySQL connection string for Ionos VPS |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL |

## Pre-Deployment Checklist

Before merging the development branch to `main` and pushing, make sure all environment variables are in place on the server. This only needs to be done **once** (or when new variables are added).

**Required before first deployment:**

- [ ] `AUTH0_SECRET` — generated and set on server
- [ ] `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` — Auth0 app configured
- [ ] `APP_BASE_URL` set to `https://www.ollis-astro-club.com`
- [ ] `NEXT_PUBLIC_SITE_URL` set to `https://www.ollis-astro-club.com`
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` set (if Sanity is active)
- [ ] `NASA_API_KEY` set (if NASA live data pages are active)

**Important:** `NEXT_PUBLIC_*` variables are embedded into the client-side bundle **at build time**. If you change them, you must rebuild (`npm run build`) and restart PM2 — they are not picked up at runtime.

---

## Setting Up Environment Variables on the Ionos VPS

The app runs as `ollis-astro-club` under PM2 (as user `deploy`) at `/var/www/ollis-astro-club`. Next.js reads `.env.local` automatically from the project root at startup.

### 1. SSH into the VPS

```bash
ssh deploy@www.ollis-astro-club.com
```

### 2. Navigate to the project directory

```bash
cd /var/www/ollis-astro-club
```

### 3. Create and secure the environment file (first time only)

```bash
touch .env.local
chmod 600 .env.local
```

### 4. Edit the environment file

```bash
nano .env.local
```

Paste and fill in all values:

```bash
# Auth0 (v4 SDK) — get these from https://manage.auth0.com
# Generate AUTH0_SECRET with: openssl rand -hex 32
AUTH0_SECRET=<generate-with-openssl-rand-hex-32>
AUTH0_DOMAIN=your-tenant.eu.auth0.com
AUTH0_CLIENT_ID=<your-client-id>
AUTH0_CLIENT_SECRET=<your-client-secret>
APP_BASE_URL=https://www.ollis-astro-club.com

# Sanity — get these from https://www.sanity.io/manage
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<your-read-token>

# NASA — register at https://api.nasa.gov
NASA_API_KEY=<your-nasa-api-key>

# MySQL on Ionos VPS (add when database is introduced)
# DATABASE_URL=mysql://user:password@localhost:3306/astro_club

# App
NEXT_PUBLIC_SITE_URL=https://www.ollis-astro-club.com
```

Save and exit: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 5. Verify the file

```bash
ls -la .env.local
# Should show: -rw------- 1 deploy deploy ... .env.local

# Verify content (no secrets printed to screen unintentionally):
grep -c '=' .env.local   # prints number of lines with values
```

### 6. Rebuild and restart after setting env vars

After creating or changing `.env.local` for the first time, rebuild and restart:

```bash
npm run build
pm2 restart ollis-astro-club
pm2 status  # verify it shows "online"
```

> **Subsequent deployments** (after `git pull` + `npm run build`) only need `pm2 restart ollis-astro-club` — the `.env.local` file persists on the server and does not need to be recreated.

### 7. Verify environment variables are loaded

```bash
pm2 show ollis-astro-club      # shows process details
# Or check that the site works:
curl -I https://www.ollis-astro-club.com
```

## Security Best Practices

- **Never commit `.env.local`** — it is already in `.gitignore`
- **Use `chmod 600`** on the env file so only the owner can read it
- **Rotate secrets regularly** — especially `AUTH0_SECRET` and API tokens
- **Use separate Auth0 applications** for development and production
- **Generate `AUTH0_SECRET`** with: `openssl rand -hex 32`
- **Use a dedicated database user** for the MySQL connection with minimal required permissions
- **Back up env vars** securely (e.g., in a password manager), not in the repo

## Obtaining API Keys

### Auth0
1. Go to https://manage.auth0.com
2. Create a new application (Regular Web Application)
3. Note the Domain, Client ID, and Client Secret
4. Set Allowed Callback URLs: `https://www.ollis-astro-club.com/auth/callback`
5. Set Allowed Logout URLs: `https://www.ollis-astro-club.com`
6. Set Allowed Web Origins: `https://www.ollis-astro-club.com`

### NASA API
1. Go to https://api.nasa.gov
2. Register for a free API key
3. The default `DEMO_KEY` works for development (rate-limited)

### Sanity.io
1. Go to https://www.sanity.io/manage
2. Create a new project
3. Get the Project ID from project settings
4. Create an API token with read access under Settings → API → Tokens
