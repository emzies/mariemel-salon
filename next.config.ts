import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/mariemel-salon" : "",
  assetPrefix: isProd ? "/mariemel-salon/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;