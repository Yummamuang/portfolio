import '@fontsource-variable/archivo'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'
import './styles/dial.css'
import './styles/work.css'
import './styles/sections.css'
import './styles/cursor.css'
import { createDetentRing } from './cursor/detent-ring'
import { createDial } from './dial/dial'
import { PROGRAMS, isProgramId } from './dial/dial-model'
import { watchPageEnd } from './dial/page-end'
import { observeSections } from './dial/scroll-spy'
import { createTuner, type TunerHandle } from './dial/tuner'
import { PROJECTS } from './work/projects'
import { createWorkPanel } from './work/work-panel'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const workRoot = document.querySelector<HTMLElement>('[data-work]')
if (workRoot) {
  createWorkPanel({ root: workRoot, projects: PROJECTS, autoplay: !reducedMotion.matches })
}

const dialRoot = document.getElementById('dial')
if (dialRoot) {
  let tuner: TunerHandle | null = null
  let pageEnd: ReturnType<typeof watchPageEnd> | null = null
  const dial = createDial({
    root: dialRoot,
    status: document.querySelector<HTMLElement>('[data-dial-status]'),
    lamp: document.querySelector<HTMLElement>('[data-lamp]'),
    next: document.querySelector<HTMLAnchorElement>('[data-dial-next]'),
    onSelect: (id) => {
      pageEnd?.choiceStarted()
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' })
    },
    onChange: (index) => tuner?.centre(index),
  })
  const sections = PROGRAMS.map((program) => document.getElementById(program.id)).filter(
    (section): section is HTMLElement => section !== null,
  )
  new ResizeObserver(() => {
    const height = Math.ceil(dialRoot.getBoundingClientRect().height)
    document.documentElement.style.setProperty('--dial-bar-h', `${height}px`)
  }).observe(dialRoot)
  pageEnd = watchPageEnd(dial)
  observeSections(sections, (id) => {
    if (isProgramId(id) && !pageEnd?.atPageEnd()) dial.setActive(id)
  })

  const labelList = dialRoot.querySelector<HTMLElement>('.dial-labels')
  const labels = Array.from(dialRoot.querySelectorAll<HTMLAnchorElement>('a[data-program]'))
  if (labelList) {
    const phone = window.matchMedia('(max-width: 900px)')
    const syncTuner = () => {
      if (phone.matches && !tuner) {
        tuner = createTuner({
          list: labelList,
          labels,
          reducedMotion,
          onCommit: (index) => {
            const program = PROGRAMS[index]
            if (program) dial.select(program.id)
          },
        })
      } else if (!phone.matches && tuner) {
        tuner.destroy()
        tuner = null
      }
    }
    phone.addEventListener('change', syncTuner)
    syncTuner()
  }
}

const ring = document.querySelector<HTMLElement>('[data-detent-ring]')
if (ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  createDetentRing({ ring, dialFace: document.querySelector<HTMLElement>('.dial-face') })
}
