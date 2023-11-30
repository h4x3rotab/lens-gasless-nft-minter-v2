/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ["avataaars.io", "static.alchemyapi.io"],
  },
};

module.exports = nextConfig;
