import { cloudflare as cloudflareVitePlugin } from "@cloudflare/vite-plugin";

   vite: {
    plugins: [
      cloudflareVitePlugin({
        tunnel: { name: "employersdirect" },
      }),
      tailwindcss()],
    
  },
