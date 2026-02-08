import { cacheImage } from "./cache-image"
import { handleRequest } from "./server"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return cacheImage(request, env, ctx, () =>
      handleRequest(request, env, ctx)
    )
  },
}



// updated file 

import { cacheNextImage } from "./cache-next-image"
import { cacheNextAsset } from "./cache-next-assets"
import { cacheHTML } from "./cache-html"

function routeToNext(url: URL) {
  return (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/app") ||
    url.pathname.startsWith("/api")
  )
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    // 1️⃣ images
    const image = await cacheNextImage(request, env, ctx)
    if (image) return image

    // 2️⃣ next assets
    const asset = await cacheNextAsset(request, env, ctx)
    if (asset) return asset

    // 3️⃣ HTML pages (major LCP improvement)
    const html = await cacheHTML(request, env, ctx)
    if (html) return html

    // 4️⃣ routing
    const url = new URL(request.url)

    if (routeToNext(url)) {
      return env.NEXT_APP.fetch(request)
    }

    return env.GATSBY.fetch(request)
  }
}

import Script from "next/script"

<Script
  src="https://app-lon04.marketo.com/js/forms2.min.js"
  strategy="lazyOnload"
/>