const SETTLE_DEBOUNCE_MS = 160

export interface TunerOptions {
  list: HTMLElement
  labels: HTMLAnchorElement[]
  onCommit: (index: number) => void
  reducedMotion: { matches: boolean }
}

export interface TunerHandle {
  centre(index: number): void
  destroy(): void
}

export function createTuner({ list, labels, onCommit, reducedMotion }: TunerOptions): TunerHandle {
  const listeners = new AbortController()
  const { signal } = listeners
  const originalTabindex = labels.map((label) => label.getAttribute('tabindex'))
  let rovingIndex = Math.max(
    0,
    labels.findIndex((label) => label.getAttribute('aria-current') === 'true'),
  )
  let fingerDown = false
  // A swipe is the only scroll that may commit. Programmatic centring and snap
  // corrections must not select a program.
  let swiped = false
  let settleTimer: ReturnType<typeof setTimeout> | undefined

  function setRoving(index: number) {
    rovingIndex = index
    labels.forEach((label, position) =>
      label.setAttribute('tabindex', position === index ? '0' : '-1'),
    )
  }

  function scrollTargetFor(index: number) {
    const label = labels[index]
    if (!label) return null
    return label.offsetLeft + label.offsetWidth / 2 - list.clientWidth / 2
  }

  function centredIndex() {
    const middle = list.scrollLeft + list.clientWidth / 2
    let nearest = 0
    let nearestDistance = Infinity
    labels.forEach((label, index) => {
      const distance = Math.abs(label.offsetLeft + label.offsetWidth / 2 - middle)
      if (distance < nearestDistance) {
        nearest = index
        nearestDistance = distance
      }
    })
    return nearest
  }

  function settleSwipe() {
    clearTimeout(settleTimer)
    if (!swiped || fingerDown) return
    swiped = false
    const index = centredIndex()
    if (index === rovingIndex) return
    setRoving(index)
    onCommit(index)
  }

  function scheduleSettle() {
    clearTimeout(settleTimer)
    settleTimer = setTimeout(settleSwipe, SETTLE_DEBOUNCE_MS)
  }

  function press() {
    fingerDown = true
  }

  // A vertical page scroll can start on the rail without moving it. Only a lift
  // after the rail moved under the finger commits, otherwise the rail snaps back.
  function release() {
    fingerDown = false
    if (swiped) scheduleSettle()
    else scrollToCentre(rovingIndex)
  }

  function scrollToCentre(index: number) {
    const left = scrollTargetFor(index)
    if (left === null) return
    list.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' })
  }

  function onRailScroll() {
    if (fingerDown) swiped = true
    else if (swiped) scheduleSettle()
  }

  function keyTarget(key: string) {
    if (key === 'ArrowRight') return rovingIndex + 1
    if (key === 'ArrowLeft') return rovingIndex - 1
    if (key === 'Home') return 0
    if (key === 'End') return labels.length - 1
    return null
  }

  function commitFromKeyboard(index: number) {
    swiped = false
    setRoving(index)
    labels[index]?.focus()
    onCommit(index)
  }

  setRoving(rovingIndex)
  const initialLeft = scrollTargetFor(rovingIndex)
  if (initialLeft !== null) list.scrollTo({ left: initialLeft, behavior: 'auto' })

  list.addEventListener('pointerdown', press, { signal })
  list.addEventListener('pointerup', release, { signal })
  list.addEventListener('touchend', release, { signal })
  list.addEventListener('touchcancel', release, { signal })
  list.addEventListener('scroll', onRailScroll, { signal })
  list.addEventListener('scrollend', settleSwipe, { signal })

  // The dial's own label listener chooses on a tap, so the tuner only drops the swipe state.
  list.addEventListener(
    'click',
    () => {
      swiped = false
    },
    { signal },
  )

  list.addEventListener(
    'keydown',
    (event) => {
      const target = keyTarget(event.key)
      if (target === null) return
      event.preventDefault()
      if (target < 0 || target >= labels.length || target === rovingIndex) return
      commitFromKeyboard(target)
    },
    { signal },
  )

  return {
    centre(index) {
      if (!labels[index]) return
      setRoving(index)
      if (fingerDown) return
      swiped = false
      scrollToCentre(index)
    },
    destroy() {
      listeners.abort()
      clearTimeout(settleTimer)
      labels.forEach((label, index) => {
        const original = originalTabindex[index]
        if (original === null || original === undefined) label.removeAttribute('tabindex')
        else label.setAttribute('tabindex', original)
      })
    },
  }
}
