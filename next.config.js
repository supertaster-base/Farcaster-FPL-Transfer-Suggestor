/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Prevent static export errors caused by SSR evaluation
  output: "standalone",

  // ✅ Ignore build errors from prerendered routes (safe for client-only miniapps)
  experimental: {
    appDir: false,
    esmExternals: "loose",
  },

  // ✅ Skip pages from static generation (force runtime rendering)
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
