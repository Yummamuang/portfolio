import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/dial.css'
import { createDial } from './dial/dial'
import { PROGRAMS, isProgramId } from './dial/dial-model'
import { observeSections } from './dial/scroll-spy'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const dialRoot = document.getElementById('dial')
if (dialRoot) {
  const dial = createDial({
    root: dialRoot,
    status: document.querySelector<HTMLElement>('[data-dial-status]'),
    lamp: document.querySelector<HTMLElement>('[data-lamp]'),
    next: document.querySelector<HTMLAnchorElement>('[data-dial-next]'),
    onSelect: (id) => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    },
  })
  const sections = PROGRAMS.map((program) => document.getElementById(program.id)).filter(
    (section): section is HTMLElement => section !== null,
  )
  new ResizeObserver(() => {
    const height = Math.ceil(dialRoot.getBoundingClientRect().height)
    document.documentElement.style.setProperty('--dial-bar-h', `${height}px`)
  }).observe(dialRoot)
  window.addEventListener('scrollend', () => dial.settle())
  observeSections(sections, (id) => {
    if (isProgramId(id)) dial.setActive(id)
  })
}
