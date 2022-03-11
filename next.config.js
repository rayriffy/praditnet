const withPlugins = require('next-compose-plugins')

const withPWA = require('next-pwa')
const withPreact = require('next-plugin-preact')

const { runtimeCaching } = require('./runtimeCaching')

module.exports = withPlugins(
  [
    [withPreact],
    [
      withPWA,
      {
        pwa: {
          disable: process.env.NODE_ENV === 'development',
          dest: 'public',
          register: true,
          skipWaiting: true,
          runtimeCaching,
        },
      },
    ],
  ],
  {
    eslint: {
      ignoreDuringBuilds: true,
    },
    env: {
      RECAPCHA_SITE_KEY: process.env.RECAPCHA_SITE_KEY,
    },
    images: {
      loader: 'custom',
    },
    async headers() {
      return [
        {
          source: '/assets/:path*',
          headers: [
            {
              key: 'cache-control',
              value: 'public, max-age=2592000',
            },
          ],
        },
      ]
    },
  }
)
