const HTML_TTL = 300 // 5 minutes
const STALE = 604800 // 7 days

function isHTML(request: Request, response: Response) {
  const accept = request.headers.get("accept") || ""
  const type = response.headers.get("content-type") || ""

  return accept.includes("text/html") && type.includes("text/html")
}

function shouldBypass(url: URL, request: Request) {
  if (request.method !== "GET") return true

  if (url.pathname.startsWith("/api")) return true
  if (url.pathname.startsWith("/_next")) return true
  if (url.searchParams.has("__nextPreviewData")) return true

  return false
}

export async function cacheHTML(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {

  const url = new URL(request.url)
  if (shouldBypass(url, request)) return null

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  // CHECK EDGE CACHE
  let cached = await cache.match(cacheKey)
  if (cached) return cached

  // FETCH FROM NEXT
  const response = await env.NEXT_APP.fetch(request)

  if (!response.ok || !isHTML(request, response)) {
    return response
  }

  const newResponse = new Response(response.body, response)

  newResponse.headers.set(
    "Cache-Control",
    `public, max-age=${HTML_TTL}, s-maxage=${HTML_TTL}, stale-while-revalidate=${STALE}`
  )

  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}




// updated 


const STALE = 604800 // 7 days

function getTTL(path: string): number | null {

  // never cache
  if (path.startsWith("/api")) return null
  if (path.startsWith("/_next")) return null

  // homepage
  if (path === "/") return 300

  // PPC landing pages
  if (path.startsWith("/ppc/")) return 300

  // services pages
  if (path.startsWith("/services/")) return 3600

  // about
  if (path === "/about") return 86400

  // contact
  if (path === "/contact") return 86400

  // default: do not cache
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

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  // EDGE HIT
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  // FETCH FROM NEXT
  const response = await env.NEXT_APP.fetch(request)

  if (!response.ok || !isHTML(request, response)) {
    return response
  }

  const newResponse = new Response(response.body, response)

  newResponse.headers.set(
    "Cache-Control",
    `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${STALE}`
  )

  // background cache
  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}