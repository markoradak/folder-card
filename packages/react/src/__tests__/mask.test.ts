import { describe, it, expect } from 'vitest'
import { buildPanelMask, buildPanelBorder } from '../mask'
import type { PanelMaskParams } from '../mask'

const BASE_PARAMS: PanelMaskParams = {
  cardWidth: 300,
  cardHeight: 200,
  tabWidth: 60,
  tabHeight: 40,
  concaveRadius: 20,
  invertedRadius: 14,
}

describe('buildPanelMask', () => {
  it('returns a data URI string', () => {
    const mask = buildPanelMask(BASE_PARAMS)
    expect(mask).toMatch(/^url\("data:image\/svg\+xml,/)
    expect(mask).toContain('fill%3D%22white%22')
  })

  it('uses correct viewBox dimensions', () => {
    const mask = buildPanelMask(BASE_PARAMS)
    expect(mask).toContain('viewBox%3D%220%200%20300%20200%22')
  })

  it('works for all 8 notch positions', () => {
    const positions = [
      'top-left', 'top', 'top-right', 'right',
      'bottom-right', 'bottom', 'bottom-left', 'left',
    ] as const

    for (const pos of positions) {
      const mask = buildPanelMask({ ...BASE_PARAMS, notchPosition: pos })
      expect(mask).toMatch(/^url\("data:image\/svg\+xml,/)
    }
  })

  it('defaults to top-right when notchPosition is omitted', () => {
    const { notchPosition: _, ...params } = { ...BASE_PARAMS, notchPosition: undefined }
    const withDefault = buildPanelMask(params as PanelMaskParams)
    const explicit = buildPanelMask({ ...BASE_PARAMS, notchPosition: 'top-right' })
    expect(withDefault).toBe(explicit)
  })

  it('handles zero-size tab gracefully', () => {
    const mask = buildPanelMask({ ...BASE_PARAMS, tabWidth: 0, tabHeight: 0 })
    expect(mask).toMatch(/^url\("data:image\/svg\+xml,/)
  })

  it('clamps radii when they exceed tab dimensions', () => {
    const mask = buildPanelMask({
      ...BASE_PARAMS,
      tabWidth: 20,
      tabHeight: 20,
      concaveRadius: 50,
      invertedRadius: 50,
    })
    expect(mask).toMatch(/^url\("data:image\/svg\+xml,/)
  })
})

describe('buildPanelBorder', () => {
  it('returns a stroke-based SVG data URI', () => {
    const border = buildPanelBorder(BASE_PARAMS)
    expect(border).toMatch(/^url\("data:image\/svg\+xml,/)
    expect(border).toContain('fill%3D%22none%22')
    expect(border).toContain('stroke%3D%22white%22')
  })

  it('works for all 8 notch positions', () => {
    const positions = [
      'top-left', 'top', 'top-right', 'right',
      'bottom-right', 'bottom', 'bottom-left', 'left',
    ] as const

    for (const pos of positions) {
      const border = buildPanelBorder({ ...BASE_PARAMS, notchPosition: pos })
      expect(border).toMatch(/^url\("data:image\/svg\+xml,/)
    }
  })
})
