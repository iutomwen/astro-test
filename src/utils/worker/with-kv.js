const ONE_YEAR = 31536000

function cacheHeaders(headers: Headers) {
  headers.set(
    "Cache-Control",
    `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`
  )
  headers.set("CDN-Cache-Control", `public, max-age=${ONE_YEAR}`)
}

export async function cacheImage(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  next: () => Promise<Response>
) {
  const url = new URL(request.url)
  if (!url.pathname.startsWith("/_next/image")) return next()

  const cache = caches.default
  const cacheKey = new Request(url.toString(), request)

  // 1️⃣ Edge cache
  let response = await cache.match(cacheKey)
  if (response) return response

  const kvKey = url.toString()

  // 2️⃣ KV lookup
  const kvImage = await env.IMAGE_CACHE.get(kvKey, "arrayBuffer")

  if (kvImage) {
    response = new Response(kvImage, {
      headers: { "Content-Type": "image/webp" },
    })
    cacheHeaders(response.headers)

    ctx.waitUntil(cache.put(cacheKey, response.clone()))
    return response
  }

  // 3️⃣ Generate via Next
  response = await next()

  if (response.status !== 200) return response

  const buffer = await response.arrayBuffer()

  // clone response
  const newResponse = new Response(buffer, response)
  cacheHeaders(newResponse.headers)

  // 4️⃣ store globally
  ctx.waitUntil(env.IMAGE_CACHE.put(kvKey, buffer))

  // 5️⃣ store in POP cache
  ctx.waitUntil(cache.put(cacheKey, newResponse.clone()))

  return newResponse
}