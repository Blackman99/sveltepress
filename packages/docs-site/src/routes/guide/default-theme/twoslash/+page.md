---
title: Twoslash
---

This feature integrate [Twoslash](https://github.com/twoslashes/twoslash)

All of the Typescript code blocks would provide inline type hover.

## Enable twoslash

* Install @sveltepress/twoslash package

@install-pkg(@sveltepress/twoslash)

* Config `highlighter.twoslash` to `true`
```ts title="vite.config.(js|ts)"
import { defaultTheme } from '@sveltepress/theme-default'
import { sveltepress } from '@sveltepress/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltepress({
      theme: defaultTheme({
        highlighter: { // [svp! ++]
          twoslash: true // [svp! ++]
        } // [svp! ++]
      })
    })
  ]
})
```

## Basic type annotation

````md live
```ts
const foo = false

const obj = {
  a: 'a',
  b: 1
}
```
````

## Errors

````md live
```ts
// @errors: 2304 2322
const foo: Foo = null

const a: number = '1'
```
````

## Queries

````md live
```ts
const hi = 'Hello'
const msg = `${hi}, world`
//    ^?
//
//
```
````

## Cut codes

### Cut before

use `// ---cut---` or `// ---cut-before---` can cut all codes before this line

````md live
```ts
const level: string = 'Danger'
// ---cut---
console.log(level)
```
````

### Cut after

use `// ---cut-after---` can cut all codes after this line

````md live
```ts
const level: string = 'Danger'
// ---cut-before---
console.log(level)
// ---cut-after---
console.log('This is not shown')
```
````

### Cut start/end

use `// ---cut-start---` and `// ---cut-end---` to cut contents between them

````md live
```ts
const level: string = 'Danger'
// ---cut-start---
console.log(level) // This is not shown.
// ---cut-end---
console.log('This is shown')
```
````

## Twoslash for svelte

```svelte
<script>
  import { onMount } from 'svelte'

  let { message = 'World' } = $props()

  let count = $state(0)

  onMount(() => {
  })
</script>

<button onclick={() => count++}>
  Count is: {count}
</button>
<div class="text-6">
  Hello, {message}
</div>
```
