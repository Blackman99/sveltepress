---
title: PWA
---

## পরিচিতি

এই ফিচারটি [@vite-pwa/sveltekit](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin) থেকে নেয়া।

থিম ডিফল্টে `pwa` পাঠিয়ে দিয়ে pwa ব্যবহার করা যাবে। অপশঙ্গুলো হুবহু [SvelteKit PWA Plugin Options](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin-options) এর মতই, শুধু `darkManifest` এবং `cacheHTML` বাদে।

- `darkManifest`: ডার্ক থিমে ব্যবহারের জন্য manifest path
- `cacheHTML`: কোন prerendered HTML precache হবে (নিচে দেখুন)

এবং svelte.config.js -এ `files.serviceWorker` কনফিগ করতে হবে, `SERVICE_WORKER_PATH` ব্যবহার করুন যা `@sveltepress/theme-default` থেকে এক্সপোর্ট করা হয়।

```ts title="svelte.config.js"
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { SERVICE_WORKER_PATH } from '@sveltepress/theme-default' // [svp! ++]

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter(),
    files: { // [svp! ++]
      serviceWorker: SERVICE_WORKER_PATH, // [svp! ++]
    }, // [svp! ++]
  },
}

export default config
```

:::note[প্যাকেজ আবশ্যক]{icon=noto:package}
যদি আপনি pwa চালু করতে চান।
আপনার Vite project এ dev dependency হিসেবে `workbox-window` যুক্ত করতে হবে
:::

## HTML precache (versions & i18n)

ডিফল্টভাবে Sveltepress শুধু **app shell** (JS / CSS / fonts) এবং **homepage** precache করে। বাকি ডকুমেন্টেশন পেজ ইউজার ভিজিট করলে runtime-এ cache হয় (`NetworkFirst`, সর্বোচ্চ 64টি এন্ট্রি)।

অনেক version এবং locale থাকলে এটি service worker install/update দ্রুত রাখে। সব prerendered HTML precache করলে Workbox প্রতিবার `versions × locales × pages` hash, compare এবং download করে।

### `pwa.cacheHTML`

| Value | Precached HTML |
| --- | --- |
| `'home'` (default) | শুধু homepage |
| `false` | `'home'` এর মতো |
| `true` | সব prerendered HTML / JSON (আগের আচরণ) |
| `string[]` | Homepage + URL prefix |

শুধু বর্তমান version এবং একটি locale precache করতে:

```ts
pwa: {
  cacheHTML: ['/v3/', '/zh/'],
}
```

আগের “সব পেজ cache করো” আচরণ ফিরিয়ে আনতে:

```ts
pwa: {
  cacheHTML: true,
}
```

ভিজিট করা পেজ precache না থাকলেও runtime cache দিয়ে অফলাইনে খোলা যাবে।

## কনফিগের উদাহরণ

এই সাইটের কনফিগ উদাহরণ হিসেবে দেখুন:

@code(/config/pwa.ts)
