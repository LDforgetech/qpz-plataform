import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qpz-plataform-prod.b-cdn.net", // O domínio exato da Pull Zone de produção
        port: "",
        pathname: "/**", // Permite qualquer subpasta ou arquivo dentro da CDN
      },
      {
        protocol: "https",
        hostname: "qpz-plataform.b-cdn.net", // Mantive o sem prod também por segurança, caso use em dev
        port: "",
        pathname: "/**",
      },
    ],
  },
  /* outras opções de configuração aqui */
};

export default nextConfig;
