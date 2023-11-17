/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com", "avataaars.io"],
  },
};

module.exports = nextConfig;
