/* eslint-disable @typescript-eslint/no-var-requires */
const withOffline = require('next-offline');
require('dotenv').config()

module.exports = withOffline({
  target: 'serverless',
  transformManifest: (manifest) => ['/'].concat(manifest),
  generateInDevMode: false,
  env: {
    SKYWAY_KEY: process.env.SKYWAY_KEY,
  },
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
});
