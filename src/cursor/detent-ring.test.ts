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
    face.getBoundingClientRect = () => rect(0, 0, 200, 200)
    face.querySelectorAll<HTMLElement>('a').forEach((label, index) => {
      label.getBoundingClientRect = () => rect(index * 60, 10, 50, 20)
    })
    stop = createDetentRing({ ring, dialFace: face })
  })

  afterEach(() => {
    stop()
    vi.unstubAllGlobals()
  })

  it('follows the pointer freely away from controls', () => {
    const plain = document.querySelector('.plain')
    if (!plain) throw new Error('fixture missing')
    move(plain, 300, 300)

    expect(ring.style.width).toBe('24px')
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

    expect(ring.style.transform).toBe('translate(56px, 6px)')
    expect(ring.style.width).toBe('58px')
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
})
