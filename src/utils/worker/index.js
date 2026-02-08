import { cacheImage } from "./cache-image"
import { handleRequest } from "./server"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return cacheImage(request, env, ctx, () =>
      handleRequest(request, env, ctx)
    )
  },
}



import Script from "next/script"

<Script
  src="https://app-lon04.marketo.com/js/forms2.min.js"
  strategy="lazyOnload"
/>