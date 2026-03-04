import type { HingeSide, HingeSideProp, NotchPosition } from './types'

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

const NOTCH_POSITION_CLASSES: Record<NotchPosition, string> = {
  'top-left': 'absolute top-0 left-0 z-20',
  'top': 'absolute top-0 left-1/2 -translate-x-1/2 z-20',
  'top-right': 'absolute top-0 right-0 z-20',
  'right': 'absolute top-1/2 right-0 -translate-y-1/2 z-20',
  'bottom-right': 'absolute bottom-0 right-0 z-20',
  'bottom': 'absolute bottom-0 left-1/2 -translate-x-1/2 z-20',
  'bottom-left': 'absolute bottom-0 left-0 z-20',
  'left': 'absolute top-1/2 left-0 -translate-y-1/2 z-20',
}

export function getNotchPositionClasses(pos: NotchPosition): string {
  return NOTCH_POSITION_CLASSES[pos]
}
