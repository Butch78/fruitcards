/**
 * Custom matchers and assertion helpers
 */

import { expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

/**
 * Assert that a component contains a specific number of elements
 */
export function expectElementCount(
  wrapper: VueWrapper,
  selector: string,
  count: number,
): void {
  const elements = wrapper.findAll(selector)
  expect(elements.length).toBe(count)
}

/**
 * Assert that an element has specific classes
 */
export function expectHasClasses(
  wrapper: VueWrapper,
  selector: string,
  classes: string[],
): void {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)

  for (const className of classes) {
    expect(element.classes()).toContain(className)
  }
}

/**
 * Assert that an element has a specific attribute value
 */
export function expectAttribute(
  wrapper: VueWrapper,
  selector: string,
  attribute: string,
  value: string,
): void {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)
  expect(element.attributes(attribute)).toBe(value)
}

/**
 * Assert that text content includes all specified strings
 */
export function expectTextContains(
  wrapper: VueWrapper,
  texts: string[],
): void {
  const content = wrapper.text()

  for (const text of texts) {
    expect(content).toContain(text)
  }
}

/**
 * Assert that HTML includes all specified strings
 */
export function expectHtmlContains(
  wrapper: VueWrapper,
  strings: string[],
): void {
  const html = wrapper.html()

  for (const str of strings) {
    expect(html).toContain(str)
  }
}

/**
 * Assert that a link has correct href and target
 */
export function expectExternalLink(
  wrapper: VueWrapper,
  selector: string,
  href: string,
): void {
  const link = wrapper.find(selector)
  expect(link.exists()).toBe(true)
  expect(link.attributes('href')).toBe(href)
  expect(link.attributes('target')).toBe('_blank')
}
