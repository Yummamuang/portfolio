import {
  PROGRAMS,
  angleForIndex,
  indexForAngle,
  indexForProgram,
  isProgramId,
  pointerAngle,
  stepIndex,
  type ProgramId,
} from './dial-model'

export interface DialOptions {
  root: HTMLElement
  status: HTMLElement | null
  lamp: HTMLElement | null
  next: HTMLAnchorElement | null
  onSelect: (id: ProgramId) => void
  onChange?: (index: number) => void
}

export interface DialHandle {
  setActive(id: ProgramId): void
  select(id: ProgramId): void
  settle(): void
}

const KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
}

const ARC_LIMIT = 120
const PENDING_TIMEOUT_MS = 1200

const SVG_NS = 'http://www.w3.org/2000/svg'
const ARROW_PATHS = {
  down: 'M8 2.5v11M3.5 9 8 13.5 12.5 9',
  up: 'M8 13.5v-11M3.5 7 8 2.5 12.5 7',
} as const

function arrowIcon(direction: keyof typeof ARROW_PATHS): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.5')
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', ARROW_PATHS[direction])
  svg.append(path)
  return svg
}

export function createDial({
  root,
  status,
  lamp,
  next,
  onSelect,
  onChange,
}: DialOptions): DialHandle {
  const knob = root.querySelector('[data-dial-knob]')
  if (!(knob instanceof HTMLElement)) throw new Error('Dial markup is missing [data-dial-knob]')
  const dialKnob = knob
  const labels = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-program]'))
  const face = root.querySelector<HTMLElement>('.dial-face') ?? root
  let activeIndex = 0
  let pendingIndex: number | null = null
  let pendingTimer: ReturnType<typeof setTimeout> | undefined

  function render(index: number) {
    const program = PROGRAMS[index]
    if (!program) return
    dialKnob.style.setProperty('--dial-angle', `${angleForIndex(index)}deg`)
    dialKnob.setAttribute('aria-valuenow', String(index + 1))
    dialKnob.setAttribute('aria-valuetext', program.title)
    root.dataset.active = program.id
    for (const label of labels) {
      if (label.dataset.program === program.id) label.setAttribute('aria-current', 'true')
      else label.removeAttribute('aria-current')
    }
    if (status) status.textContent = `${program.title} · ${index + 1} of ${PROGRAMS.length}`
    if (next) renderNext(index)
    onChange?.(index)
  }

  function renderNext(index: number) {
    if (!next) return
    const following = PROGRAMS[index + 1]
    next.setAttribute('href', following ? `#${following.id}` : '#top')
    next.replaceChildren(
      following ? `Next: ${following.title}` : 'Back to top',
      arrowIcon(following ? 'down' : 'up'),
    )
  }

  function blinkLamp() {
    if (!lamp) return
    lamp.removeAttribute('data-blink')
    void lamp.offsetWidth
    lamp.setAttribute('data-blink', '')
  }

  function activate(index: number) {
    if (index === activeIndex) return false
    activeIndex = index
    render(index)
    blinkLamp()
    return true
  }

  function choose(index: number, scrollEvenIfCurrent = false) {
    const changed = activate(index)
    const program = PROGRAMS[index]
    if ((changed || scrollEvenIfCurrent) && program) {
      pendingIndex = index
      clearTimeout(pendingTimer)
      pendingTimer = setTimeout(settle, PENDING_TIMEOUT_MS)
      onSelect(program.id)
    }
  }

  // While a chosen program is scrolling into view, the scroll spy reports every
  // section it passes. Those reports must not move the knob off the choice.
  function settle() {
    pendingIndex = null
    clearTimeout(pendingTimer)
  }

  if (lamp) {
    lamp.addEventListener('animationend', () => lamp.removeAttribute('data-blink'))
  }

  for (const label of labels) {
    label.addEventListener('click', (event) => {
      const id = label.dataset.program
      if (id === undefined || !isProgramId(id)) return
      event.preventDefault()
      choose(indexForProgram(id), true)
    })
  }

  dialKnob.addEventListener('keydown', (event) => {
    const step = KEY_STEPS[event.key]
    if (step !== undefined) {
      event.preventDefault()
      choose(stepIndex(activeIndex, step))
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      choose(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      choose(PROGRAMS.length - 1)
    }
  })

  function angleFromEvent(event: MouseEvent) {
    const box = face.getBoundingClientRect()
    const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
    return pointerAngle(center, { x: event.clientX, y: event.clientY })
  }

  let dragging = false
  let dragAngle = angleForIndex(activeIndex)

  // The arc has a gap at the bottom where the pointer angle jumps from +180 to -180.
  // Inside the gap the knob holds the last angle it had on the arc, so a drag past
  // Contact never flips over to Work.
  function trackDrag(event: MouseEvent) {
    const angle = angleFromEvent(event)
    if (Math.abs(angle) <= ARC_LIMIT) dragAngle = angle
    dialKnob.style.setProperty('--dial-angle', `${dragAngle}deg`)
  }

  dialKnob.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    dragging = true
    dragAngle = angleForIndex(activeIndex)
    dialKnob.setAttribute('data-dragging', '')
    if (typeof PointerEvent !== 'undefined' && event instanceof PointerEvent) {
      dialKnob.setPointerCapture(event.pointerId)
    }
  })

  dialKnob.addEventListener('pointermove', (event) => {
    if (!dragging) return
    trackDrag(event)
  })

  dialKnob.addEventListener('pointercancel', () => {
    if (!dragging) return
    dragging = false
    dialKnob.removeAttribute('data-dragging')
    render(activeIndex)
  })

  dialKnob.addEventListener('pointerup', (event) => {
    if (!dragging) return
    dragging = false
    trackDrag(event)
    dialKnob.removeAttribute('data-dragging')
    const index = indexForAngle(dragAngle)
    render(index)
    choose(index)
  })

  render(activeIndex)

  return {
    setActive(id) {
      const index = indexForProgram(id)
      if (pendingIndex !== null && index !== pendingIndex) return
      settle()
      activate(index)
    },
    select(id) {
      choose(indexForProgram(id), true)
    },
    settle,
  }
}
