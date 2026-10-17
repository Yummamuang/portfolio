export type ProgramId = 'work' | 'loops' | 'agents' | 'stack' | 'about' | 'contact'

export interface Program {
  id: ProgramId
  title: string
  angle: number
}

export interface Point {
  x: number
  y: number
}

const FIRST_STOP_ANGLE = -120
const STOP_SPACING = 48

const PROGRAM_TITLES: ReadonlyArray<readonly [ProgramId, string]> = [
  ['work', 'Work'],
  ['loops', 'Loops'],
  ['agents', 'Agents'],
  ['stack', 'Stack'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

export const PROGRAMS: readonly Program[] = PROGRAM_TITLES.map(([id, title], index) => ({
  id,
  title,
  angle: FIRST_STOP_ANGLE + index * STOP_SPACING,
}))

const LAST_INDEX = PROGRAMS.length - 1

function clampIndex(index: number): number {
  return Math.min(LAST_INDEX, Math.max(0, index))
}

export function stepIndex(index: number, delta: number): number {
  return clampIndex(index + delta)
}

export function angleForIndex(index: number): number {
  return FIRST_STOP_ANGLE + clampIndex(index) * STOP_SPACING
}

export function indexForAngle(angle: number): number {
  return clampIndex(Math.round((angle - FIRST_STOP_ANGLE) / STOP_SPACING))
}

export function indexForProgram(id: ProgramId): number {
  return PROGRAMS.findIndex((program) => program.id === id)
}

export function pointerAngle(center: Point, point: Point): number {
  const radians = Math.atan2(point.x - center.x, center.y - point.y)
  return (radians * 180) / Math.PI
}

export function isProgramId(value: string): value is ProgramId {
  return PROGRAMS.some((program) => program.id === value)
}
