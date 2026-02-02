
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "connect-src 'self' https:",
  "font-src 'self' https:",
].join("; ")


async function withSecurityHeaders(res: Response) {
  const headers = new Headers(res.headers)

  headers.set("Content-Security-Policy", CSP)
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  })
}

export default {
  async fetch(req, env) {
    // redirects first
    const redirectResponse = await handleRedirects(req)
    if (redirectResponse) return redirectResponse

    // route to app
    const res = await routeToApp(req, env)

    // add CSP + security headers
    return withSecurityHeaders(res)
  }
}

