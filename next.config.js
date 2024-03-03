/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/undefined',
        destination: '/',
        permanent: false,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
