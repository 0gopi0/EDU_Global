import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

const SITE_NAME = 'EduGlobal Innovation'

/** Sets the document title for a public page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE_NAME}` : `${SITE_NAME} – Build. Educate. Innovate.`
  }, [title])
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * True once the element has scrolled into view, and stays true. Visitors who
 * prefer reduced motion get `true` straight away, so nothing waits on scroll.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = '0px 0px -12% 0px', threshold = 0.2 } = {},
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (prefersReducedMotion()) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return inView
}

/**
 * Reports how much of an element the reader has scrolled past, measured at a
 * reading line `line` of the way down the viewport: 0 while the element's top
 * is below the line, 1 once its bottom has crossed it. Short elements are
 * treated as at least `minTravel` pixels tall so their progress does not
 * snap from 0 to 1. The callback runs at most once per frame and never
 * re-renders by itself, so it can write styles straight to the DOM.
 */
export function useScrollProgress<T extends Element>(
  ref: RefObject<T | null>,
  onProgress: (progress: number) => void,
  { line = 0.72, minTravel = 0 } = {},
) {
  const callback = useRef(onProgress)
  useLayoutEffect(() => {
    callback.current = onProgress
  })

  useEffect(() => {
    if (prefersReducedMotion()) {
      callback.current(1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const node = ref.current
      if (!node) return
      const { top, height } = node.getBoundingClientRect()
      const progress = (window.innerHeight * line - top) / Math.max(height, minTravel, 1)
      callback.current(Math.min(Math.max(progress, 0), 1))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [ref, line, minTravel])
}

/**
 * Arrow-key movement for a tab list (WAI-ARIA tabs pattern). Returns the index
 * to select next, or null when the key is not a navigation key. Both arrow
 * axes are handled because some lists turn from vertical to horizontal at
 * small widths.
 */
export function nextTabIndex(key: string, index: number, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % count
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [offset])

  return scrolled
}
