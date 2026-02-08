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

function routeToNext(url: URL) {
  return (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/app") ||
    url.pathname.startsWith("/api")
  )
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    // 1️⃣ IMAGE CACHE (biggest win)
    const image = await cacheNextImage(request, env, ctx)
    if (image) return image

    // 2️⃣ STATIC + DATA + RSC CACHE
    const asset = await cacheNextAsset(request, env, ctx)
    if (asset) return asset

    // 3️⃣ ROUTING
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