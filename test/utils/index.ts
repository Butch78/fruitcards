/**
 * Test utilities and helpers for the fruitcards test suite
 */

/**
 * Common test data and fixtures
 */
export const testData = {
  /**
   * Expected template menu items
   */
  templateMenuItems: [
    { label: 'Starter', url: 'https://starter-template.nuxt.dev/' },
    { label: 'Landing', url: 'https://landing-template.nuxt.dev/' },
    { label: 'Docs', url: 'https://docs-template.nuxt.dev/' },
    { label: 'SaaS', url: 'https://saas-template.nuxt.dev/' },
    { label: 'Dashboard', url: 'https://dashboard-template.nuxt.dev/' },
    { label: 'Chat', url: 'https://chat-template.nuxt.dev/' },
    { label: 'Portfolio', url: 'https://portfolio-template.nuxt.dev/' },
    { label: 'Changelog', url: 'https://changelog-template.nuxt.dev/' },
  ],

  /**
   * Expected feature cards on the home page
   */
  features: [
    {
      title: 'Production-ready from day one',
      icon: 'i-lucide-rocket',
    },
    {
      title: 'Beautiful by default',
      icon: 'i-lucide-palette',
    },
    {
      title: 'Lightning fast',
      icon: 'i-lucide-zap',
    },
    {
      title: '100+ components included',
      icon: 'i-lucide-blocks',
    },
    {
      title: 'Developer experience first',
      icon: 'i-lucide-code-2',
    },
    {
      title: 'Built for scale',
      icon: 'i-lucide-shield-check',
    },
  ],

  /**
   * External URLs used throughout the app
   */
  urls: {
    nuxtUIDocs: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
    github: 'https://github.com/nuxt-ui-templates/starter',
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  },

  /**
   * SEO metadata
   */
  seo: {
    title: 'Nuxt Starter Template',
    description:
      'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.',
  },
}

/**
 * Viewport sizes for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
} as const

/**
 * Helper to get the current year (for copyright tests)
 */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString()
}

/**
 * Helper to check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * Helper to extract domain from URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  }
  catch {
    return ''
  }
}
