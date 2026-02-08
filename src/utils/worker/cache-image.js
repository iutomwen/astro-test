import { immutable } from "./cache-headers"

export async function cacheNextImage(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response | null> {

  if (request.method !== "GET") return null

  const url = new URL(request.url)
  if (!url.pathname.startsWith("/_next/image")) return null

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  // EDGE CACHE
  let response = await cache.match(cacheKey)
  if (response) return response

  const kvKey = url.toString()

  // KV CACHE
  const kvData = await env.IMAGE_CACHE.get(kvKey, "arrayBuffer")
  if (kvData) {
    response = new Response(kvData, {
      headers: { "Content-Type": "image/webp" }
    })
    immutable(response.headers)

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  }

  // FETCH FROM NEXT
  response = await env.NEXT_APP.fetch(request)
  if (!response.ok) return response

  const buffer = await response.arrayBuffer()
  const newResponse = new Response(buffer, response)

  immutable(newResponse.headers)

  ctx.waitUntil(env.IMAGE_CACHE.put(kvKey, buffer))
  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}