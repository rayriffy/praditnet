exports.runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-webfonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'google-fonts-stylesheets',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-font-assets',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      },
    },
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxAgeSeconds: 48 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /^https:\/\/cdn-optimizer\.pradit\.net/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'optimized-image-assets',
      expiration: {
        maxAgeSeconds: 6 * 30 * 24 * 60 * 60, // 6 month
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'next-image',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-audio-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:mp4)$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-video-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
  {
    urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'next-data',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
    },
  },
]
