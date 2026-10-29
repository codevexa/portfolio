import type { NextConfig } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseUrl
      ? [{ protocol: "https", hostname: new URL(supabaseUrl).hostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
}

export default nextConfig
