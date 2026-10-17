import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDetentRing, freeBox, snapBox } from './detent-ring'

function rect(left: number, top: number, width: number, height: number) {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  }
}

function move(target: Element, clientX: number, clientY: number, pointerType?: string) {
  const event = new MouseEvent('pointermove', { clientX, clientY, bubbles: true })
  if (pointerType) Object.defineProperty(event, 'pointerType', { value: pointerType })
  target.dispatchEvent(event)
}

function pointerEvent(type: string, pointerType: string, relatedTarget: Element | null = null) {
  const event = new MouseEvent(type, { bubbles: true, relatedTarget })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  return event
}

function stubElementAtPointer(element: Element | null) {
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: () => element,
  })
}

describe('freeBox', () => {
  it('centres the free ring on the pointer', () => {
    expect(freeBox(100, 50)).toEqual({ x: 88, y: 38, w: 24, h: 24, r: 12 })
  })
})

describe('snapBox', () => {
  it('wraps a control with a 4px outset', () => {
    expect(snapBox(rect(10, 20, 100, 40), 999)).toEqual({ x: 6, y: 16, w: 108, h: 48, r: 24 })
  })
})

describe('createDetentRing', () => {
  let ring: HTMLElement
  let stop: () => void

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    document.body.innerHTML = `
      <div class="dial-face">
        <a href="#work" data-program="work">Work</a>
        <a href="#loops" data-program="loops">Loops</a>
        <a href="#agents" data-program="agents">Agents</a>
        <a href="#stack" data-program="stack">Stack</a>
        <a href="#about" data-program="about">About</a>
        <a href="#contact" data-program="contact">Contact</a>
      </div>
      <p class="plain">Text</p>
      <button type="button" class="control">Go</button>
      <footer class="status-strip"><a href="#loops" class="strip-next">Next</a></footer>
      <div data-detent-ring></div>`
    const face = document.querySelector<HTMLElement>('.dial-face')
    const found = document.querySelector<HTMLElement>('[data-detent-ring]')
    if (!face || !found) throw new Error('fixture missing')
    ring = found
    face.getBoundingClientRect = () => rect(-20, -20, 240, 240)
    face.querySelectorAll<HTMLElement>('a').forEach((label, index) => {
      label.getBoundingClientRect = () => rect(index * 60, 10, 50, 20)
    })
    stop = createDetentRing({ ring, dialFace: face })
  })

  afterEach(() => {
    stop()
    Reflect.deleteProperty(document, 'elementFromPoint')
    vi.unstubAllGlobals()
  })

  it('follows the pointer freely away from controls', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)

    expect(ring.style.width).toBe('24px')
    expect(ring.style.translate).toBe('288px 288px')
    expect(ring.hasAttribute('data-snapped')).toBe(false)
    expect(ring.hasAttribute('data-visible')).toBe(true)
  })

  it('snaps around a control under the pointer', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)

    expect(ring.style.width).toBe('128px')
    expect(ring.style.height).toBe('56px')
    expect(ring.hasAttribute('data-snapped')).toBe(true)
  })

  it('hops to the program label nearest the pointer angle around the dial', () => {
    const face = document.querySelector('.dial-face')
    if (!face) throw new Error('fixture missing')
    move(face, 0, 60)

    expect(ring.style.translate).toBe('56px 6px')
    expect(ring.style.width).toBe('58px')
  })

  it('stays free in the empty corner of the dial face box', () => {
    const face = document.querySelector('.dial-face')
    if (!face) throw new Error('fixture missing')
    move(face, 210, 210)

    expect(ring.style.width).toBe('24px')
    expect(ring.hasAttribute('data-snapped')).toBe(false)
  })

  it('turns light over the dark status strip', () => {
    const link = document.querySelector<HTMLElement>('.strip-next')
    if (!link) throw new Error('fixture missing')
    link.getBoundingClientRect = () => rect(900, 860, 100, 44)
    move(link, 910, 870)

    expect(ring.hasAttribute('data-on-dark')).toBe(true)
  })

  it('shrinks while the button is pressed', () => {
    document.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    expect(ring.hasAttribute('data-pressed')).toBe(true)

    document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
    expect(ring.hasAttribute('data-pressed')).toBe(false)
  })

  it('ignores touch pointers', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300, 'touch')

    expect(ring.hasAttribute('data-visible')).toBe(false)
  })

  it('follows a snapped control when the page scrolls under a still pointer', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)
    control.getBoundingClientRect = () => rect(400, 40, 120, 48)
    stubElementAtPointer(control)
    window.dispatchEvent(new Event('scroll'))

    expect(ring.style.translate).toBe('396px 36px')
  })

  it('returns to the free ring when scrolling moves the control away', () => {
    const control = document.querySelector<HTMLElement>('.control')
    const plain = document.querySelector('.plain')
    if (!control || !plain) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)
    stubElementAtPointer(plain)
    window.dispatchEvent(new Event('scroll'))

    expect(ring.style.width).toBe('24px')
    expect(ring.hasAttribute('data-snapped')).toBe(false)
  })

  it('re-places the ring when the window is resized', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)
    control.getBoundingClientRect = () => rect(300, 100, 120, 48)
    stubElementAtPointer(control)
    window.dispatchEvent(new Event('resize'))

    expect(ring.style.translate).toBe('296px 96px')
  })

  it('follows a control that shifts after a click under a still pointer', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)
    control.getBoundingClientRect = () => rect(300, 100, 90, 48)
    stubElementAtPointer(control)
    control.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(ring.style.translate).toBe('296px 96px')
    expect(ring.style.width).toBe('98px')
  })

  it('stops following clicks after teardown', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)
    stop()
    control.getBoundingClientRect = () => rect(300, 100, 90, 48)
    stubElementAtPointer(control)
    control.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(ring.style.translate).toBe('396px 96px')
    expect(ring.style.width).toBe('128px')
  })

  it('does not show the ring on scroll before the pointer has moved', () => {
    stubElementAtPointer(document.querySelector('.plain'))
    window.dispatchEvent(new Event('scroll'))

    expect(ring.hasAttribute('data-visible')).toBe(false)
  })

  it('ignores touch presses', () => {
    document.dispatchEvent(pointerEvent('pointerdown', 'touch'))

    expect(ring.hasAttribute('data-pressed')).toBe(false)
  })

  it('releases the press when the pointer is cancelled', () => {
    document.dispatchEvent(pointerEvent('pointerdown', 'mouse'))
    document.dispatchEvent(pointerEvent('pointercancel', 'mouse'))

    expect(ring.hasAttribute('data-pressed')).toBe(false)
  })

  it('hides the ring when a touch pointer moves on a hybrid device', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)
    move(plain, 310, 310, 'touch')

    expect(ring.hasAttribute('data-visible')).toBe(false)
  })

  it('hides the ring on Tab and shows it again when the pointer moves', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(ring.hasAttribute('data-visible')).toBe(false)

    move(plain, 320, 320)
    expect(ring.hasAttribute('data-visible')).toBe(true)
  })

  it('snaps to the line box of a wrapped link that holds the pointer', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.getBoundingClientRect = () => rect(0, 100, 300, 60)
    const first = rect(200, 100, 100, 20)
    const second = rect(0, 140, 80, 20)
    const lines = [first, second]
    control.getClientRects = () => ({
      length: lines.length,
      item: (index: number) => lines[index] ?? null,
      [Symbol.iterator]: () => lines[Symbol.iterator](),
      0: first,
      1: second,
    })
    move(control, 20, 150)

    expect(ring.style.translate).toBe('-4px 136px')
    expect(ring.style.width).toBe('88px')
  })

  it('hides the ring when the pointer leaves the window', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)
    document.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: null }))

    expect(ring.hasAttribute('data-visible')).toBe(false)
  })

  it('keeps the ring when the pointer moves between elements', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)
    document.dispatchEvent(new MouseEvent('pointerout', { bubbles: true, relatedTarget: plain }))

    expect(ring.hasAttribute('data-visible')).toBe(true)
  })

  it('uses the control corner radius when it is not a pill', () => {
    const control = document.querySelector<HTMLElement>('.control')
    if (!control) throw new Error('fixture missing')
    control.style.borderTopLeftRadius = '8px'
    control.getBoundingClientRect = () => rect(400, 100, 120, 48)
    move(control, 410, 110)

    expect(ring.style.borderRadius).toBe('12px')
  })

  it('turns dark again after the pointer leaves the status strip', () => {
    const link = document.querySelector<HTMLElement>('.strip-next')
    const plain = document.querySelector('.plain')
    if (!link || !plain) throw new Error('fixture missing')
    link.getBoundingClientRect = () => rect(900, 860, 100, 44)
    move(link, 910, 870)
    move(plain, 300, 300)

    expect(ring.hasAttribute('data-on-dark')).toBe(false)
  })

  it('stops reacting once the cleanup function has run', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    stop()
    move(plain, 300, 300)
    document.dispatchEvent(pointerEvent('pointerdown', 'mouse'))

    expect(ring.hasAttribute('data-visible')).toBe(false)
    expect(ring.hasAttribute('data-pressed')).toBe(false)
  })
})
