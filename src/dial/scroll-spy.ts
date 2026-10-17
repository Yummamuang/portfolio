// A section counts as current once it crosses a thin band around the middle of the viewport.
const BAND_TOP = 0.45
const BAND_BOTTOM = 0.5
const MIDDLE_BAND = '-45% 0px -50% 0px'

export function sectionInMiddleBand(sections: HTMLElement[], viewportHeight: number) {
  return sections.find((section) => {
    const { top, bottom } = section.getBoundingClientRect()
    return top < viewportHeight * BAND_BOTTOM && bottom > viewportHeight * BAND_TOP
  })
}

const PAGE_END_TOLERANCE_PX = 2

export function isAtPageEnd(scrollY: number, viewportHeight: number, scrollHeight: number) {
  return scrollY + viewportHeight >= scrollHeight - PAGE_END_TOLERANCE_PX
}

export function observeSections(
  sections: HTMLElement[],
  onActive: (id: string) => void,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onActive(entry.target.id)
      }
    },
    { rootMargin: MIDDLE_BAND },
  )
  for (const section of sections) observer.observe(section)
  return () => observer.disconnect()
}
