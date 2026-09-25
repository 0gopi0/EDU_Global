import { useLayoutEffect, type RefObject } from 'react'
import { prefersReducedMotion } from './hooks'

/**
 * Site-wide scroll reveal: every section's content blocks fade in and rise a
 * few pixels the first time they scroll into view, so individual components
 * don't each need wiring up.
 *
 * For each top-level `section`, `article` and `footer`, wrappers with a single
 * child are unwrapped to reach the real content blocks. A list or grid of
 * three or more items reveals its items one after another instead of as one
 * block. Heroes (anything holding a `HeroLine`) already run their own load
 * sequence and are left alone, as are decorative and absolutely positioned
 * layers.
 *
 * The styles live in `index.css` under `[data-reveal]`. The attribute is
 * removed once an element has settled, so no transform or opacity lingers to
 * interfere with sticky or fixed descendants, hover effects or stacking.
 */

const ROOTS = 'main section, main article, footer'
const GROUP_MIN = 3
const STAGGER_MS = 90
const STAGGER_MAX = 6
/** Content that arrives this soon after navigating counts as part of the page load. */
const PAGE_LOAD_MS = 1500

function isDecorative(el: Element): boolean {
  if (el.getAttribute('aria-hidden') === 'true') return true
  if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return true
  const { position, display } = getComputedStyle(el)
  return position === 'absolute' || position === 'fixed' || display === 'contents'
}

function elementChildren(el: Element): Element[] {
  return Array.from(el.children).filter((child) => !isDecorative(child))
}

/** Steps through wrappers that hold only one meaningful child. */
function unwrap(el: Element): Element {
  let current = el
  for (let depth = 0; depth < 4; depth += 1) {
    const kids = elementChildren(current)
    if (kids.length !== 1) break
    current = kids[0]!
  }
  return current
}

function isGroup(el: Element): boolean {
  if (elementChildren(el).length < GROUP_MIN) return false
  if (el.tagName === 'UL' || el.tagName === 'OL') return true
  const { display } = getComputedStyle(el)
  return display === 'grid' || display === 'inline-grid'
}

/** The elements to reveal in one root, each with its stagger position. */
function collectTargets(root: Element): Array<[Element, number]> {
  const targets: Array<[Element, number]> = []
  elementChildren(unwrap(root)).forEach((block, index) => {
    const inner = unwrap(block)
    if (isGroup(inner)) {
      elementChildren(inner).forEach((item, itemIndex) => targets.push([item, itemIndex]))
    } else {
      targets.push([block, index])
    }
  })
  return targets
}

function isTopLevel(root: Element): boolean {
  return root.parentElement?.closest('section, article') == null
}

function inViewport(el: Element): boolean {
  const { top, bottom } = el.getBoundingClientRect()
  return bottom > 0 && top < window.innerHeight
}

export function useSiteReveal(containerRef: RefObject<HTMLElement | null>, routeKey: string) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container || prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const seen = new WeakSet<Element>()
    const pending = new Set<HTMLElement>()
    const timers = new Set<number>()
    const loadedAt = performance.now()

    const settle = (el: HTMLElement) => {
      el.removeAttribute('data-reveal')
      el.style.removeProperty('--reveal-delay')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          observer.unobserve(el)
          pending.delete(el)
          el.setAttribute('data-reveal', 'shown')

          const done = (event?: TransitionEvent) => {
            if (event && (event.target !== el || event.propertyName !== 'opacity')) return
            el.removeEventListener('transitionend', done)
            settle(el)
          }
          el.addEventListener('transitionend', done)
          // Fallback for when no transition runs (e.g. the element is hidden).
          const delay = Number.parseInt(el.style.getPropertyValue('--reveal-delay'), 10) || 0
          const timer = window.setTimeout(() => {
            timers.delete(timer)
            done()
          }, 1500 + delay)
          timers.add(timer)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    const scan = () => {
      // Content that turns up long after the page loaded (a tab switch, a
      // query resolving) and is already on screen is shown as-is, so nothing
      // the reader is looking at blinks out and back in.
      const pageLoad = performance.now() - loadedAt < PAGE_LOAD_MS

      for (const root of container.querySelectorAll(ROOTS)) {
        if (!isTopLevel(root) || root.querySelector('[class*="animate-rise"]')) continue

        for (const [el, index] of collectTargets(root)) {
          if (seen.has(el) || !(el instanceof HTMLElement)) continue
          seen.add(el)
          if (!pageLoad && inViewport(el)) continue

          el.style.setProperty('--reveal-delay', `${Math.min(index, STAGGER_MAX) * STAGGER_MS}ms`)
          el.setAttribute('data-reveal', '')
          pending.add(el)
          observer.observe(el)
        }
      }
    }

    scan()

    let frame = 0
    const mutations = new MutationObserver((records) => {
      // Counters and tickers rewrite text every frame; only new elements matter.
      const addedElement = records.some((record) =>
        Array.from(record.addedNodes).some((node) => node.nodeType === Node.ELEMENT_NODE),
      )
      if (addedElement && !frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          scan()
        })
      }
    })
    mutations.observe(container, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
      cancelAnimationFrame(frame)
      for (const timer of timers) window.clearTimeout(timer)
      // Anything still waiting is shown, never left invisible.
      for (const el of pending) settle(el)
      for (const el of container.querySelectorAll<HTMLElement>('[data-reveal]')) settle(el)
    }
  }, [containerRef, routeKey])
}
