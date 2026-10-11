import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const isCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare has no default image optimizer. Photos are served by Cloudinary transforms instead.
  images: isCloudflare ? { unoptimized: true } : {},
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
initOpenNextCloudflareForDev();
