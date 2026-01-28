/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
  },
  images: {
    domains: ["kryt-assets.s3.us-east-1.amazonaws.com"],
  },
};

export default nextConfig;
