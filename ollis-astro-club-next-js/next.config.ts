import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */

  // Allow remote NASA APOD images used on the live info page.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        pathname: '/apod/**',
      },
    ],
  },
  
  // Skip type check during build (runs locally & in CI via npm run lint)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Serve Storybook static build
  async rewrites() {
    return [
      {
        source: '/storybook-static',
        destination: '/storybook-static/index.html',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
