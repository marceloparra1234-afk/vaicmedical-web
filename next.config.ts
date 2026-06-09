import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kxapuluyepktcckvwsbk.supabase.co",
        pathname: "/storage/v1/object/public/site-media/**",
      },
    ],
  },
};

export default nextConfig;
