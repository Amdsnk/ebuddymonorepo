/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ebuddy/shared"],
  // Use standalone output instead of export
  output: "standalone",
  // Disable static optimization for problematic pages
  staticPageGenerationTimeout: 1,
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

