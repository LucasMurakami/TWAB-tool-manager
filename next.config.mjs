const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  basePath: isProd ? '/TWAB-tool-manager' : '',
  assetPrefix: isProd ? '/TWAB-tool-manager/' : '',
  output: 'export',
  publicRuntimeConfig: {
    basePath: isProd ? '/TWAB-tool-manager' : '',
  },
};

export default nextConfig;
