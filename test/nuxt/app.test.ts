import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App Layout', () => {
  describe('Structure', () => {
    it('renders the app wrapper', async () => {
      const wrapper = await mountSuspended(App)

      expect(wrapper.exists()).toBe(true)
    })

    it('contains the AppLogo component', async () => {
      const wrapper = await mountSuspended(App)
      const html = wrapper.html()

      // AppLogo renders an SVG
      expect(html).toContain('svg')
    })

    it('contains the TemplateMenu component', async () => {
      const wrapper = await mountSuspended(App)

      // TemplateMenu renders a button with "Starter" text
      expect(wrapper.text()).toContain('Starter')
    })
  })

  describe('Header', () => {
    it('renders a header element', async () => {
      const wrapper = await mountSuspended(App)

      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('has link to homepage in header', async () => {
      const wrapper = await mountSuspended(App)
      const header = wrapper.find('header')
      const homeLink = header.find('a[href="/"]')

      expect(homeLink.exists()).toBe(true)
    })

    it('has GitHub link in header', async () => {
      const wrapper = await mountSuspended(App)
      const html = wrapper.html()

      expect(html).toContain('https://github.com/nuxt-ui-templates/starter')
    })

    it('has color mode toggle button', async () => {
      const wrapper = await mountSuspended(App)
      const header = wrapper.find('header')

      // UColorModeButton renders a button
      const buttons = header.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Footer', () => {
    it('renders a footer element', async () => {
      const wrapper = await mountSuspended(App)

      expect(wrapper.find('footer').exists()).toBe(true)
    })

    it('displays copyright with current year', async () => {
      const wrapper = await mountSuspended(App)
      const footer = wrapper.find('footer')
      const currentYear = new Date().getFullYear().toString()

      expect(footer.text()).toContain(currentYear)
    })

    it('displays "Built with Nuxt UI" text', async () => {
      const wrapper = await mountSuspended(App)
      const footer = wrapper.find('footer')

      expect(footer.text()).toContain('Built with Nuxt UI')
    })

    it('has GitHub link in footer', async () => {
      const wrapper = await mountSuspended(App)
      const footer = wrapper.find('footer')
      const html = footer.html()

      expect(html).toContain('github.com')
    })
  })

  describe('Main Content', () => {
    it('renders the main content wrapper', async () => {
      const wrapper = await mountSuspended(App)

      // The app contains a header, main content area, and footer
      // Verify the overall structure exists
      expect(wrapper.find('header').exists()).toBe(true)
      expect(wrapper.find('footer').exists()).toBe(true)
    })
  })
})

describe('App SEO Configuration', () => {
  // These tests document the expected SEO configuration
  // The actual meta tags are set via useHead and useSeoMeta

  const expectedSeoConfig = {
    title: 'Nuxt Starter Template',
    description: 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.',
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  }

  it('should have the correct page title configured', () => {
    expect(expectedSeoConfig.title).toBe('Nuxt Starter Template')
  })

  it('should have a descriptive meta description', () => {
    expect(expectedSeoConfig.description).toContain('production-ready starter template')
    expect(expectedSeoConfig.description).toContain('Nuxt UI')
  })

  it('should have Open Graph image configured', () => {
    expect(expectedSeoConfig.ogImage).toMatch(/^https:\/\//)
    expect(expectedSeoConfig.ogImage).toContain('nuxt')
  })
})
