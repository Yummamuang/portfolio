import type { DialHandle } from './dial'
import { isAtPageEnd } from './scroll-spy'

export function watchPageEnd(dial: Pick<DialHandle, 'setActive' | 'settle'>) {
  // A chosen program can sit at the page end. Until its scroll finishes or the
  // user takes over, reaching the end must not turn the choice into Contact.
  let choiceScrolling = false
  const atPageEnd = () =>
    isAtPageEnd(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)
  const markContact = () => {
    if (!choiceScrolling && atPageEnd()) dial.setActive('contact')
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
