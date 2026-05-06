import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://qpz-plataform.b-cdn.net/**")],
  },
  /* config options here */
};

export default nextConfig;
