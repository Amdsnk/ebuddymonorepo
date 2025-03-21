/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ebuddy/shared"],
  // Disable static generation completely
  output: "standalone",
  // Disable static optimization
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig

