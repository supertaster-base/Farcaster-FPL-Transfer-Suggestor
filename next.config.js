/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: undefined,   // ✅ REMOVE standalone/export
  experimental: {
    esmExternals: "loose",
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
