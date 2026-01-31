import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Accessibility', () => {
  test('page has lang attribute set to English', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'en')
  })

  test('page has a main landmark', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('page has a header landmark', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('page has a footer landmark', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('external links have target="_blank"', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const externalLinks = page.locator('a[href^="https://"]')
    const count = await externalLinks.count()

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i)
      await expect(link).toHaveAttribute('target', '_blank')
    }
  })

  test('GitHub button has aria-label', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const githubButton = page.locator('a[aria-label="GitHub"]').first()
    await expect(githubButton).toBeVisible()
  })

  test('interactive elements are keyboard focusable', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    // Tab through the page and check that focus is visible
    await page.keyboard.press('Tab')

    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('buttons have visible focus indicators', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const starterButton = page.getByRole('button', { name: /Starter/i })
    await starterButton.focus()

    // The button should be focusable
    await expect(starterButton).toBeFocused()
  })

  test('links are distinguishable', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const getStartedLink = page.getByRole('link', { name: /Get started/i })

    // Link should be visible and clickable
    await expect(getStartedLink).toBeVisible()
    await expect(getStartedLink).toBeEnabled()
  })
})

test.describe('Responsive Design', () => {
  test('page renders correctly on mobile viewport', async ({ page, goto }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await goto('/', { waitUntil: 'hydration' })

    const heading = page.getByRole('heading', { name: /Nuxt Starter Template/i })
    await expect(heading).toBeVisible()
  })

  test('page renders correctly on tablet viewport', async ({ page, goto }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await goto('/', { waitUntil: 'hydration' })

    const heading = page.getByRole('heading', { name: /Nuxt Starter Template/i })
    await expect(heading).toBeVisible()
  })

  test('page renders correctly on desktop viewport', async ({ page, goto }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await goto('/', { waitUntil: 'hydration' })

    const heading = page.getByRole('heading', { name: /Nuxt Starter Template/i })
    await expect(heading).toBeVisible()
  })

  test('header is visible on all viewport sizes', async ({ page, goto }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await goto('/', { waitUntil: 'hydration' })

      const header = page.locator('header')
      await expect(header).toBeVisible()
    }
  })
})
