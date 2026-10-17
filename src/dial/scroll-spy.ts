// A section counts as current once it crosses a thin band around the middle of the viewport.
const MIDDLE_BAND = '-45% 0px -50% 0px'

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
