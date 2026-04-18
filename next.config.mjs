/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "media.tacdn.com" },
      { protocol: "https", hostname: "assets.simpleviewinc.com" },
      { protocol: "https", hostname: "wallpapers.com" },
      { protocol: "https", hostname: "everythingpuntacana.com" },
    ],
  },
};
export default nextConfig;
