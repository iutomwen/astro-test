<script is:inline>
  (function () {
    window.dataLayer = window.dataLayer || [];

    function pushEvent(event, data = {}) {
      window.dataLayer.push({
        event,
        ...data,
        timestamp: Date.now()
      });
    }

    // 🔘 Button clicks
    document.addEventListener("click", function (e) {
      const target = e.target.closest("[data-track]");
      if (!target) return;

      pushEvent("component_click", {
        component: target.dataset.track || "unknown",
        label: target.innerText?.trim() || "",
        id: target.id || null
      });
    });

    // 📝 Form submissions
    document.addEventListener("submit", function (e) {
      const form = e.target;

      pushEvent("form_submit", {
        form_name: form.dataset.name || form.name || "unknown",
        form_id: form.id || null,
        action: form.action || null
      });
    });

    // 🧩 Generic component interaction
    document.addEventListener("change", function (e) {
      const target = e.target.closest("[data-track-change]");
      if (!target) return;

      pushEvent("component_change", {
        component: target.dataset.trackChange,
        value: target.value || null
      });
    });

  })();
</script>


usage

<button data-track="cta_signup">Sign up</button>

<form data-name="contact_form">
  ...
</form>

<select data-track-change="pricing_selector">
  ...
</select>


utm capture 

<script is:inline>
  (function () {
    const params = new URLSearchParams(window.location.search);

    const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

    utms.forEach((key) => {
      const value = params.get(key);
      if (value) {
        document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }
    });
  })();
</script>



astro actions 

// src/actions/contact.ts
import { defineAction } from "astro:actions";

export const submitContact = defineAction({
  accept: "form",
  handler: async ({ request }) => {
    const cookieHeader = request.headers.get("cookie") || "";

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(c => {
        const [k, v] = c.split("=");
        return [k, decodeURIComponent(v)];
      })
    );

    const utmData = {
      utm_source: cookies.utm_source || null,
      utm_medium: cookies.utm_medium || null,
      utm_campaign: cookies.utm_campaign || null,
      utm_term: cookies.utm_term || null,
      utm_content: cookies.utm_content || null,
    };

    const formData = await request.formData();

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      ...utmData
    };

    // 🚀 Send to backend
    await fetch("https://api.yourbackend.com/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return { success: true };
  }
});