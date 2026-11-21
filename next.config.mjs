/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
  // O endereço antigo da Vercel passa a apontar para o domínio próprio
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'isabela-paglioni.vercel.app' }],
        destination: 'https://www.isapaglioni.com.br/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
