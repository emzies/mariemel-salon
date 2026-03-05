import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mariemel-salon",
  assetPrefix: "/mariemel-salon/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;