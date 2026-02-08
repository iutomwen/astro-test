export async function storeEarlyHints(
  url: URL,
  html: string,
  env: Env
) {
  // find largest next/image (usually hero)
  const imgMatch = html.match(/<img[^>]+src="([^"]+_next\/image[^"]+)"/i)
  const cssMatch = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/i)

  const hints: string[] = []

  if (imgMatch) {
    hints.push(`<${imgMatch[1]}>; rel=preload; as=image; fetchpriority=high`)
  }

  if (cssMatch) {
    hints.push(`<${cssMatch[1]}>; rel=preload; as=style`)
  }

  if (hints.length > 0) {
    await env.EARLY_HINTS.put(url.pathname, JSON.stringify(hints))
  }
}

export async function sendEarlyHints(
  request: Request,
  env: Env
) {
  const url = new URL(request.url)
  const stored = await env.EARLY_HINTS.get(url.pathname)

  if (!stored) return

  const hints: string[] = JSON.parse(stored)

  // Cloudflare Early Hints header
  return new Response(null, {
    status: 103,
    headers: {
      Link: hints.join(", ")
    }
  })
}



// cache-html

import { storeEarlyHints, sendEarlyHints } from "./early-hints"

const STALE = 604800

function getTTL(path: string): number | null {
  if (path === "/") return 300
  if (path.startsWith("/ppc/")) return 300
  if (path.startsWith("/services/")) return 3600
  if (path === "/about") return 86400
  if (path === "/contact") return 86400
  return null
}

function isHTML(request: Request, response: Response) {
  const accept = request.headers.get("accept") || ""
  const type = response.headers.get("content-type") || ""
  return accept.includes("text/html") && type.includes("text/html")
}

export async function cacheHTML(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {

  if (request.method !== "GET") return null

  const url = new URL(request.url)
  const ttl = getTTL(url.pathname)
  if (!ttl) return null

  // 🔥 SEND EARLY HINTS IMMEDIATELY
  ctx.waitUntil(sendEarlyHints(request, env))

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const response = await env.NEXT_APP.fetch(request)

  if (!response.ok || !isHTML(request, response)) return response

  const html = await response.text()

  const newResponse = new Response(html, response)

  newResponse.headers.set(
    "Cache-Control",
    `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${STALE}`
  )

  // store hints in background
  ctx.waitUntil(storeEarlyHints(url, html, env))
  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}
