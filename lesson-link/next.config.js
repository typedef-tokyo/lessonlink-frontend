/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 500,
      aggregateTimeout: 300,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**"],
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
        },
      ],
    });

    return config;
  },
  reactStrictMode: false,
  output: 'standalone',
};

module.exports = nextConfig;
