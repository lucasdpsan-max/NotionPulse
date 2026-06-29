import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma engine and native DB drivers out of the bundle; they're loaded
  // lazily at runtime only when a database is configured (see prisma.ts).
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
    '@prisma/adapter-pg',
    'pg',
  ],
  webpack(config) {
    // Handle SVG imports — use SVGR for React component imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            // Return SVG as a React component
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }],
            },
            titleProp: true,
            ref: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
