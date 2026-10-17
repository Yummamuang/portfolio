import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { observeSections } from './scroll-spy'

type Entry = { target: Element; isIntersecting: boolean }

class FakeObserver {
  static last: FakeObserver | undefined
  readonly observed: Element[] = []
  disconnected = false

  constructor(readonly callback: (entries: Entry[]) => void) {
    FakeObserver.last = this
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }

  fire(target: Element, isIntersecting: boolean) {
    this.callback([{ target, isIntersecting }])
  }
}

function makeSections() {
  return ['work', 'loops'].map((id) => {
    const section = document.createElement('section')
    section.id = id
    return section
  })
}

describe('observeSections', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports the id of a section entering the middle band', () => {
    const onActive = vi.fn()
    const [, loops] = makeSections()
    if (!loops) throw new Error('fixture missing loops')
    observeSections(makeSections(), onActive)

    FakeObserver.last?.fire(loops, true)

    expect(onActive).toHaveBeenCalledWith('loops')
  })

  it('ignores a section leaving the band', () => {
    const onActive = vi.fn()
    const [work] = makeSections()
    if (!work) throw new Error('fixture missing work')
    observeSections(makeSections(), onActive)

    FakeObserver.last?.fire(work, false)

    expect(onActive).not.toHaveBeenCalled()
  })

  it('observes every section it is given', () => {
    observeSections(makeSections(), vi.fn())

    expect(FakeObserver.last?.observed.map((section) => section.id)).toEqual(['work', 'loops'])
  })

  it('stops observing when the returned function runs', () => {
    const stop = observeSections(makeSections(), vi.fn())

    stop()

    expect(FakeObserver.last?.disconnected).toBe(true)
  })
})
