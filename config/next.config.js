/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfiguracja dla Vercel Blob
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
}

module.exports = nextConfig
