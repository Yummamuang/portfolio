import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const page = new DOMParser().parseFromString(html, 'text/html')

describe('home page rules', () => {
  it('credits the superpowers skills in the agents program', () => {
    expect(page.querySelector('#agents')?.textContent).toContain('superpowers')
  })

  it('has no kicker labels on the page', () => {
    expect(page.querySelector('.kicker')).toBeNull()
  })

  it('links older work to the archived pages', () => {
    const hrefs = Array.from(page.querySelectorAll('#about a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining(['./pages/lab.html', './pages/project.html', './pages/about.html']),
    )
  })

  it('keeps the loops copy consistent with the write-up', () => {
    expect(page.querySelector('#loops .panel-lede')?.textContent).not.toContain(
      'check its own result',
    )
  })

  it('has exactly one top-level heading', () => {
    expect(page.querySelectorAll('h1')).toHaveLength(1)
  })
})
