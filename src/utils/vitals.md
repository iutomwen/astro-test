Since your Astro marketing website already runs on Cloudflare Workers, I’d implement Core Web Vitals (CWV) collection using a small browser script, an Astro API route, and a private Service Binding to your existing Vitals Worker.

The implementation below is designed to minimise the impact on your site’s performance, particularly Interaction to Next Paint (INP).

Architecture

Browser
  │
  ├── web-vitals (LCP, CLS, INP, FCP, TTFB)
  │
  └── POST /api/vitals
          │
          ▼
      Astro API Route
          │
          ├── Validate JSON and payload size
          ├── Check request origin
          ├── Remove untrusted fields
          └── env.VITALS.fetch(...)
                    │
                    ▼
             Private CF Worker
                    │
                    ├── Authenticate internal request
                    ├── Apply ingestion controls
                    └── Store or aggregate CWV

We’ll use navigator.sendBeacon() with a fetch() fallback, and keep the client script independent of GTM so that analytics tags don’t control when your performance metrics are collected.

1. Install dependencies

From your Astro project:

pnpm add web-vitals

You don’t need Axios or any other HTTP client.

2. Configure Cloudflare Service Binding

Add this to your existing Astro wrangler.jsonc:

{
  "services": [
    {
      "binding": "VITALS",
      "service": "vitals-worker"
    }
  ]
}

Merge the services property into your existing configuration rather than replacing the whole file.

The target Worker must be deployed first. Cloudflare supports calling its fetch() handler directly through the binding.

3. Create the Astro API endpoint

src/pages/api/vitals.ts

This endpoint:

* Accepts only POST requests containing JSON.
* Checks the request origin and payload size.
* Validates the CWV metric and rating.
* Rejects suspicious or invalid data.
* Forwards a sanitised payload through env.VITALS.fetch().
* Returns HTTP 204 when the receiving Worker accepts the event.

I’m using the newer cloudflare:workers environment API, which Astro’s current Cloudflare adapter documents.

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
export const prerender = false;
const MAX_BYTES = 4096;
const METRICS = new Set([
  "LCP", "CLS", "INP", "FCP", "TTFB",
]);
const RATINGS = new Set([
  "good", "needs-improvement", "poor",
]);
type VitalsPayload = {
  name: string;
  value: number;
  rating: string;
  id: string;
  path: string;
  timestamp: number;
};
const json = (message: string, status: number) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
function validate(value: unknown): VitalsPayload | null {
  if (!isRecord(value)) return null;
  const { name, rating, id, path, timestamp } = value;
  const metricValue = value.value;
  if (typeof name !== "string" || !METRICS.has(name))
    return null;
  if (typeof rating !== "string" || !RATINGS.has(rating))
    return null;
  if (
    typeof metricValue !== "number" ||
    !Number.isFinite(metricValue) ||
    metricValue < 0 ||
    metricValue > 600_000
  ) return null;
  if (
    typeof id !== "string" ||
    id.length < 1 ||
    id.length > 128
  ) return null;
  if (
    typeof path !== "string" ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.length > 512 ||
    path.includes("?") ||
    path.includes("#") ||
    /[\u0000-\u001F\u007F]/.test(path)
  ) return null;
  if (
    typeof timestamp !== "number" ||
    !Number.isFinite(timestamp) ||
    timestamp > Date.now() + 60_000 ||
    timestamp < Date.now() - 86_400_000
  ) return null;
  return {
    name,
    value: metricValue,
    rating,
    id,
    path,
    timestamp,
  };
}
export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get("Origin");
  const expectedOrigin = new URL(request.url).origin;
  // Browsers sending our JSON beacon include Origin.
  if (origin !== expectedOrigin) {
    return json("Forbidden", 403);
  }
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.toLowerCase().startsWith(
    "application/json"
  )) {
    return json("Unsupported Media Type", 415);
  }
  const contentLength = request.headers.get(
    "Content-Length"
  );
  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) ||
      Number(contentLength) > MAX_BYTES)
  ) {
    return json("Payload too large", 413);
  }
  try {
    // Enforce size even if Content-Length is missing.
    const reader = request.body?.getReader();
    if (!reader) return json("Empty body", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) {
          await reader.cancel();
          return json("Payload too large", 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(
        new TextDecoder("utf-8", { fatal: true })
          .decode(bytes)
      );
    } catch {
      return json("Invalid JSON", 400);
    }
    const metric = validate(parsed);
    if (!metric) {
      return json("Invalid metric", 400);
    }
    const response = await env.VITALS.fetch(
      new Request("https://vitals.internal/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      })
    );
    if (!response.ok) {
      console.error(
        "Vitals service rejected request:",
        response.status
      );
      return json("Service unavailable", 503);
    }
    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Vitals ingestion error", error);
    return json("Service unavailable", 503);
  }
};
export const ALL: APIRoute = () =>
  new Response(null, {
    status: 405,
    headers: {
      Allow: "POST",
      "Cache-Control": "no-store",
    },
  });

The internal hostname is only used to create a valid URL for the Service Binding. It does not need DNS records.

Security note: Origin checks are useful against cross-site browser submissions, but they are not authentication. For a public telemetry endpoint, add Cloudflare rate limiting/WAF protection, and don’t assume the incoming measurements are trustworthy. For the downstream Worker, keep public routes disabled where possible.

4. Create the browser-side CWV collector

src/scripts/web-vitals.ts

This script is designed for minimal main-thread work. It samples sessions, doesn’t run on hidden initial pages, uses the official web-vitals package, and avoids React or GTM dependencies.

import {
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
  type Metric,
} from "web-vitals";
const ENDPOINT = "/api/vitals";
// 1 = 100%, 0.25 = 25%
// Use 1 for initial monitoring, reduce if needed.
const SAMPLE_RATE = 1;
let started = false;
function report(metric: Metric): void {
  const payload = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    path: window.location.pathname,
    timestamp: Date.now(),
  });
  // Use application/json so the Astro endpoint
  // can validate Content-Type consistently.
  const blob = new Blob([payload], {
    type: "application/json",
  });
  if (navigator.sendBeacon) {
    try {
      if (navigator.sendBeacon(ENDPOINT, blob)) {
        return;
      }
    } catch {
      // Fall through to fetch.
    }
  }
  // sendBeacon may return false if its queue is full.
  // This fallback must never block rendering.
  void fetch(ENDPOINT, {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => {
    // Analytics is best-effort.
  });
}
function start(): void {
  if (started) return;
  started = true;
  // Only sample normal page loads.
  if (Math.random() >= SAMPLE_RATE) return;
  // Initial hidden loads can produce misleading
  // metrics; omit them for this collector.
  if (document.visibilityState === "hidden") return;
  onCLS(report);
  onINP(report);
  onLCP(report);
  onFCP(report);
  onTTFB(report);
}
// Register immediately when this module executes.
// Delaying until idle can miss early paint metrics.
start();

Why not delay CWV collection by five seconds?

Unlike your marketing and advertising tags, Web Vitals observers should be registered early. Delaying them risks losing important page-load measurements.

The web-vitals library uses browser performance observers. It is considerably more appropriate for this task than implementing continuous scroll, click, or mutation listeners.

The default callbacks report the metric when it is ready or finalised. For CLS and INP, the library handles lifecycle reporting; you don’t need to add your own beforeunload listener.

Sampling consideration: SAMPLE_RATE = 1 collects from all eligible sessions. For high-traffic marketing sites, you could use 0.25 and record the sampling rate alongside your aggregates. Don’t reduce sampling until you have enough data for meaningful page-level 75th percentiles.

5. Load the collector in Astro

In your main Astro layout:

src/layouts/BaseLayout.astro

---
import "../styles/global.css";
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <script>
      import "../scripts/web-vitals";
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>

Astro processes and bundles the imported script. It does not need a separate defer or async attribute.

For accurate page-load metrics, include this in your base layout rather than loading it after a GTM trigger or a five-second timeout.

If you’re using Astro client-side view transitions, be aware that web-vitals primarily measures document navigations, not every soft navigation. You’ll need separate route-level instrumentation if you want to analyse transitions between pages.

6. Receiving Worker implementation

You already have a Vitals Worker, so you can adapt its existing ingestion handler to this payload.

Here’s a minimal receiver contract that works with the Astro route above.

vitals-worker/src/index.ts

interface Env {
  // Add your D1, Analytics Engine or Queue bindings.
}
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    if (
      request.method !== "POST" ||
      url.pathname !== "/ingest"
    ) {
      return new Response("Not Found", {
        status: 404,
      });
    }
    const metric = await request.json();
    // TODO: Revalidate the payload here if this
    // Worker has other callers.
    //
    // TODO: Write to Analytics Engine, D1 or Queue.
    // Await successful ingestion before responding.
    return new Response(null, {
      status: 204,
    });
  },
};

This is an integration skeleton, not a complete persistence implementation. It deliberately doesn’t pretend to store measurements. Your receiving Worker must validate and persist or enqueue them before returning 204.

For production, I would consider Cloudflare Analytics Engine for high-volume CWV events, or D1 for lower-volume data with a dashboard. If you’re using D1, batch or queue writes as traffic increases.

7. Production checks

Before deploying, verify these items:

Deployment checklist

0 of 9

The VITALS binding exists in the Astro Worker’s Wrangler configuration.

The target Vitals Worker is deployed and its /ingest handler accepts the payload.

The browser sends application/json to /api/vitals.

The API returns 204 only after successful downstream ingestion.

The Vitals Worker is not publicly accessible unless explicitly required.

Cloudflare rate limiting is applied to /api/vitals.

The collector runs once per document and does not duplicate GTM tracking.

CSP permits the same-origin collector and endpoint.

Metric ingestion is tested in Chrome DevTools and Cloudflare logs.

8. Metrics you should store

For your CWV dashboard, I recommend storing the following:

Field	Purpose
name	LCP, INP, CLS, FCP, TTFB
value	Measured performance
rating	Good, needs improvement, poor
path	Page-level performance
id	Measurement identifier
timestamp	Reporting time

For analysing your failing INP, you could later add the web-vitals/attribution build to collect interaction targets and timing breakdowns. Be careful to sanitise those fields because DOM selectors and interaction details can contain sensitive information.

CWV thresholds

INPLCPCLSFCPTTFB

Good

≤ 200ms

Needs improvement

≤ 500ms

Poor

500ms

Use the 75th percentile (p75), not the average, to assess real-user performance. INP, LCP and CLS are the three Core Web Vitals.

One important detail: the collector above records only the pathname and not query parameters, which helps limit personal-data collection. However, paths themselves can contain personal information (such as email addresses or account IDs). Normalise those routes before storing them.

Also, the Origin check in the API assumes your website has one canonical hostname. If you serve both www.example.com and example.com, or use Cloudflare preview domains, account for those explicitly rather than removing the check.

My final recommendation: deploy the browser collector and Astro API first, verify the receiving Worker returns 204 after successful ingestion, and then build your CWV dashboard around p75 measurements by page and device type. That will give you more actionable evidence about your failing INP than Lighthouse scores alone.