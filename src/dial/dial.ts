import {
  PROGRAMS,
  angleForIndex,
  indexForAngle,
  indexForProgram,
  pointerAngle,
  stepIndex,
  type ProgramId,
} from './dial-model'

export interface DialOptions {
  root: HTMLElement
  status: HTMLElement | null
  lamp: HTMLElement | null
  onSelect: (id: ProgramId) => void
}

export interface DialHandle {
  setActive(id: ProgramId): void
}

const KEY_STEPS: Readonly<Record<string, number>> = {
  ArrowRight: 1,
  ArrowUp: 1,
  ArrowLeft: -1,
  ArrowDown: -1,
}

const ARC_LIMIT = 120

export function createDial({ root, status, lamp, onSelect }: DialOptions): DialHandle {
  const knob = root.querySelector('[data-dial-knob]')
  if (!(knob instanceof HTMLElement)) throw new Error('Dial markup is missing [data-dial-knob]')
  const dialKnob = knob
  const labels = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-program]'))
  let activeIndex = 0

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
    if (status) status.textContent = `Program ${index + 1} / ${PROGRAMS.length} · ${program.title}`
  }

  function blinkLamp() {
    if (!lamp) return
    lamp.removeAttribute('data-blink')
    lamp.setAttribute('data-blink', '')
  }

  function activate(index: number) {
    if (index === activeIndex) return false
    activeIndex = index
    render(index)
    blinkLamp()
    return true
  }

  function choose(index: number) {
    const changed = activate(index)
    const program = PROGRAMS[index]
    if (changed && program) onSelect(program.id)
  }

  if (lamp) {
    lamp.addEventListener('animationend', () => lamp.removeAttribute('data-blink'))
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
    const box = root.getBoundingClientRect()
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
      activate(indexForProgram(id))
    },
  }
}
