import type { DialHandle } from './dial'
import { isProgramId } from './dial-model'
import { isAtPageEnd, sectionInMiddleBand } from './scroll-spy'

export function watchPageEnd(
  dial: Pick<DialHandle, 'setActive' | 'settle'>,
  sections: HTMLElement[],
) {
  // A chosen program can sit at the page end. Until its scroll finishes or the
  // user takes over, reaching the end must not turn the choice into Contact.
  let choiceScrolling = false
  const atPageEnd = () =>
    isAtPageEnd(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)
  let wasAtPageEnd = false
  // At the end both About and Contact sit in the band. Scrolling back up the
  // observer only reports Contact leaving, so the section left behind is restored here.
  const markContact = () => {
    const atEnd = atPageEnd()
    const leftTheEnd = wasAtPageEnd && !atEnd
    wasAtPageEnd = atEnd
    if (choiceScrolling) return
    if (atEnd) {
      dial.setActive('contact')
      return
    }
    if (!leftTheEnd) return
    const id = sectionInMiddleBand(sections, window.innerHeight)?.id
    if (id !== undefined && isProgramId(id)) dial.setActive(id)
  }
  // Check before settling so a choice that scrolled to the page end keeps its guard.
  const onScrollEnd = () => {
    markContact()
    choiceScrolling = false
    dial.settle()
  }
  const onUserTakeover = () => {
    choiceScrolling = false
  }
  window.addEventListener('scroll', markContact, { passive: true })
  window.addEventListener('scrollend', onScrollEnd)
  window.addEventListener('wheel', onUserTakeover, { passive: true })
  window.addEventListener('touchstart', onUserTakeover, { passive: true })
  return {
    atPageEnd,
    choiceStarted() {
      choiceScrolling = true
    },
    stop() {
      window.removeEventListener('scroll', markContact)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('wheel', onUserTakeover)
      window.removeEventListener('touchstart', onUserTakeover)
    },
  }
}
