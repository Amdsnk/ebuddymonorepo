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
  // Add this to ensure proper loading of MUI styles
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
}

module.exports = nextConfig
