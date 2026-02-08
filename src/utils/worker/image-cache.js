export async function cacheImage(request: Request, env: Env, ctx: ExecutionContext, next: () => Promise<Response>) {
  // Only cache Next image optimizer
  if (!new URL(request.url).pathname.startsWith("/_next/image")) {
    return next()
  }

  const cache = caches.default
  const cacheKey = new Request(request.url, request)

  let response = await cache.match(cacheKey)
  if (response) return response

  response = await next()

  // Only cache successful images
  if (response.status === 200) {
    response = new Response(response.body, response)

    // IMPORTANT: immutable long cache
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, s-maxage=31536000, immutable"
    )

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
  }

  return response
}