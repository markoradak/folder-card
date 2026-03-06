import type { HingeSide, HingeSideProp } from './types'

export type RotationAxis = 'rotateX' | 'rotateY'

export interface HingeConfig {
  transformOrigin: string
  axis: RotationAxis
  restAngle: number
  hoverAngle: number
  openAngle: number
  gradientDirection: string
  backFaceTransform: string
}

const CONFIGS: Record<HingeSide, HingeConfig> = {
  bottom: {
    transformOrigin: 'center bottom',
    axis: 'rotateX',
    restAngle: -20,
    hoverAngle: -30,
    openAngle: -100,
    gradientDirection: 'to bottom',
    backFaceTransform: 'rotateX(180deg)',
  },
  top: {
    transformOrigin: 'center top',
    axis: 'rotateX',
    restAngle: 20,
    hoverAngle: 30,
    openAngle: 100,
    gradientDirection: 'to top',
    backFaceTransform: 'rotateX(180deg)',
  },
  left: {
    transformOrigin: 'left center',
    axis: 'rotateY',
    restAngle: -15,
    hoverAngle: -20,
    openAngle: -120,
    gradientDirection: 'to left',
    backFaceTransform: 'rotateY(180deg)',
  },
  right: {
    transformOrigin: 'right center',
    axis: 'rotateY',
    restAngle: 15,
    hoverAngle: 20,
    openAngle: 120,
    gradientDirection: 'to right',
    backFaceTransform: 'rotateY(180deg)',
  },
}

export function getHingeConfig(side: HingeSide): HingeConfig {
  return CONFIGS[side]
}

/**
 * Resolve 'auto' to a concrete HingeSide based on aspect ratio.
 * Portrait (height > width) -> 'left', landscape -> 'bottom'.
 */
export function resolveHingeSide(side: HingeSideProp, width: number, height: number): HingeSide {
  if (side !== 'auto') return side
  return height > width ? 'left' : 'bottom'
}

