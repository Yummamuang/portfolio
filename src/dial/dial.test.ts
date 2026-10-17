import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDial } from './dial'

const DIAL_MARKUP = `
  <div class="dial-face">
    <div class="dial-knob" data-dial-knob role="slider" tabindex="0" aria-label="Program"
      aria-valuemin="1" aria-valuemax="6" aria-valuenow="1" aria-valuetext="Work"></div>
    <ol class="dial-labels">
      <li><a href="#work" data-program="work" aria-current="true">Work</a></li>
      <li><a href="#loops" data-program="loops">Loops</a></li>
      <li><a href="#agents" data-program="agents">Agents</a></li>
      <li><a href="#stack" data-program="stack">Stack</a></li>
      <li><a href="#about" data-program="about">About</a></li>
      <li><a href="#contact" data-program="contact">Contact</a></li>
    </ol>
  </div>`

function setup() {
  const root = document.createElement('nav')
  root.innerHTML = DIAL_MARKUP
  const face = root.querySelector('.dial-face')
  if (!(face instanceof HTMLElement)) throw new Error('face missing from fixture')
  face.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    right: 200,
    bottom: 200,
    toJSON: () => ({}),
  })
  const status = document.createElement('span')
  const lamp = document.createElement('span')
  const next = document.createElement('a')
  const onSelect = vi.fn()
  const dial = createDial({ root, status, lamp, next, onSelect })
  const knob = root.querySelector('[data-dial-knob]')
  if (!(knob instanceof HTMLElement)) throw new Error('knob missing from fixture')
  return { root, status, lamp, next, onSelect, dial, knob }
}

function press(target: HTMLElement, key: string) {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

function pointer(target: HTMLElement, type: string, clientX: number, clientY: number) {
  target.dispatchEvent(new MouseEvent(type, { clientX, clientY, bubbles: true }))
}

describe('createDial', () => {
  let ctx: ReturnType<typeof setup>

  beforeEach(() => {
    ctx = setup()
  })

  it('selects the next program on ArrowRight', () => {
    press(ctx.knob, 'ArrowRight')

    expect(ctx.onSelect).toHaveBeenCalledWith('loops')
    expect(ctx.knob.getAttribute('aria-valuetext')).toBe('Loops')
    expect(ctx.knob.style.getPropertyValue('--dial-angle')).toBe('-72deg')
  })

  it('keeps work selected and stays quiet on ArrowLeft at the first program', () => {
    press(ctx.knob, 'ArrowLeft')

    expect(ctx.onSelect).not.toHaveBeenCalled()
    expect(ctx.knob.getAttribute('aria-valuenow')).toBe('1')
  })

  it('jumps to the last program on End', () => {
    press(ctx.knob, 'End')

    expect(ctx.onSelect).toHaveBeenCalledWith('contact')
  })

  it('marks only the active label as current when set from outside', () => {
    ctx.dial.setActive('about')

    const current = ctx.root.querySelectorAll('[aria-current="true"]')
    expect(current).toHaveLength(1)
    expect(current[0]?.getAttribute('data-program')).toBe('about')
    expect(ctx.onSelect).not.toHaveBeenCalled()
  })

  it('writes the program position into the status strip', () => {
    ctx.dial.setActive('stack')

    expect(ctx.status.textContent).toBe('Stack · 4 of 6')
  })

  it('blinks the lamp once when the program changes', () => {
    ctx.dial.setActive('loops')

    expect(ctx.lamp.hasAttribute('data-blink')).toBe(true)
    ctx.lamp.dispatchEvent(new Event('animationend'))
    expect(ctx.lamp.hasAttribute('data-blink')).toBe(false)
  })

  it('snaps a drag released on the upper left to the nearest program', () => {
    pointer(ctx.knob, 'pointerdown', 100, 100)
    pointer(ctx.knob, 'pointermove', 0, 60)
    pointer(ctx.knob, 'pointerup', 0, 60)

    expect(ctx.onSelect).toHaveBeenCalledWith('loops')
    expect(ctx.knob.hasAttribute('data-dragging')).toBe(false)
  })

  it('keeps contact when a drag continues past it into the gap at the bottom', () => {
    pointer(ctx.knob, 'pointerdown', 100, 100)
    pointer(ctx.knob, 'pointermove', 190, 150)
    pointer(ctx.knob, 'pointermove', 95, 199)
    pointer(ctx.knob, 'pointerup', 95, 199)

    expect(ctx.onSelect).toHaveBeenCalledWith('contact')
    expect(ctx.onSelect).not.toHaveBeenCalledWith('work')
  })

  it('ignores scroll spy reports for other programs while moving to a chosen one', () => {
    press(ctx.knob, 'End')

    ctx.dial.setActive('loops')

    expect(ctx.knob.getAttribute('aria-valuetext')).toBe('Contact')
  })

  it('accepts scroll spy reports again once the chosen program reports', () => {
    press(ctx.knob, 'End')

    ctx.dial.setActive('contact')
    ctx.dial.setActive('about')

    expect(ctx.knob.getAttribute('aria-valuetext')).toBe('About')
  })

  it('accepts scroll spy reports again after settle', () => {
    press(ctx.knob, 'End')

    ctx.dial.settle()
    ctx.dial.setActive('loops')

    expect(ctx.knob.getAttribute('aria-valuetext')).toBe('Loops')
  })

  it('points the next link at the following program', () => {
    ctx.dial.setActive('stack')

    expect(ctx.next.getAttribute('href')).toBe('#about')
    expect(ctx.next.textContent).toBe('Next: About ↓')
  })

  it('turns the next link into back to top on the last program', () => {
    ctx.dial.setActive('contact')

    expect(ctx.next.getAttribute('href')).toBe('#top')
    expect(ctx.next.textContent).toBe('Back to top ↑')
  })

  it('ignores a drag started with a non-primary button', () => {
    ctx.knob.dispatchEvent(
      new MouseEvent('pointerdown', { clientX: 100, clientY: 100, button: 2, bubbles: true }),
    )
    pointer(ctx.knob, 'pointermove', 0, 60)
    pointer(ctx.knob, 'pointerup', 0, 60)

    expect(ctx.onSelect).not.toHaveBeenCalled()
    expect(ctx.knob.hasAttribute('data-dragging')).toBe(false)
  })

  it('snaps back to the active program on pointercancel', () => {
    pointer(ctx.knob, 'pointerdown', 100, 100)
    pointer(ctx.knob, 'pointermove', 0, 60)
    ctx.knob.dispatchEvent(new Event('pointercancel', { bubbles: true }))

    expect(ctx.onSelect).not.toHaveBeenCalled()
    expect(ctx.knob.hasAttribute('data-dragging')).toBe(false)
    expect(ctx.knob.style.getPropertyValue('--dial-angle')).toBe('-120deg')
  })

  it('accepts scroll spy reports again after the pending timeout', () => {
    vi.useFakeTimers()
    try {
      press(ctx.knob, 'End')
      vi.advanceTimersByTime(1200)

      ctx.dial.setActive('loops')

      expect(ctx.knob.getAttribute('aria-valuetext')).toBe('Loops')
    } finally {
      vi.useRealTimers()
    }
  })
})
