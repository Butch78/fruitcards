// https://nuxt.com/docs/api/configuration/nuxt-config

import alchemy from "alchemy/cloudflare/nuxt";

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/image',
    "nuxt-charts",
    '@nuxt/test-utils',
    '@nuxt/a11y',
    'nitro-cloudflare-dev'
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  nitro: {
    preset: "cloudflare-module",
    cloudflare: alchemy(),
    prerender: {
      routes: ["/"],
      autoSubfolderIndex: false,
    },
  },

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: true,
  },

  colorMode: {
    preference: 'dark',
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-25',

})