import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend only: the whole site is emitted as static files.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
