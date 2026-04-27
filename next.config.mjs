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
      { protocol: "https", hostname: "cdn2.veltra.com" },
      { protocol: "https", hostname: "www.ridebooker.com" },
      { protocol: "https", hostname: "cdn.getyourguide.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "dynamic-media-cdn.tripadvisor.com" },
      { protocol: "https", hostname: "maltaislandtours.com" },
    ],
  },
};
export default nextConfig;
