/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ebuddy/shared"],
  // Completely disable static generation
  output: "export",
  // Exclude problematic pages from static export
  exportPathMap: async () => ({
    "/": { page: "/" },
    "/login": { page: "/login" },
    "/test": { page: "/test" },
    // Don't include Dashboard in static export
  }),
}

module.exports = nextConfig

