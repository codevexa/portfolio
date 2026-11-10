/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // A loja não trabalha mais com pronta entrega. O endereço antigo pode
  // estar em conversa de WhatsApp ou no Google, então leva para o catálogo.
  async redirects() {
    return [
      { source: "/pronta-entrega", destination: "/catalogo", permanent: true },
      { source: "/categoria/pronta-entrega", destination: "/catalogo", permanent: true },
    ];
  },
};

export default nextConfig;
