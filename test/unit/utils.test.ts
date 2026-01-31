import { describe, expect, it } from 'vitest'
import { testData, getCurrentYear, isExternalUrl, getDomain } from '../utils'

describe('Test Utilities', () => {
  describe('testData', () => {
    it('has 8 template menu items', () => {
      expect(testData.templateMenuItems).toHaveLength(8)
    })

    it('has 6 feature cards', () => {
      expect(testData.features).toHaveLength(6)
    })

    it('has valid external URLs', () => {
      expect(testData.urls.nuxtUIDocs).toMatch(/^https:\/\//)
      expect(testData.urls.github).toMatch(/^https:\/\//)
    })

    it('has SEO metadata', () => {
      expect(testData.seo.title).toBe('Nuxt Starter Template')
      expect(testData.seo.description).toContain('Nuxt UI')
    })
  })

  describe('getCurrentYear', () => {
    it('returns current year as string', () => {
      const year = getCurrentYear()
      const expectedYear = new Date().getFullYear().toString()

      expect(year).toBe(expectedYear)
    })
  })

  describe('isExternalUrl', () => {
    it('returns true for https URLs', () => {
      expect(isExternalUrl('https://example.com')).toBe(true)
    })

    it('returns true for http URLs', () => {
      expect(isExternalUrl('http://example.com')).toBe(true)
    })

    it('returns false for relative URLs', () => {
      expect(isExternalUrl('/about')).toBe(false)
      expect(isExternalUrl('./page')).toBe(false)
    })

    it('returns false for anchor links', () => {
      expect(isExternalUrl('#section')).toBe(false)
    })
  })

  describe('getDomain', () => {
    it('extracts domain from full URL', () => {
      expect(getDomain('https://example.com/path')).toBe('example.com')
    })

    it('extracts domain with subdomain', () => {
      expect(getDomain('https://sub.example.com')).toBe('sub.example.com')
    })

    it('returns empty string for invalid URL', () => {
      expect(getDomain('not-a-url')).toBe('')
    })
  })
})
