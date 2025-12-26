/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.giorbalitour.com'
      }
    ]
  }
};

module.exports = nextConfig;
