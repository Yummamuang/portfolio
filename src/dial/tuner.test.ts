import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTuner } from './tuner'

const ITEM_WIDTH = 86
const VIEWPORT_WIDTH = 390
const PADDING = VIEWPORT_WIDTH / 2 - ITEM_WIDTH / 2
const NAMES = ['work', 'loops', 'agents', 'stack', 'about', 'contact']

function setup(reducedMotion = false) {
  const list = document.createElement('ol')
  list.innerHTML = NAMES.map(
    (name) => `<li><a href="#${name}" data-program="${name}">${name}</a></li>`,
  ).join('')
  document.body.append(list)
  const labels = Array.from(list.querySelectorAll<HTMLAnchorElement>('a[data-program]'))
  labels.forEach((label, index) => {
    Object.defineProperty(label, 'offsetLeft', { value: PADDING + index * ITEM_WIDTH })
    Object.defineProperty(label, 'offsetWidth', { value: ITEM_WIDTH })
  })
  Object.defineProperty(list, 'clientWidth', { value: VIEWPORT_WIDTH })
  let scrollLeft = 0
  Object.defineProperty(list, 'scrollLeft', {
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value
    },
  })
  const scrollTo = vi.fn()
  list.scrollTo = scrollTo
  const onCommit = vi.fn()
  const tuner = createTuner({ list, labels, onCommit, reducedMotion: { matches: reducedMotion } })
  scrollTo.mockClear()
  return {
    list,
    labels,
    scrollTo,
    onCommit,
    tuner,
    scrollToIndex(index: number) {
      scrollLeft = index * ITEM_WIDTH
      list.dispatchEvent(new Event('scroll'))
    },
  }
}

function press(target: HTMLElement, key: string) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

describe('createTuner', () => {
  let ctx: ReturnType<typeof setup>

  beforeEach(() => {
    vi.useFakeTimers()
    ctx = setup()
  })

  afterEach(() => {
    ctx.tuner.destroy()
    ctx.list.remove()
    vi.useRealTimers()
  })

  it('centres a label by scrolling the rail to its midpoint', () => {
    ctx.tuner.centre(2)

    expect(ctx.scrollTo).toHaveBeenCalledWith({ left: 2 * ITEM_WIDTH, behavior: 'smooth' })
  })

  it('centres instantly under reduced motion', () => {
    ctx.tuner.destroy()
    const reduced = setup(true)
    reduced.tuner.centre(1)

    expect(reduced.scrollTo).toHaveBeenCalledWith({ left: ITEM_WIDTH, behavior: 'auto' })
    reduced.tuner.destroy()
    reduced.list.remove()
  })

  it('commits the centred program after the finger lifts and the rail settles', () => {
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.scrollToIndex(3)
    ctx.list.dispatchEvent(new Event('pointerup'))
    ctx.list.dispatchEvent(new Event('scrollend'))

    expect(ctx.onCommit).toHaveBeenCalledExactlyOnceWith(3)
  })

  it('commits through the debounce when scrollend never arrives', () => {
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.scrollToIndex(4)
    ctx.list.dispatchEvent(new Event('touchend'))
    vi.advanceTimersByTime(160)

    expect(ctx.onCommit).toHaveBeenCalledExactlyOnceWith(4)
  })

  it('does not commit while the finger is still on the rail', () => {
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.scrollToIndex(3)
    vi.advanceTimersByTime(500)
    ctx.list.dispatchEvent(new Event('scrollend'))

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('does not commit the scroll caused by a programmatic centre', () => {
    ctx.tuner.centre(3)
    ctx.scrollToIndex(3)
    ctx.list.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(500)

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('does not commit a scroll that no touch started', () => {
    ctx.scrollToIndex(2)
    ctx.list.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(500)

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('does not re-centre while the finger is on the rail', () => {
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.tuner.centre(4)

    expect(ctx.scrollTo).not.toHaveBeenCalled()
  })

  it('does not commit when a label takes focus with Tab', () => {
    ctx.labels[2]?.focus()
    vi.advanceTimersByTime(500)

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('commits and stops the hash jump when a label is tapped', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    ctx.labels[5]?.dispatchEvent(event)

    expect(ctx.onCommit).toHaveBeenCalledExactlyOnceWith(5)
    expect(event.defaultPrevented).toBe(true)
  })

  it('makes only the centred label tabbable', () => {
    ctx.tuner.centre(2)

    expect(ctx.labels.map((label) => label.getAttribute('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
      '-1',
      '-1',
      '-1',
    ])
  })

  it('commits the next label on ArrowRight and moves focus to it', () => {
    ctx.tuner.centre(1)
    press(ctx.labels[1] as HTMLElement, 'ArrowRight')

    expect(ctx.onCommit).toHaveBeenCalledExactlyOnceWith(2)
    expect(document.activeElement).toBe(ctx.labels[2])
  })

  it('commits the previous label on ArrowLeft', () => {
    ctx.tuner.centre(3)
    press(ctx.labels[3] as HTMLElement, 'ArrowLeft')

    expect(ctx.onCommit).toHaveBeenCalledExactlyOnceWith(2)
  })

  it('commits the first and last labels on Home and End', () => {
    ctx.tuner.centre(2)
    press(ctx.labels[2] as HTMLElement, 'End')
    press(ctx.labels[5] as HTMLElement, 'Home')

    expect(ctx.onCommit.mock.calls).toEqual([[5], [0]])
  })

  it('stays on the last label when ArrowRight passes the end', () => {
    ctx.tuner.centre(5)
    press(ctx.labels[5] as HTMLElement, 'ArrowRight')

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('restores the original tabindex on destroy', () => {
    ctx.tuner.destroy()

    expect(ctx.labels.map((label) => label.hasAttribute('tabindex'))).toEqual(
      Array.from({ length: 6 }, () => false),
    )
  })

  it('stops reacting to input after destroy', () => {
    ctx.tuner.destroy()
    const tap = new MouseEvent('click', { bubbles: true, cancelable: true })
    ctx.labels[1]?.dispatchEvent(tap)
    press(ctx.labels[0] as HTMLElement, 'End')

    expect(ctx.onCommit).not.toHaveBeenCalled()
    expect(tap.defaultPrevented).toBe(false)
  })

  it('does not commit when the finger lifts without moving the rail', () => {
    ctx.tuner.centre(1)
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.list.dispatchEvent(new Event('touchend'))
    ctx.list.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(500)

    expect(ctx.onCommit).not.toHaveBeenCalled()
  })

  it('re-centres on the current program after a lift without a swipe', () => {
    ctx.tuner.centre(1)
    ctx.list.dispatchEvent(new Event('pointerdown'))
    ctx.tuner.centre(4)
    ctx.scrollTo.mockClear()
    ctx.list.dispatchEvent(new Event('touchend'))

    expect(ctx.scrollTo).toHaveBeenCalledWith({ left: 4 * ITEM_WIDTH, behavior: 'smooth' })
  })
})
