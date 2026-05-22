/**
 * Auth0 configuration and helpers.
 *
 * During initial development, a hardcoded admin dummy is used
 * before the full Auth0 tenant is configured. Set AUTH0_DOMAIN
 * and other env vars in .env.local to enable real Auth0.
 */

/** Roles used across the application */
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

/** Hardcoded admin user for development/testing */
export const DEV_ADMIN = {
  sub: 'dev|admin-001',
  name: 'Admin (Dev)',
  email: 'admin@ollis-astro-club.com',
  role: ROLES.ADMIN,
} as const;

/**
 * Check if we're using the development dummy auth
 * (Auth0 env vars are not configured)
 */
export function isDevAuth(): boolean {
  return (
    !process.env.AUTH0_DOMAIN ||
    process.env.AUTH0_DOMAIN.includes('YOUR_AUTH0_DOMAIN')
  );
}
