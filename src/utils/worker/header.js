export const ONE_YEAR = 31536000
export const ONE_DAY = 86400

export function immutable(headers: Headers) {
  headers.set(
    "Cache-Control",
    `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`
  )
  headers.set("CDN-Cache-Control", `public, max-age=${ONE_YEAR}`)
}

export function short(headers: Headers) {
  headers.set(
    "Cache-Control",
    `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}, stale-while-revalidate=604800`
  )
}