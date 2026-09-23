import type {NextConfig} from 'next';

// Prevent Next.js error overlay from attempting to launch terminal editors in Linux container
process.env.REACT_EDITOR = 'none';
delete process.env.EDITOR;
delete process.env.VISUAL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    if (dev) {
      // Disable Webpack pack file filesystem cache in dev container to eliminate rename race condition (ENOENT .pack.gz_) and corrupted chunks
      config.cache = false;
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      if (process.env.DISABLE_HMR === 'true') {
        config.watchOptions = {
          ignored: /.*/,
        };
      }
    }
    return config;
  },
};

export default nextConfig;
