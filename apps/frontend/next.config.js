/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ebuddy/shared"],
  // Use standalone output
  output: "standalone",
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static exports
  experimental: {
    disableStaticImages: true,
  },
}

module.exports = nextConfig

