// astro.config.mjs
import { defineConfig } from 'astro/config';

async function fetchRedirects() {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DATOCMS_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        allRedirects {
          source
          destination
          permanent
        }
      }`
    })
  });

  const { data } = await response.json();

  // Transform into Astro's redirect format
  // { '/old-path': { destination: '/new-path', status: 301 } }
  return data.allRedirects.reduce((acc, r) => {
    acc[r.source] = {
      destination: r.destination,
      status: r.permanent ? 301 : 302,
    };
    return acc;
  }, {});
}

export default defineConfig({
  redirects: await fetchRedirects(),
});

// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  security: {
    csp: {
      directives: {
        'script-src': ["'self'"],
        'style-src': ["'self'", 'https://fonts.googleapis.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
      }
    }
  }
});
