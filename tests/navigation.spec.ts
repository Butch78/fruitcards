import { expect, test } from '@nuxt/test-utils/playwright'

test.describe('Header Navigation', () => {
  test('displays logo in header', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const header = page.locator('header')
    const logo = header.locator('svg').first()

    await expect(logo).toBeVisible()
  })

  test('logo links to homepage', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const header = page.locator('header')
    const logoLink = header.locator('a[href="/"]')

    await expect(logoLink).toBeVisible()
  })

  test('displays GitHub link in header', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const header = page.locator('header')
    const githubLink = header.locator('a[href*="github.com"]')

    await expect(githubLink).toBeVisible()
    await expect(githubLink).toHaveAttribute('target', '_blank')
  })

  test('has color mode toggle button', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const header = page.locator('header')
    // Color mode button is typically a button element
    const buttons = header.locator('button')

    await expect(buttons.first()).toBeVisible()
  })
})

test.describe('Template Menu', () => {
  test('displays Starter button', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const starterButton = page.getByRole('button', { name: /Starter/i })
    await expect(starterButton).toBeVisible()
  })

  test('opens dropdown menu on click', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const starterButton = page.getByRole('button', { name: /Starter/i })
    await starterButton.click()

    // Wait for dropdown to appear
    await expect(page.getByText('Landing')).toBeVisible({ timeout: 5000 })
  })

  test('dropdown contains all template options', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const starterButton = page.getByRole('button', { name: /Starter/i })
    await starterButton.click()

    const templates = ['Landing', 'Docs', 'SaaS', 'Dashboard', 'Chat', 'Portfolio', 'Changelog']

    for (const template of templates) {
      await expect(page.getByText(template)).toBeVisible({ timeout: 5000 })
    }
  })
})

test.describe('Footer', () => {
  test('displays footer', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('displays copyright text', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const footer = page.locator('footer')
    await expect(footer.getByText(/Built with Nuxt UI/i)).toBeVisible()
  })

  test('displays current year in copyright', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const footer = page.locator('footer')
    const currentYear = new Date().getFullYear().toString()

    await expect(footer.getByText(currentYear)).toBeVisible()
  })

  test('has GitHub link in footer', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const footer = page.locator('footer')
    const githubLink = footer.locator('a[href*="github.com"]')

    await expect(githubLink).toBeVisible()
  })
})
