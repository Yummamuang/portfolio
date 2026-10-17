import { beforeEach, describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'
import { createWorkPanel } from './work-panel'

const PANEL_MARKUP = `
  <div data-work-featured></div>
  <p data-work-status></p>
  <ol data-work-list></ol>`

function setup(autoplay = true) {
  const root = document.createElement('section')
  root.innerHTML = PANEL_MARKUP
  createWorkPanel({ root, projects: PROJECTS, autoplay })
  return root
}

function text(root: HTMLElement, selector: string) {
  return root.querySelector(selector)?.textContent ?? ''
}

function click(root: HTMLElement, selector: string) {
  const target = root.querySelector(selector)
  if (!(target instanceof HTMLElement)) throw new Error(`missing ${selector}`)
  target.click()
}

describe('createWorkPanel', () => {
  let root: HTMLElement

  beforeEach(() => {
    root = setup()
  })

  it('features the first project with its link on start', () => {
    expect(text(root, '[data-work-featured] h3')).toBe('Impacted canine assessment')
    expect(root.querySelector('[data-work-featured] a.button-primary')?.getAttribute('href')).toBe(
      'https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine',
    )
    expect(text(root, '[data-work-featured] .work-count')).toBe('1 / 6')
    expect(text(root, '[data-work-featured] .work-summary')).toBe(PROJECTS[0]?.summary)
    expect(root.querySelector('[data-work-featured] .kicker')).toBeNull()
    expect(root.querySelector('[data-work-featured] .work-media')).not.toBeNull()
  })

  it('links an image project media frame to the project', () => {
    click(root, '[data-work-next]')

    expect(root.querySelector('[data-work-featured] a.work-media')?.getAttribute('href')).toBe(
      'https://manga-system.vercel.app/',
    )
  })

  it('lists every project as a button', () => {
    expect(root.querySelectorAll('[data-work-list] button')).toHaveLength(6)
  })

  it('features a project chosen from the list and marks it pressed', () => {
    click(root, '[data-work-list] li:nth-child(6) button')

    expect(text(root, '[data-work-featured] h3')).toBe('Snake game')
    expect(
      root.querySelector('[data-work-list] li:nth-child(6) button')?.getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      root.querySelector('[data-work-list] li:nth-child(1) button')?.getAttribute('aria-pressed'),
    ).toBe('false')
  })

  it('wraps from the last project to the first on Next project', () => {
    click(root, '[data-work-list] li:nth-child(6) button')
    click(root, '[data-work-next]')

    expect(text(root, '[data-work-featured] h3')).toBe('Impacted canine assessment')
  })

  it('shows the poster on a video project', () => {
    expect(root.querySelector('[data-work-featured] video')?.getAttribute('poster')).toMatch(
      /img\/posters\/canine\.jpg$/,
    )
  })

  it('tags a desktop-only project', () => {
    click(root, '[data-work-next]')

    expect(text(root, '[data-work-featured] .work-desktop-only')).toBe('Desktop only')
  })

  it('leaves the desktop-only tag off other projects', () => {
    expect(root.querySelector('[data-work-featured] .work-desktop-only')).toBeNull()
  })

  it('shows controls instead of autoplay when autoplay is off', () => {
    const still = setup(false)
    const video = still.querySelector('[data-work-featured] video')

    expect(video?.hasAttribute('autoplay')).toBe(false)
    expect(video?.hasAttribute('controls')).toBe(true)
  })

  it('keeps focus on Next project after it is pressed', () => {
    document.body.append(root)
    const next = root.querySelector('[data-work-next]')
    if (!(next instanceof HTMLElement)) throw new Error('missing next')
    next.focus()
    next.click()

    expect(document.activeElement).toBe(root.querySelector('[data-work-next]'))
    expect(text(root, '[data-work-featured] h3')).toBe('Manga recommendation')
    root.remove()
  })

  it('labels each list entry with its tag only', () => {
    expect(text(root, '[data-work-list] .work-stop-tag')).toBe('GitHub')
  })

  it('offers playback controls when autoplay is on', () => {
    const video = root.querySelector('[data-work-featured] video')

    expect(video?.hasAttribute('autoplay')).toBe(true)
    expect(video?.hasAttribute('controls')).toBe(true)
  })

  it('leaves the status region empty until the selection changes', () => {
    expect(text(root, '[data-work-status]')).toBe('')
  })

  it('announces the selected project in the status region', () => {
    click(root, '[data-work-next]')

    expect(text(root, '[data-work-status]')).toBe('Project 2 of 6: Manga recommendation')
  })
})
