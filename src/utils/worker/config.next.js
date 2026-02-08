/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    modern: true,          // outputs ES6+ syntax
    legacyBrowsers: false, // skip older browser transforms
  },
  swcMinify: true,         // modern minifier
}

module.exports = nextConfig