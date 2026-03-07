import { describe, it, expect } from 'vitest'
import { getHingeConfig, resolveHingeSide } from '../hinge'

describe('getHingeConfig', () => {
  it('returns correct config for bottom', () => {
    const config = getHingeConfig('bottom')
    expect(config.axis).toBe('rotateX')
    expect(config.transformOrigin).toBe('center bottom')
    expect(config.restAngle).toBe(-20)
    expect(config.hoverAngle).toBe(-30)
    expect(config.openAngle).toBe(-100)
  })

  it('returns correct config for top', () => {
    const config = getHingeConfig('top')
    expect(config.axis).toBe('rotateX')
    expect(config.transformOrigin).toBe('center top')
    expect(config.restAngle).toBe(20)
    expect(config.openAngle).toBe(100)
  })

  it('returns correct config for left', () => {
    const config = getHingeConfig('left')
    expect(config.axis).toBe('rotateY')
    expect(config.transformOrigin).toBe('left center')
    expect(config.restAngle).toBe(-15)
    expect(config.openAngle).toBe(-120)
  })

  it('returns correct config for right', () => {
    const config = getHingeConfig('right')
    expect(config.axis).toBe('rotateY')
    expect(config.transformOrigin).toBe('right center')
    expect(config.restAngle).toBe(15)
    expect(config.openAngle).toBe(120)
  })

  it('all configs have backFaceTransform', () => {
    for (const side of ['bottom', 'top', 'left', 'right'] as const) {
      expect(getHingeConfig(side).backFaceTransform).toMatch(/rotate[XY]\(180deg\)/)
    }
  })
})

describe('resolveHingeSide', () => {
  it('returns the explicit side when not auto', () => {
    expect(resolveHingeSide('left', 400, 200)).toBe('left')
    expect(resolveHingeSide('right', 400, 200)).toBe('right')
    expect(resolveHingeSide('top', 400, 200)).toBe('top')
    expect(resolveHingeSide('bottom', 400, 200)).toBe('bottom')
  })

  it('resolves auto to bottom for landscape cards', () => {
    expect(resolveHingeSide('auto', 400, 200)).toBe('bottom')
  })

  it('resolves auto to bottom for square cards', () => {
    expect(resolveHingeSide('auto', 300, 300)).toBe('bottom')
  })

  it('resolves auto to left for portrait cards', () => {
    expect(resolveHingeSide('auto', 200, 400)).toBe('left')
  })
})
