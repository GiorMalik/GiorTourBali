const withNextIntl = require('next-intl/plugin')('./i18n.ts');

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

module.exports = withNextIntl(nextConfig);
