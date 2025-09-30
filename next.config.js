const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@tremor/react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "lucide-react",
      "react-icons",
    ],
  },
  // Compress responses
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  images: {
    domains: [
      "images.unsplash.com",
      "placehold.co",
      "via.placeholder.com",
      "example.com",
      "chapelstack-bucket.s3.eu-west-1.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "chapelstack-bucket.s3.eu-west-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
