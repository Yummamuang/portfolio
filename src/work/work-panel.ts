import type { Project } from './projects'

interface WorkPanelOptions {
  root: HTMLElement
  projects: readonly Project[]
  autoplay: boolean
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  children: Array<Node | string> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  if (className) node.className = className
  node.append(...children)
  return node
}

function renderPlaybackButton(video: HTMLVideoElement, autoplay: boolean): HTMLButtonElement {
  const button = el('button', 'work-playback')
  button.type = 'button'
  const sync = (playing: boolean) => {
    button.textContent = playing ? 'Pause' : 'Play'
    button.setAttribute('aria-label', playing ? 'Pause video' : 'Play video')
  }
  sync(autoplay)
  video.addEventListener('play', () => sync(true))
  video.addEventListener('pause', () => sync(false))
  button.addEventListener('click', () => {
    if (!video.paused) {
      video.pause()
      return
    }
    // A blocked play() fires no event, so put the label back from the video itself.
    video.play().catch(() => sync(!video.paused))
  })
  return button
}

function renderMedia(project: Project, autoplay: boolean): HTMLElement {
  if (project.media.kind === 'image') {
    const frameLink = el('a', 'work-media')
    frameLink.href = project.link.href
    frameLink.tabIndex = -1
    frameLink.setAttribute('aria-hidden', 'true')
    const image = el('img', '')
    image.src = project.media.src
    image.alt = project.media.alt
    frameLink.append(image)
    return frameLink
  }
  const frame = el('div', 'work-media')
  const video = el('video', '')
  video.setAttribute('src', project.media.src)
  video.setAttribute('poster', project.media.poster)
  video.setAttribute('preload', 'metadata')
  video.setAttribute('playsinline', '')
  video.setAttribute('loop', '')
  video.muted = true
  video.setAttribute('muted', '')
  video.setAttribute('aria-label', `Video of ${project.title}`)
  if (autoplay) video.setAttribute('autoplay', '')
  frame.append(video, renderPlaybackButton(video, autoplay))
  return frame
}

export function createWorkPanel({ root, projects, autoplay }: WorkPanelOptions) {
  const featured = root.querySelector('[data-work-featured]')
  const list = root.querySelector('[data-work-list]')
  if (!(featured instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    throw new Error('Work markup is missing [data-work-featured] or [data-work-list]')
  }
  const featuredRoot = featured
  const status = root.querySelector('[data-work-status]')
  let current = 0

  const next = el('button', 'button-secondary', ['Next project'])
  next.type = 'button'
  next.dataset.workNext = ''
  next.addEventListener('click', () => select((current + 1) % projects.length))

  const count = el('span', 'work-count')
  count.setAttribute('aria-hidden', 'true')

  const buttons = projects.map((project, index) => {
    const button = el('button', 'work-stop', [el('span', 'work-stop-title', [project.title])])
    button.type = 'button'
    button.addEventListener('click', () => select(index))
    return button
  })
  list.replaceChildren(...buttons.map((button) => el('li', '', [button])))

  let started = false

  function select(index: number) {
    const project = projects[index]
    if (!project) return
    current = index
    // Moving the button between rows drops focus, so hand it back.
    const nextHadFocus = document.activeElement === next

    const link = el('a', 'button-primary', [project.link.label])
    link.href = project.link.href
    count.textContent = `${index + 1} / ${projects.length}`
    if (status && started)
      status.textContent = `Project ${index + 1} of ${projects.length}: ${project.title}`

    const body = el('div', 'work-body', [
      el('h3', 'work-title', [project.title]),
      el('p', 'work-summary', [project.summary]),
    ])
    const badgeSlot = el('div', 'work-badge-slot')
    if (project.desktopOnly) badgeSlot.append(el('p', 'work-desktop-only', ['Desktop only']))
    body.append(badgeSlot)
    body.append(el('div', 'work-actions', [link, next, count]))

    featuredRoot.replaceChildren(renderMedia(project, autoplay), body)
    if (nextHadFocus) next.focus()
    buttons.forEach((button, buttonIndex) =>
      button.setAttribute('aria-pressed', String(buttonIndex === index)),
    )
  }

  select(0)
  started = true
  return { select }
}
