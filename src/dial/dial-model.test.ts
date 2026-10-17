import { describe, expect, it } from 'vitest'
import {
  PROGRAMS,
  angleForIndex,
  indexForAngle,
  indexForProgram,
  isProgramId,
  pointerAngle,
  stepIndex,
} from './dial-model'

describe('PROGRAMS', () => {
  it('lists the six programs in dial order starting with work', () => {
    expect(PROGRAMS.map((program) => program.id)).toEqual([
      'work',
      'loops',
      'agents',
      'stack',
      'about',
      'contact',
    ])
  })

  it('spaces the stops 48 degrees apart from -120 to 120', () => {
    expect(PROGRAMS.map((program) => program.angle)).toEqual([-120, -72, -24, 24, 72, 120])
  })
})

describe('stepIndex', () => {
  it('moves one stop forward', () => {
    expect(stepIndex(0, 1)).toBe(1)
  })

  it('stays on the last program when stepping past it', () => {
    expect(stepIndex(5, 1)).toBe(5)
  })

  it('stays on the first program when stepping before it', () => {
    expect(stepIndex(0, -1)).toBe(0)
  })
})

describe('indexForAngle', () => {
  it('snaps an angle short of the midpoint to the nearer stop', () => {
    expect(indexForAngle(-100)).toBe(0)
  })

  it('snaps an angle past the midpoint to the next stop', () => {
    expect(indexForAngle(-95)).toBe(1)
  })

  it('clamps angles past the last stop to the last program', () => {
    expect(indexForAngle(170)).toBe(5)
  })

  it('clamps angles before the first stop to the first program', () => {
    expect(indexForAngle(-170)).toBe(0)
  })
})

describe('angleForIndex', () => {
  it('returns the stop angle of a program index', () => {
    expect(angleForIndex(3)).toBe(24)
  })
})

describe('indexForProgram', () => {
  it('returns the dial position of a program id', () => {
    expect(indexForProgram('stack')).toBe(3)
  })
})

describe('pointerAngle', () => {
  const center = { x: 0, y: 0 }

  it('reads a point straight above the center as 0 degrees', () => {
    expect(pointerAngle(center, { x: 0, y: -10 })).toBeCloseTo(0)
  })

  it('reads a point to the right of the center as 90 degrees', () => {
    expect(pointerAngle(center, { x: 10, y: 0 })).toBeCloseTo(90)
  })

  it('reads a point to the lower left as -135 degrees', () => {
    expect(pointerAngle(center, { x: -10, y: 10 })).toBeCloseTo(-135)
  })
})

describe('isProgramId', () => {
  it('accepts a program id', () => {
    expect(isProgramId('about')).toBe(true)
  })

  it('rejects an unknown id', () => {
    expect(isProgramId('work-title')).toBe(false)
  })
})
