// https://nuxt.com/docs/api/configuration/nuxt-config

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Only import alchemy when the config exists (not in CI)
const alchemyConfigPath = resolve(process.cwd(), '.alchemy/local/wrangler.jsonc')
const hasAlchemyConfig = existsSync(alchemyConfigPath)

// Dynamically import alchemy only when config exists
const getCloudflareConfig = async () => {
  if (hasAlchemyConfig && !process.env.CI) {
    const { default: alchemy } = await import('alchemy/cloudflare/nuxt')
    return alchemy()
  }
  return undefined
}

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/a11y',
    ...(hasAlchemyConfig && !process.env.CI ? ['nitro-cloudflare-dev'] : [])
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  nitro: {
    preset: hasAlchemyConfig && !process.env.CI ? "cloudflare-module" : "node-server",
    cloudflare: hasAlchemyConfig && !process.env.CI ? await getCloudflareConfig() : undefined,
    prerender: {
      routes: ["/"],
      autoSubfolderIndex: false,
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

})