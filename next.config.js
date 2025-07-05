/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "::1",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "::1",
        port: "1337",
      },
    ],
  },
  i18n: {
    locales: ["fr"],
    defaultLocale: "fr",
  },
};

module.exports = nextConfig;
