/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "tg.i-c-a.su" }],
  },
};

module.exports = nextConfig;
