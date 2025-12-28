export default {
  async fetch(request: Request) {
    const url = new URL(request.url)
    const cookies = request.headers.get('Cookie') || ''

    const isIE = url.pathname.startsWith('/ie/')
    const isCA = url.pathname.startsWith('/ca/')
    const isElearning = url.pathname.startsWith('/elearning/')
    const isBlog = url.pathname === '/blog' || url.pathname.startsWith('/blog/')
    const isNextAsset = url.pathname.startsWith('/_next/')

    const fromBlog = cookies.includes('app_origin=blog')
    const fromPages = cookies.includes('app_origin=pages')

    /* -------------------------
       1. Locale redirects
    -------------------------- */
    if (isIE) {
      return Response.redirect(
        'https://ie.iutomwen.com' + url.pathname.replace('/ie', '') + url.search,
        301,
      )
    }

    if (isCA) {
      return Response.redirect(
        'https://ca.iutomwen.com' + url.pathname.replace('/ca', '') + url.search,
        301,
      )
    }

    /* -------------------------
       2. Gatsby
    -------------------------- */
    if (isElearning) {
      return fetch('https://gatsby.pages.dev' + url.pathname + url.search, request)
    }

    /* -------------------------
       3. OpenNext (blog)
    -------------------------- */
    if (isBlog || (isNextAsset && fromBlog)) {
      const res = await fetch(
        'https://iutomwen-blog.workers.dev' + url.pathname + url.search,
        request,
      )

      // Only tag HTML responses
      if (!isNextAsset) {
        const headers = new Headers(res.headers)
        headers.append(
          'Set-Cookie',
          'app_origin=blog; Path=/; Secure; SameSite=Lax',
        )

        return new Response(res.body, {
          status: res.status,
          headers,
        })
      }

      return res
    }

    /* -------------------------
       4. Next-on-Pages (default)
    -------------------------- */
    if (!isNextAsset || fromPages) {
      const res = await fetch(
        'https://iutomwen-pages.pages.dev' + url.pathname + url.search,
        request,
      )

      if (!isNextAsset) {
        const headers = new Headers(res.headers)
        headers.append(
          'Set-Cookie',
          'app_origin=pages; Path=/; Secure; SameSite=Lax',
        )

        return new Response(res.body, {
          status: res.status,
          headers,
        })
      }

      return res
    }

    /* -------------------------
       5. Fallback
    -------------------------- */
    return fetch('https://iutomwen-pages.pages.dev' + url.pathname + url.search, request)
  },
}