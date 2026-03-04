import type { NotchPosition } from './types'

export interface PanelMaskParams {
  cardWidth: number
  cardHeight: number
  tabWidth: number
  tabHeight: number
  concaveRadius?: number
  invertedRadius?: number
  notchPosition?: NotchPosition
}

/**
 * Clamp concave + inverted radii so their sum doesn't exceed available space.
 * Scales both proportionally when they overflow.
 */
function clampRadii(cr: number, ir: number, maxSum: number): [number, number] {
  if (maxSum <= 0) return [0, 0]
  const sum = cr + ir
  if (sum <= maxSum) return [cr, ir]
  const scale = maxSum / sum
  return [Math.floor(cr * scale), Math.floor(ir * scale)]
}

/**
 * Build an SVG data-URI mask with an L-shaped or U-shaped cutout for the tab notch.
 * Uses the card's actual pixel dimensions as the SVG viewBox so coordinates
 * map 1:1 -- no stretching distortion.
 */
export function buildPanelMask(params: PanelMaskParams): string {
  const { notchPosition = 'top-right' } = params

  switch (notchPosition) {
    case 'top-right':
    case 'top-left':
    case 'bottom-right':
    case 'bottom-left':
      return buildCornerMask(params, notchPosition)
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return buildEdgeCenterMask(params, notchPosition)
  }
}

function toSvgDataUri(W: number, H: number, d: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="white"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/**
 * L-shaped corner mask. The cutout sits in the specified corner.
 */
function buildCornerMask(
  { cardWidth: W, cardHeight: H, tabWidth: tw, tabHeight: th, concaveRadius = 20, invertedRadius = 14 }: PanelMaskParams,
  corner: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
): string {
  // cr + ir must fit within both tab width and tab height
  const [cr, ir] = clampRadii(concaveRadius, invertedRadius, Math.min(tw, th))

  let d: string

  switch (corner) {
    case 'top-right': {
      // Notch at top-right: left edge = W-tw, bottom edge = th
      const nx = W - tw
      const ny = th
      d = [
        `M 0,0`,
        `H ${nx - ir}`,
        `A ${ir},${ir} 0 0 1 ${nx},${ir}`,
        `V ${ny - cr}`,
        `A ${cr},${cr} 0 0 0 ${nx + cr},${ny}`,
        `H ${W - ir}`,
        `A ${ir},${ir} 0 0 1 ${W},${ny + ir}`,
        `V ${H}`,
        `H 0`,
        `Z`,
      ].join(' ')
      break
    }
    case 'top-left': {
      // Notch at top-left: right edge = tw, bottom edge = th
      const nx = tw
      const ny = th
      d = [
        `M ${W},0`,
        `H ${nx + ir}`,
        `A ${ir},${ir} 0 0 0 ${nx},${ir}`,
        `V ${ny - cr}`,
        `A ${cr},${cr} 0 0 1 ${nx - cr},${ny}`,
        `H ${ir}`,
        `A ${ir},${ir} 0 0 0 0,${ny + ir}`,
        `V ${H}`,
        `H ${W}`,
        `Z`,
      ].join(' ')
      break
    }
    case 'bottom-right': {
      // Notch at bottom-right: left edge = W-tw, top edge = H-th
      const nx = W - tw
      const ny = H - th
      d = [
        `M 0,0`,
        `H ${W}`,
        `V ${ny - ir}`,
        `A ${ir},${ir} 0 0 1 ${W - ir},${ny}`,
        `H ${nx + cr}`,
        `A ${cr},${cr} 0 0 0 ${nx},${ny + cr}`,
        `V ${H - ir}`,
        `A ${ir},${ir} 0 0 1 ${nx - ir},${H}`,
        `H 0`,
        `Z`,
      ].join(' ')
      break
    }
    case 'bottom-left': {
      // Notch at bottom-left: right edge = tw, top edge = H-th
      const nx = tw
      const ny = H - th
      d = [
        `M 0,0`,
        `H ${W}`,
        `V ${H}`,
        `H ${nx + ir}`,
        `A ${ir},${ir} 0 0 1 ${nx},${H - ir}`,
        `V ${ny + cr}`,
        `A ${cr},${cr} 0 0 0 ${nx - cr},${ny}`,
        `H ${ir}`,
        `A ${ir},${ir} 0 0 1 0,${ny - ir}`,
        `Z`,
      ].join(' ')
      break
    }
  }

  return toSvgDataUri(W, H, d)
}

/**
 * U-shaped edge-center mask. A rectangular indentation centered along the specified edge,
 * with inverted arcs at the outer corners and concave arcs at the inner corners.
 */
function buildEdgeCenterMask(
  { cardWidth: W, cardHeight: H, tabWidth: tw, tabHeight: th, concaveRadius = 20, invertedRadius = 14 }: PanelMaskParams,
  edge: 'top' | 'right' | 'bottom' | 'left',
): string {
  // For top/bottom: depth = th, concave must fit within half the tab width
  // For left/right: depth = tw, concave must fit within half the tab height
  const isHorizontal = edge === 'top' || edge === 'bottom'
  const depth = isHorizontal ? th : tw
  const span = isHorizontal ? tw : th
  let [cr, ir] = clampRadii(concaveRadius, invertedRadius, depth)
  // Each concave arc sweeps inward from both sides, so cr can't exceed half the span
  cr = Math.min(cr, Math.floor(span / 2))

  let d: string

  switch (edge) {
    case 'top': {
      // Centered along top edge; tab dimensions: width=tw, depth=th
      const x1 = (W - tw) / 2 // left edge of notch
      const x2 = x1 + tw       // right edge of notch
      const ny = th             // bottom edge of notch
      d = [
        `M 0,0`,
        `H ${x1 - ir}`,
        `A ${ir},${ir} 0 0 1 ${x1},${ir}`,
        `V ${ny - cr}`,
        `A ${cr},${cr} 0 0 0 ${x1 + cr},${ny}`,
        `H ${x2 - cr}`,
        `A ${cr},${cr} 0 0 0 ${x2},${ny - cr}`,
        `V ${ir}`,
        `A ${ir},${ir} 0 0 1 ${x2 + ir},0`,
        `H ${W}`,
        `V ${H}`,
        `H 0`,
        `Z`,
      ].join(' ')
      break
    }
    case 'bottom': {
      // Centered along bottom edge
      const x1 = (W - tw) / 2
      const x2 = x1 + tw
      const ny = H - th // top edge of notch
      d = [
        `M 0,0`,
        `H ${W}`,
        `V ${H}`,
        `H ${x2 + ir}`,
        `A ${ir},${ir} 0 0 1 ${x2},${H - ir}`,
        `V ${ny + cr}`,
        `A ${cr},${cr} 0 0 0 ${x2 - cr},${ny}`,
        `H ${x1 + cr}`,
        `A ${cr},${cr} 0 0 0 ${x1},${ny + cr}`,
        `V ${H - ir}`,
        `A ${ir},${ir} 0 0 1 ${x1 - ir},${H}`,
        `H 0`,
        `Z`,
      ].join(' ')
      break
    }
    case 'right': {
      // Centered along right edge; tab dimensions: depth=tw, height=th
      const y1 = (H - th) / 2 // top edge of notch
      const y2 = y1 + th       // bottom edge of notch
      const nx = W - tw         // left edge of notch
      d = [
        `M 0,0`,
        `H ${W}`,
        `V ${y1 - ir}`,
        `A ${ir},${ir} 0 0 1 ${W - ir},${y1}`,
        `H ${nx + cr}`,
        `A ${cr},${cr} 0 0 0 ${nx},${y1 + cr}`,
        `V ${y2 - cr}`,
        `A ${cr},${cr} 0 0 0 ${nx + cr},${y2}`,
        `H ${W - ir}`,
        `A ${ir},${ir} 0 0 1 ${W},${y2 + ir}`,
        `V ${H}`,
        `H 0`,
        `Z`,
      ].join(' ')
      break
    }
    case 'left': {
      // Centered along left edge
      const y1 = (H - th) / 2
      const y2 = y1 + th
      const nx = tw // right edge of notch
      d = [
        `M 0,0`,
        `H ${W}`,
        `V ${H}`,
        `H 0`,
        `V ${y2 + ir}`,
        `A ${ir},${ir} 0 0 1 ${ir},${y2}`,
        `H ${nx - cr}`,
        `A ${cr},${cr} 0 0 0 ${nx},${y2 - cr}`,
        `V ${y1 + cr}`,
        `A ${cr},${cr} 0 0 0 ${nx - cr},${y1}`,
        `H ${ir}`,
        `A ${ir},${ir} 0 0 1 0,${y1 - ir}`,
        `Z`,
      ].join(' ')
      break
    }
  }

  return toSvgDataUri(W, H, d)
}
