import { indexForAngle, pointerAngle } from '../dial/dial-model'

export interface RingBox {
  x: number
  y: number
  w: number
  h: number
  r: number
}

interface Box {
  left: number
  top: number
  width: number
  height: number
}

interface DetentRingOptions {
  ring: HTMLElement
  dialFace: HTMLElement | null
}

const FREE_SIZE = 24
const OUTSET = 4
const PILL_RADIUS = 999
const CONTROL_SELECTOR = 'a[href], button'
const DARK_SURFACE_SELECTOR = '.status-strip'

export function freeBox(x: number, y: number): RingBox {
  return {
    x: x - FREE_SIZE / 2,
    y: y - FREE_SIZE / 2,
    w: FREE_SIZE,
    h: FREE_SIZE,
    r: FREE_SIZE / 2,
  }
}

export function snapBox(rect: Box, radius: number): RingBox {
  return {
    x: rect.left - OUTSET,
    y: rect.top - OUTSET,
    w: rect.width + OUTSET * 2,
    h: rect.height + OUTSET * 2,
    r: Math.min(radius, rect.height / 2) + OUTSET,
  }
}

function cornerRadius(element: Element): number {
  const value = Number.parseFloat(getComputedStyle(element).borderTopLeftRadius)
  return Number.isNaN(value) ? 0 : value
}

function boxUnderPointer(control: Element, clientX: number, clientY: number): Box {
  const lines = Array.from(control.getClientRects())
  const hit = lines.find(
    (line) =>
      clientX >= line.left &&
      clientX <= line.right &&
      clientY >= line.top &&
      clientY <= line.bottom,
  )
  return hit ?? control.getBoundingClientRect()
}

function insideDial(face: HTMLElement, clientX: number, clientY: number): boolean {
  const rect = face.getBoundingClientRect()
  const dx = clientX - (rect.left + rect.width / 2)
  const dy = clientY - (rect.top + rect.height / 2)
  return Math.hypot(dx, dy) <= rect.width / 2
}

export function createDetentRing({ ring, dialFace }: DetentRingOptions): () => void {
  let pending = false
  let next: { box: RingBox; snapped: boolean } | null = null
  let lastPoint: { x: number; y: number } | null = null

  function paint() {
    pending = false
    if (!next) return
    const { box, snapped } = next
    ring.style.translate = `${box.x}px ${box.y}px`
    ring.style.width = `${box.w}px`
    ring.style.height = `${box.h}px`
    ring.style.borderRadius = `${box.r}px`
    ring.toggleAttribute('data-snapped', snapped)
    ring.setAttribute('data-visible', '')
  }

  function schedule(box: RingBox, snapped: boolean) {
    next = { box, snapped }
    if (pending) return
    pending = true
    requestAnimationFrame(paint)
  }

  function hide() {
    next = null
    ring.removeAttribute('data-visible')
  }

  function dialStop(clientX: number, clientY: number): RingBox | null {
    if (!dialFace) return null
    const face = dialFace.getBoundingClientRect()
    const center = { x: face.left + face.width / 2, y: face.top + face.height / 2 }
    const index = indexForAngle(pointerAngle(center, { x: clientX, y: clientY }))
    const label = dialFace.querySelectorAll('a[data-program]')[index]
    return label ? snapBox(label.getBoundingClientRect(), PILL_RADIUS) : null
  }

  function place(clientX: number, clientY: number, target: Element | null) {
    ring.toggleAttribute('data-on-dark', Boolean(target?.closest(DARK_SURFACE_SELECTOR)))

    // The knob follows the pointer angle while dragged, so hopping by angle shows where it lands.
    if (dialFace && target && dialFace.contains(target) && insideDial(dialFace, clientX, clientY)) {
      const box = dialStop(clientX, clientY)
      if (box) {
        schedule(box, true)
        return
      }
    }
    const control = target?.closest(CONTROL_SELECTOR)
    if (control) {
      const rect = boxUnderPointer(control, clientX, clientY)
      schedule(snapBox(rect, cornerRadius(control)), true)
      return
    }
    schedule(freeBox(clientX, clientY), false)
  }

  function onMove(event: MouseEvent) {
    const pointerType = 'pointerType' in event ? event.pointerType : 'mouse'
    if (pointerType !== 'mouse') {
      hide()
      return
    }
    lastPoint = { x: event.clientX, y: event.clientY }
    place(event.clientX, event.clientY, event.target instanceof Element ? event.target : null)
  }

  function replace() {
    if (!lastPoint || !ring.hasAttribute('data-visible')) return
    place(lastPoint.x, lastPoint.y, document.elementFromPoint(lastPoint.x, lastPoint.y))
  }

  function onDown(event: MouseEvent) {
    if ('pointerType' in event && event.pointerType !== 'mouse') return
    ring.setAttribute('data-pressed', '')
  }

  function onUp() {
    ring.removeAttribute('data-pressed')
  }

  function onLeave(event: MouseEvent) {
    if (event.relatedTarget === null) hide()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') hide()
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('pointerup', onUp)
  document.addEventListener('pointercancel', onUp)
  document.addEventListener('pointerout', onLeave)
  document.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', replace, { passive: true })
  window.addEventListener('resize', replace)

  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerdown', onDown)
    document.removeEventListener('pointerup', onUp)
    document.removeEventListener('pointercancel', onUp)
    document.removeEventListener('pointerout', onLeave)
    document.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('scroll', replace)
    window.removeEventListener('resize', replace)
  }
}
