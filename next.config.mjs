const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  basePath: isProd ? process.env.PROD_PATH : '',
  assetPrefix: isProd ? process.env.PROD_PATH : '',
  output: 'export',
  publicRuntimeConfig: {
    basePath: isProd ? process.env.PROD_PATH : '',
  },
};

export default nextConfig;
