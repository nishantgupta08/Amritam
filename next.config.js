/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude pdf-parse and pdfjs-dist from webpack bundling
      config.externals = config.externals || [];
      config.externals.push('pdf-parse');
      config.externals.push('pdfjs-dist');
    }
    // Ignore canvas and canvas-prebuilt (used by pdfjs-dist but not needed)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      'canvas-prebuilt': false,
    };
    return config;
  },
}

module.exports = nextConfig

