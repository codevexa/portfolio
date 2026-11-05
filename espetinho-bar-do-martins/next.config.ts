import type { NextConfig } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null
const isLocalSupabase = supabaseUrl ? ["127.0.0.1", "localhost"].includes(supabaseUrl.hostname) : false

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // Só para desenvolvimento com o Supabase local (supabase start).
    dangerouslyAllowLocalIP: isLocalSupabase,
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
}

export default nextConfig
