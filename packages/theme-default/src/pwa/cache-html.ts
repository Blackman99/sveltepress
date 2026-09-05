/**
 * Control which prerendered HTML files are added to the Workbox precache.
 *
 * Large versioned / i18n docs sites should NOT precache every HTML page:
 * Workbox hashes and diffs the whole list on every SW install/update.
 *
 * - `'home'` (default): homepage only
 * - `true`: every prerendered HTML/JSON file (previous behavior)
 * - `false`: same as `'home'` (homepage is kept as the offline fallback)
 * - `string[]`: homepage + URL prefixes, e.g. `['/zh/', '/en/v3/']`
 */
export type CacheHTML = boolean | 'home' | string[]

export const PWA_CLIENT_GLOB = 'client/**/*.{js,css,ico,png,svg,webp,otf,woff,woff2,webmanifest}'
export const PWA_HOME_GLOB = 'prerendered/pages/index.html'
export const PWA_ALL_PRERENDERED_GLOB = 'prerendered/**/*.{html,json}'

/**
 * Map a site URL prefix to a Workbox glob under `.svelte-kit/output`.
 * `/zh/` -> `prerendered/pages/zh/**`
 */
export function prefixToPrerenderedGlobs(prefix: string): string[] {
  const clean = prefix.trim().replace(/^\/+/, '').replace(/\/+$/, '')
  if (!clean)
    return [PWA_HOME_GLOB]
  return [
    `prerendered/pages/${clean}.html`,
    `prerendered/pages/${clean}/**`,
  ]
}

/**
 * Build `injectManifest.globPatterns`.
 *
 * A glob starting with `prerendered/` MUST be present, otherwise
 * `@vite-pwa/sveltekit` appends a catch-all for every prerendered HTML/JSON
 * file and every version/locale page is hashed into the precache again.
 */
export function resolvePrecacheGlobPatterns(cacheHTML: CacheHTML = 'home'): string[] {
  if (cacheHTML === true)
    return [PWA_CLIENT_GLOB, PWA_ALL_PRERENDERED_GLOB]

  if (Array.isArray(cacheHTML)) {
    const extra = cacheHTML.flatMap(prefixToPrerenderedGlobs)
    return [...new Set([PWA_CLIENT_GLOB, PWA_HOME_GLOB, ...extra])]
  }

  return [PWA_CLIENT_GLOB, PWA_HOME_GLOB]
}
