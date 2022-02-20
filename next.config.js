module.exports = {
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
