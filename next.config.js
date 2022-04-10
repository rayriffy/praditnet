const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

const withPlugins = require('next-compose-plugins')

const withPWA = require('next-pwa')

const { runtimeCaching } = require('./runtimeCaching')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          disable: process.env.NODE_ENV === 'development',
          dest: 'public',
          register: true,
          skipWaiting: true,
          runtimeCaching,
          publicExcludes: ['!assets/**/*.png'],
        },
      },
    ],
  ],
  {
    experimental: {
      reactRoot: 'concurrent',
      polyfillsOptimization: true,
      scrollRestoration: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    env: {
      buildNumber: dayjs.tz(dayjs(), 'Asia/Bangkok').format('YYYYMMDD.HH'),
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
