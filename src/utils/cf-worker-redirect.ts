type RedirectRecord = {
  Source: string
  Destination: string
  Status: "permanent" | "temporary"
}

let redirectMap: Map<string, { to: string; status: number }> | null = null
let lastLoaded = 0

const RELOAD_INTERVAL = 5 * 60 * 1000 // 5 minutes

function normalizePath(path: string) {
  if (!path.startsWith("/")) path = "/" + path
  return path !== "/" ? path.replace(/\/+$/, "") : "/"
}

async function loadRedirects(origin: string) {
  if (
    redirectMap &&
    Date.now() - lastLoaded < RELOAD_INTERVAL
  ) {
    return redirectMap
  }

  const res = await fetch(`${origin}/redirects.json`, {
    cf: {
      cacheEverything: true,
      cacheTtl: 300,
    },
  })

  if (!res.ok) {
    console.error("Failed to load redirects.json", res.status)
    return redirectMap ?? new Map()
  }

  const data = (await res.json()) as RedirectRecord[]

  const map = new Map<string, { to: string; status: number }>()

  for (const r of data) {
    if (!r.Source || !r.Destination) continue

    map.set(normalizePath(r.Source), {
      to: normalizePath(r.Destination),
      status: r.Status === "permanent" ? 301 : 302,
    })
  }

  redirectMap = map
  lastLoaded = Date.now()

  return redirectMap
}

export default {
  async fetch(req: Request, env: any) {
    const url = new URL(req.url)
    const path = normalizePath(url.pathname)

    // 1️⃣ Load redirects (cached)
    const redirects = await loadRedirects(url.origin)

    // 2️⃣ Check redirect
    const match = redirects.get(path)

    if (match) {
      const target = new URL(match.to, url.origin)
      target.search = url.search // preserve query string

      return Response.redirect(target.toString(), match.status)
    }

    // 3️⃣ No redirect → route to Gatsby / Next
    return routeToApp(req, env)
  },
}