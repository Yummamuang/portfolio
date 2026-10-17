import { describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'

const base = import.meta.env.BASE_URL

describe('PROJECTS', () => {
  it('orders the projects with the impacted canine project first', () => {
    expect(PROJECTS.map((project) => project.id)).toEqual([
      'canine',
      'manga',
      'catspace',
      'gym',
      'data',
      'snake',
    ])
  })

  it('links every project to a repo, live site or bundled site', () => {
    for (const project of PROJECTS) {
      const opensSomething =
        project.link.href.startsWith('https://') || project.link.href.startsWith(base)
      expect(opensSomething, project.id).toBe(true)
    }
  })

  it('gives every video a poster under the site base', () => {
    for (const project of PROJECTS) {
      if (project.media.kind === 'video') {
        expect(project.media.poster.startsWith(`${base}img/posters/`), project.id).toBe(true)
      }
    }
  })

  it('gives every image alt text', () => {
    for (const project of PROJECTS) {
      if (project.media.kind === 'image') {
        expect(project.media.alt.length, project.id).toBeGreaterThan(0)
      }
    }
  })
})
