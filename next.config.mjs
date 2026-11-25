/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the whole site is plain HTML/CSS/JS, so it can be hosted free on Cloudflare Pages (or anywhere).
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: false,
};
export default nextConfig;
