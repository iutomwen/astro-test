import { immutable, short } from "./cache-headers"

function isNextStatic(path: string) {
  return path.startsWith("/_next/static/")
}

function isNextData(path: string) {
  return path.startsWith("/_next/data/")
}

function isRSC(request: Request) {
  return request.headers.get("RSC") === "1"
}

export async function cacheNextAsset(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {

  if (request.method !== "GET") return null

  const url = new URL(request.url)
  const path = url.pathname

  if (!isNextStatic(path) && !isNextData(path) && !isRSC(request)) {
    return null
  }

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  let response = await cache.match(cacheKey)
  if (response) return response

  // call next worker
  response = await env.NEXT_APP.fetch(request)

  if (!response.ok) return response

  const newResponse = new Response(response.body, response)

  if (isNextStatic(path)) immutable(newResponse.headers)
  else short(newResponse.headers)

  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}