import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Home Page', () => {
  test('has correct page title', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    await expect(page).toHaveTitle(/Nuxt/)
  })

  test('displays hero section with main heading', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const heading = page.getByRole('heading', { name: /Nuxt Starter Template/i })
    await expect(heading).toBeVisible()
  })

  test('displays hero description', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    await expect(page.getByText(/production-ready starter template/i)).toBeVisible()
  })

  test('has "Get started" button linking to Nuxt UI docs', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const getStartedLink = page.getByRole('link', { name: /Get started/i })
    await expect(getStartedLink).toBeVisible()
    await expect(getStartedLink).toHaveAttribute(
      'href',
      'https://ui.nuxt.com/docs/getting-started/installation/nuxt'
    )
  })

  test('has "Use this template" button linking to GitHub', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const templateLink = page.getByRole('link', { name: /Use this template/i })
    await expect(templateLink).toBeVisible()
    await expect(templateLink).toHaveAttribute(
      'href',
      'https://github.com/nuxt-ui-templates/starter'
    )
  })
})

test.describe('Features Section', () => {
  test('displays features section title', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    await expect(page.getByText(/Everything you need to build modern Nuxt apps/i)).toBeVisible()
  })

  test('displays all feature cards', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const features = [
      'Production-ready from day one',
      'Beautiful by default',
      'Lightning fast',
      '100+ components included',
      'Developer experience first',
      'Built for scale',
    ]

    for (const feature of features) {
      await expect(page.getByText(feature)).toBeVisible()
    }
  })
})

test.describe('CTA Section', () => {
  test('displays call-to-action section', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    await expect(page.getByText(/Ready to build your next Nuxt app/i)).toBeVisible()
  })

  test('has "Start building" link', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const startBuildingLink = page.getByRole('link', { name: /Start building/i })
    await expect(startBuildingLink).toBeVisible()
  })

  test('has "View on GitHub" link', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const githubLink = page.getByRole('link', { name: /View on GitHub/i })
    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('href', /github\.com/)
  })
})
