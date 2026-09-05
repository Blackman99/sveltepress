---
'@sveltepress/theme-default': minor
---

feat(pwa): precache homepage only by default so versioned/i18n sites no longer stall SW updates

Add `pwa.cacheHTML` (`'home'` | `true` | `false` | URL prefixes) and runtime `NetworkFirst` caching for visited pages. `@vite-pwa/sveltekit` always receives a `prerendered/` glob so it cannot re-inject every HTML file. Use `cacheHTML: true` to restore the previous full precache.
