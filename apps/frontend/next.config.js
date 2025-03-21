/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ebuddy/shared"],
  // Add this to prevent static generation of problematic pages
  experimental: {
    // This ensures pages with Redux are rendered on-demand, not at build time
    workerThreads: false,
    cpus: 1,
  },
}

module.exports = nextConfig

