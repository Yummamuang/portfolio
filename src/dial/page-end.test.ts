import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDial, type DialHandle } from './dial'
import { watchPageEnd } from './page-end'

const MARKUP = `
  <div class="dial-face">
    <div class="dial-knob" data-dial-knob></div>
    <ol class="dial-labels">
      <li><a href="#work" data-program="work">Work</a></li>
      <li><a href="#about" data-program="about">About</a></li>
      <li><a href="#contact" data-program="contact">Contact</a></li>
    </ol>
  </div>`

function setPageScroll(scrollY: number) {
  vi.stubGlobal('scrollY', scrollY)
  vi.stubGlobal('innerHeight', 800)
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(1800)
}

function activeProgram(root: HTMLElement) {
  return root.dataset.active
}

describe('watchPageEnd', () => {
  let root: HTMLElement
  let dial: DialHandle
  let stop: () => void
  let sections: HTMLElement[]
  let watcher: ReturnType<typeof watchPageEnd>

  beforeEach(() => {
    root = document.createElement('nav')
    root.innerHTML = MARKUP
    dial = createDial({ root, status: null, lamp: null, next: null, onSelect: vi.fn() })
    sections = [
      { id: 'about', top: 300, bottom: 900 },
      { id: 'contact', top: 700, bottom: 1300 },
    ].map(({ id, top, bottom }) => {
      const section = document.createElement('section')
      section.id = id
      section.getBoundingClientRect = () => new DOMRect(0, top, 100, bottom - top)
      return section
    })
    watcher = watchPageEnd(dial, sections)
    stop = watcher.stop
  })

  afterEach(() => {
    stop()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('marks contact current when the page scrolls to its end', () => {
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('contact')
  })

  it('leaves the current program alone away from the page end', () => {
    setPageScroll(500)
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('work')
  })

  it('keeps a deliberate choice that scrolls to the page end', () => {
    dial.select('about')
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scrollend'))

    expect(activeProgram(root)).toBe('about')
  })

  it('marks contact on a later scroll at the end once the choice has settled', () => {
    dial.select('about')
    setPageScroll(1000)
    window.dispatchEvent(new Event('scrollend'))
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('contact')
  })

  it('reports whether the page is at its end', () => {
    const { atPageEnd, stop: stopWatching } = watchPageEnd(dial, sections)
    setPageScroll(1000)

    expect(atPageEnd()).toBe(true)
    stopWatching()
  })

  it('keeps a choice whose scroll reaches the page end after the scroll spy reported it', () => {
    dial.select('about')
    watcher.choiceStarted()
    dial.setActive('about')
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scrollend'))

    expect(activeProgram(root)).toBe('about')
  })

  it('marks contact again once the user scrolls after the choice settled', () => {
    dial.select('about')
    watcher.choiceStarted()
    setPageScroll(1000)
    window.dispatchEvent(new Event('scrollend'))
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('contact')
  })

  it('marks contact when the user takes over with the wheel mid-scroll', () => {
    dial.select('about')
    watcher.choiceStarted()
    dial.setActive('about')
    window.dispatchEvent(new Event('wheel'))
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('contact')
  })

  it('lights the section in the band after scrolling up from the page end', () => {
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))
    setPageScroll(900)
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('about')
  })

  it('keeps contact while the page stays at its end', () => {
    setPageScroll(1000)
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))

    expect(activeProgram(root)).toBe('contact')
  })
})
