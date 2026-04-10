// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Site",
  description: "My site description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Preconnects */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link rel="preconnect" href="https://cdn.cookielaw.org" />
        <link rel="dns-prefetch" href="https://cdn.cookielaw.org" />

        {/* ✅ Consent Mode v2 DEFAULT (must be first) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />

        {/* ✅ Initial lightweight page_view (optional) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer.push({
                event: "page_view",
                page_path: location.pathname,
                page_title: document.title
              });
            `,
          }}
        />

        {/* ✅ UTM Capture */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const params = new URLSearchParams(window.location.search);
                const utms = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"];

                utms.forEach((key) => {
                  const value = params.get(key);
                  if (value) {
                    document.cookie = key + "=" + value + "; path=/; max-age=" + (60*60*24*30);
                  }
                });
              })();
            `,
          }}
        />

        {/* ✅ GTM Loader (controlled) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.loadGTM = function () {
                if (window.__gtmLoaded) return;
                window.__gtmLoaded = true;

                var s = document.createElement("script");
                s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"; // 🔁 replace
                s.async = true;
                document.head.appendChild(s);
              };
            `,
          }}
        />

        {/* ✅ OneTrust → Consent Mode + GTM bridge */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function OptanonWrapper() {
                var consent = window.OnetrustActiveGroups || "";

                var hasAnalytics = consent.includes("C0002");
                var hasMarketing = consent.includes("C0004");

                // ✅ Update Consent Mode
                gtag('consent', 'update', {
                  analytics_storage: hasAnalytics ? 'granted' : 'denied',
                  ad_storage: hasMarketing ? 'granted' : 'denied',
                  ad_user_data: hasMarketing ? 'granted' : 'denied',
                  ad_personalization: hasMarketing ? 'granted' : 'denied'
                });

                // ✅ Load GTM only after consent
                if (hasAnalytics || hasMarketing) {
                  window.loadGTM && window.loadGTM();
                }
              }
            `,
          }}
        />

        {/* ✅ Lazy-load OneTrust */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var loaded = false;

                function loadOneTrust() {
                  if (loaded) return;
                  loaded = true;

                  var s = document.createElement("script");
                  s.src = "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js";
                  s.setAttribute("data-domain-script", "YOUR-ONETRUST-ID"); // 🔁 replace
                  s.async = true;

                  document.head.appendChild(s);
                }

                ["scroll","click","touchstart"].forEach(function (event) {
                  window.addEventListener(event, loadOneTrust, {
                    once: true,
                    passive: true
                  });
                });

                if ("requestIdleCallback" in window) {
                  requestIdleCallback(loadOneTrust, { timeout: 3000 });
                } else {
                  setTimeout(loadOneTrust, 3000);
                }
              })();
            `,
          }}
        />

        {/* ✅ Prevent CLS from banner */}
        <style>{`
          #onetrust-banner-sdk {
            min-height: 60px;
          }
        `}</style>
      </head>

      <body>
        {children}

        {/* ✅ Global tracking helper */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function track(event, data) {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push(Object.assign({
                    event: event,
                    timestamp: Date.now()
                  }, data || {}));
                }

                // Click tracking
                document.addEventListener("click", function (e) {
                  var el = e.target.closest("[data-track]");
                  if (!el) return;

                  track("click", {
                    component: el.dataset.track,
                    text: el.innerText && el.innerText.trim()
                  });
                });

                // Form tracking
                document.addEventListener("submit", function (e) {
                  var form = e.target;

                  track("form_submit", {
                    form_name: form.dataset.name || form.name || "unknown"
                  });
                });

                window.analytics = { track: track };
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}