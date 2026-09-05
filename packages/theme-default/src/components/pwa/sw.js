// @ts-nocheck
/* eslint-disable no-restricted-globals */
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setCatchHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

const entries = self.__WB_MANIFEST

const entriesAfterProcessed = entries.map((entry) => {
  if (typeof entry === 'object')
    entry.url = entry.url.replace(/(\.\/(\.\.\/)*\.sveltepress\/prerendered)|(index\/?$)/g, '')
  return entry
})

// Remove the unnecessary index suffix of route entries
precacheAndRoute(entriesAfterProcessed)

// clean old assets
cleanupOutdatedCaches()

// Docs pages (all versions / locales) are NOT fully precached.
// Cache them when visited, with a hard cap so SW updates stay cheap.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'sveltepress-pages',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  }),
)

registerRoute(
  ({ url }) => url.pathname.includes('/__data.json'),
  new NetworkFirst({
    cacheName: 'sveltepress-data',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      }),
    ],
  }),
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'sveltepress-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
)

setCatchHandler(async ({ request }) => {
  if (request.mode === 'navigate') {
    const fallback = await matchPrecache('/') || await matchPrecache('/index.html')
    if (fallback)
      return fallback
  }
  return Response.error()
})
