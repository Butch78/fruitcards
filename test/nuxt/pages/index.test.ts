import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('Index Page', () => {
  describe('Hero Section', () => {
    it('renders the page hero component', async () => {
      const wrapper = await mountSuspended(IndexPage)

      expect(wrapper.html()).toContain('Nuxt Starter Template')
    })

    it('displays the hero description', async () => {
      const wrapper = await mountSuspended(IndexPage)

      expect(wrapper.text()).toContain('production-ready starter template')
    })

    it('has "Get started" call-to-action link', async () => {
      const wrapper = await mountSuspended(IndexPage)
      const html = wrapper.html()

      expect(html).toContain('Get started')
      expect(html).toContain('https://ui.nuxt.com/docs/getting-started/installation/nuxt')
    })

    it('has "Use this template" GitHub link', async () => {
      const wrapper = await mountSuspended(IndexPage)
      const html = wrapper.html()

      expect(html).toContain('Use this template')
      expect(html).toContain('https://github.com/nuxt-ui-templates/starter')
    })
  })

  describe('Features Section', () => {
    const expectedFeatures = [
      {
        title: 'Production-ready from day one',
        description: 'Pre-configured with TypeScript, ESLint, Tailwind CSS',
      },
      {
        title: 'Beautiful by default',
        description: 'Nuxt UI\'s design system',
      },
      {
        title: 'Lightning fast',
        description: 'SSR/SSG support',
      },
      {
        title: '100+ components included',
        description: 'comprehensive component library',
      },
      {
        title: 'Developer experience first',
        description: 'Auto-imports, hot module replacement',
      },
      {
        title: 'Built for scale',
        description: 'Enterprise-ready architecture',
      },
    ]

    it('renders the features section with title', async () => {
      const wrapper = await mountSuspended(IndexPage)

      expect(wrapper.text()).toContain('Everything you need to build modern Nuxt apps')
    })

    it.each(expectedFeatures)(
      'displays feature: $title',
      async ({ title }) => {
        const wrapper = await mountSuspended(IndexPage)

        expect(wrapper.text()).toContain(title)
      }
    )

    it('displays all 6 features', async () => {
      const wrapper = await mountSuspended(IndexPage)
      const text = wrapper.text()

      let featureCount = 0
      for (const feature of expectedFeatures) {
        if (text.includes(feature.title)) {
          featureCount++
        }
      }

      expect(featureCount).toBe(6)
    })
  })

  describe('CTA Section', () => {
    it('renders the call-to-action section', async () => {
      const wrapper = await mountSuspended(IndexPage)

      expect(wrapper.text()).toContain('Ready to build your next Nuxt app?')
    })

    it('has "Start building" link', async () => {
      const wrapper = await mountSuspended(IndexPage)
      const html = wrapper.html()

      expect(html).toContain('Start building')
    })

    it('has "View on GitHub" link', async () => {
      const wrapper = await mountSuspended(IndexPage)
      const html = wrapper.html()

      expect(html).toContain('View on GitHub')
    })
  })
})
