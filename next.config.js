/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow Elfsight script to load
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.elfsight.com https://elfsightcdn.com https://apps.elfsight.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
