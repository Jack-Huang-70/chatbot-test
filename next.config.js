/** @type {import('next').NextConfig} */

const path = require('path');
const packageInfo = require('./package.json');

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  transpilePackages: ['react-hls-player'],
  images: {
    domains: ['kfcoosfs.kfcclub.com.tw', 'chatbot-demo.g.aitention.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.resolve = {
      ...config.resolve,
      extensions: ['.js'],
      fallback: {
        fs: false,
      },
      alias: {
        '@/chatbot-packages': path.resolve(__dirname, 'chatbot-packages'),
        '@chatbot-test/components': path.join(__dirname, 'components'),
        '@chatbot-test/constants': path.join(__dirname, 'constants'),
        '@chatbot-test/cssMixin': path.join(__dirname, 'cssMixin'),
        '@chatbot-test/pages': path.join(__dirname, 'pages'),
        '@chatbot-test/public': path.join(__dirname, 'public'),
        '@chatbot-test/core': path.join(__dirname, 'core'),
        '@chatbot-test/utils': path.join(__dirname, 'utils'),
        '@chatbot-test/qa': path.join(__dirname, 'qa'),
        '@chatbot-test/customUses': path.join(__dirname, 'customUses'),
        '@chatbot-test/hooks': path.join(__dirname, 'hooks'),
        '@chatbot-test/customHooks': path.join(__dirname, 'customHooks'),
        '@chatbot-test/locales': path.join(__dirname, 'locales'),
        '@chatbot-test/layouts': path.join(__dirname, 'layouts'),
      },
    };

    return config;
  },
  compiler: {
    emotion: true,
    styledComponents: true,
  },
  output: 'standalone',
  headers: async () => {
    return [
      {
        // allow all origin
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  env: {
    VERSION: packageInfo.version,
    NAME: packageInfo.name,
  },
};

module.exports = nextConfig;

// Injected content via Sentry wizard below
const { withSentryConfig } = require('@sentry/nextjs');
module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    // Suppresses source map uploading logs during build
    silent: true,
    org: 'pantheonlab',
    project: 'chatbot',
    url: 'https://sentry.eks-prod-tools.k.aitention.com',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
