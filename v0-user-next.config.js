/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "randomuser.me", "avatars.githubusercontent.com"],
  },
  // Server Actions are available by default now, so we removed the experimental.serverActions option
}

module.exports = nextConfig

