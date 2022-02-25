module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    RECAPCHA_SITE_KEY: process.env.RECAPCHA_SITE_KEY,
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
