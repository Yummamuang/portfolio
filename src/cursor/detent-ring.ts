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
const CONTROL_SELECTOR = 'a[href], button, [role="slider"]'
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

export function createDetentRing({ ring, dialFace }: DetentRingOptions): () => void {
  let frame = 0
  let next: { box: RingBox; snapped: boolean } | null = null

  function paint() {
    frame = 0
    if (!next) return
    const { box, snapped } = next
    ring.style.transform = `translate(${box.x}px, ${box.y}px)`
    ring.style.width = `${box.w}px`
    ring.style.height = `${box.h}px`
    ring.style.borderRadius = `${box.r}px`
    ring.toggleAttribute('data-snapped', snapped)
    ring.setAttribute('data-visible', '')
  }

  function schedule(box: RingBox, snapped: boolean) {
    next = { box, snapped }
    if (!frame) frame = requestAnimationFrame(paint)
  }

  function dialStop(clientX: number, clientY: number): RingBox | null {
    if (!dialFace) return null
    const face = dialFace.getBoundingClientRect()
    const center = { x: face.left + face.width / 2, y: face.top + face.height / 2 }
    const index = indexForAngle(pointerAngle(center, { x: clientX, y: clientY }))
    const label = dialFace.querySelectorAll('a[data-program]')[index]
    return label ? snapBox(label.getBoundingClientRect(), PILL_RADIUS) : null
  }

  function onMove(event: MouseEvent) {
    const pointerType = 'pointerType' in event ? event.pointerType : 'mouse'
    if (pointerType !== 'mouse') return
    const target = event.target instanceof Element ? event.target : null
    ring.toggleAttribute('data-on-dark', Boolean(target?.closest(DARK_SURFACE_SELECTOR)))

    if (dialFace && target && dialFace.contains(target)) {
      const box = dialStop(event.clientX, event.clientY)
      if (box) {
        schedule(box, true)
        return
      }
    }
    const control = target?.closest(CONTROL_SELECTOR)
    if (control) {
      schedule(snapBox(control.getBoundingClientRect(), cornerRadius(control)), true)
      return
    }
    schedule(freeBox(event.clientX, event.clientY), false)
  }

  function onDown() {
    ring.setAttribute('data-pressed', '')
  }

  function onUp() {
    ring.removeAttribute('data-pressed')
  }

  function onLeave(event: MouseEvent) {
    if (event.relatedTarget === null) ring.removeAttribute('data-visible')
  }

  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('pointerup', onUp)
  document.addEventListener('pointerout', onLeave)

  return () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerdown', onDown)
    document.removeEventListener('pointerup', onUp)
    document.removeEventListener('pointerout', onLeave)
  }
}
