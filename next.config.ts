import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    const headers = [
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors *",
      },
      {
        key: "X-Frame-Options",
        value: "ALLOWALL",
      },
      {
        key: "Access-Control-Allow-Origin",
        value: "*",
      },
    ];
    return [
      {
        source: "/:path*",
        headers,
      },
      {
        source: "/",
        headers,
      },
    ];
  },
};

export default nextConfig;
