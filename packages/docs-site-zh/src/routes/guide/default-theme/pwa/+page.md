---
title: PWA
---

## 介绍

此特性集成了 [@vite-pwa/sveltekit](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin)

传递 `pwa` 选项给默认主题来使用 PWA，该选项与 [SvelteKit PWA Plugin Options](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html#sveltekit-pwa-plugin-options) 完全一致，并新增了 `darkManifest` 和 `cacheHTML`。

- `darkManifest`：夜间模式下的 manifest 文件
- `cacheHTML`：控制哪些预渲染 HTML 会进入 precache（见下文）

在 svelte.config.js 中使用从 `@sveltepress/theme-default` 导出的  `SERVICE_WORKER_PATH` 配置 `files.serviceWorker`

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

:::note[依赖需要]{icon=noto:package}
需要安装 `workbox-window` 来使得 PWA 功能正确工作

@install-pkg(workbox-window)

:::

## HTML 预缓存（多版本 / 多语言）

默认情况下，Sveltepress **只预缓存应用壳（JS / CSS / 字体）和首页**。其它文档页会在用户访问时按需写入运行时缓存（`NetworkFirst`，最多 64 条）。

这样在版本多、语言多时，Service Worker 的安装和更新仍然很快。如果把所有预渲染 HTML 都放进 precache，每次更新 Workbox 都要哈希、对比、下载 `版本 × 语言 × 页面` 的笛卡尔积，清单会膨胀、对比时间会变得很长。

### `pwa.cacheHTML`

| 取值 | 预缓存的 HTML |
| --- | --- |
| `'home'`（默认） | 仅首页 |
| `false` | 与 `'home'` 相同（首页保留作为离线回退） |
| `true` | 全部预渲染 HTML / JSON（旧行为） |
| `string[]` | 首页 + 匹配的 URL 前缀 |

只预缓存当前版本和中文：

```ts
import { defaultTheme } from '@sveltepress/theme-default'

defaultTheme({
  pwa: {
    cacheHTML: ['/v3/', '/zh/'],
  },
})
```

恢复「缓存全部页面」的旧行为：

```ts
import { defaultTheme } from '@sveltepress/theme-default'

defaultTheme({
  pwa: {
    cacheHTML: true,
  },
})
```

:::tip
配置里必须保留一条以 `prerendered/` 开头的 glob。否则 `@vite-pwa/sveltekit` 会自动补上 `prerendered/**/*.{html,json}`，所有版本和语言的页面又会回到 precache。
:::

即使页面没有被预缓存，用户访问过的页面仍可通过运行时缓存离线打开。

## 配置示例

用此站点使用的配置来举例：

@code(/config/pwa.ts)
