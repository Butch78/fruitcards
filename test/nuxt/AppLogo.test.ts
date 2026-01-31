import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppLogo from '~/components/AppLogo.vue'

describe('AppLogo', () => {
  it('renders an SVG element', async () => {
    const wrapper = await mountSuspended(AppLogo)

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('has correct viewBox dimensions', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const svg = wrapper.find('svg')

    expect(svg.attributes('viewBox')).toBe('0 0 1020 200')
  })

  it('has correct width and height attributes', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const svg = wrapper.find('svg')

    expect(svg.attributes('width')).toBe('1020')
    expect(svg.attributes('height')).toBe('200')
  })

  it('contains SVG path elements for the logo', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const paths = wrapper.findAll('path')

    // The logo contains multiple path elements for the Nuxt branding
    expect(paths.length).toBeGreaterThan(0)
  })

  it('uses currentColor for some paths', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const paths = wrapper.findAll('path')

    const currentColorPaths = paths.filter(
      path => path.attributes('fill') === 'currentColor'
    )

    expect(currentColorPaths.length).toBeGreaterThan(0)
  })

  it('uses CSS variable for primary color paths', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const paths = wrapper.findAll('path')

    const primaryColorPaths = paths.filter(
      path => path.attributes('fill') === 'var(--ui-primary)'
    )

    expect(primaryColorPaths.length).toBeGreaterThan(0)
  })
})
