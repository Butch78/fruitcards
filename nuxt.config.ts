// https://nuxt.com/docs/api/configuration/nuxt-config

import alchemy from "alchemy/cloudflare/nuxt";

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@nuxt/hints",
    "@nuxt/image",
    "nuxt-charts",
    "@nuxt/test-utils",
    "@nuxt/a11y",
    "nitro-cloudflare-dev",
    "@vite-pwa/nuxt",
  ],

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Fruit Cards",
      short_name: "FruitCards",
      description: "Personal tracking app for finances, workouts, and more",
      theme_color: "#10b981",
      background_color: "#0a0a0a",
      display: "standalone",
      orientation: "portrait",
      start_url: "/apps/gym",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.*/i,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },

  runtimeConfig: {
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    public: {
      betterAuthUrl: process.env.BETTER_AUTH_URL || "https://fruit.cards",
    },
  },

  vite: {
    optimizeDeps: {
      include: ["to-px", "striptags"],
    },
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  nitro: {
    preset: "cloudflare-module",
    cloudflare: alchemy(),
    prerender: {
      routes: ["/"],
      autoSubfolderIndex: false,
    },
  },

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: true,
  },

  colorMode: {
    preference: "dark",
  },

  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2025-01-25",
});
