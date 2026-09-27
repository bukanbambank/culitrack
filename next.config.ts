import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.230"],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  serverExternalPackages: [],
  // @ts-ignore
  middlewareClientMaxBodySize: '50mb',
};

export default nextConfig;
