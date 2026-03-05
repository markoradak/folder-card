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

// ── SVG serialisation ──────────────────────────────────────────────────

function toSvgDataUri(W: number, H: number, d: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="white"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function toStrokeSvgDataUri(W: number, H: number, d: string, strokeWidth = 1): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="white" stroke-width="${strokeWidth}"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// ── Shared path builders ───────────────────────────────────────────────

interface PathResult { W: number; H: number; d: string }

function buildCornerPath(
  { cardWidth: W, cardHeight: H, tabWidth: tw, tabHeight: th, concaveRadius = 20, invertedRadius = 14 }: PanelMaskParams,
  corner: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
): PathResult {
  const [cr, ir] = clampRadii(concaveRadius, invertedRadius, Math.min(tw, th))
  let d: string

  switch (corner) {
    case 'top-right': {
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

  return { W, H, d }
}

function buildEdgeCenterPath(
  { cardWidth: W, cardHeight: H, tabWidth: tw, tabHeight: th, concaveRadius = 20, invertedRadius = 14 }: PanelMaskParams,
  edge: 'top' | 'right' | 'bottom' | 'left',
): PathResult {
  const isHorizontal = edge === 'top' || edge === 'bottom'
  const depth = isHorizontal ? th : tw
  const span = isHorizontal ? tw : th
  let [cr, ir] = clampRadii(concaveRadius, invertedRadius, depth)
  cr = Math.min(cr, Math.floor(span / 2))

  let d: string

  switch (edge) {
    case 'top': {
      const x1 = (W - tw) / 2
      const x2 = x1 + tw
      const ny = th
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
      const x1 = (W - tw) / 2
      const x2 = x1 + tw
      const ny = H - th
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
      const y1 = (H - th) / 2
      const y2 = y1 + th
      const nx = W - tw
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
      const y1 = (H - th) / 2
      const y2 = y1 + th
      const nx = tw
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

  return { W, H, d }
}

// ── Public API ─────────────────────────────────────────────────────────

function resolvePathResult(params: PanelMaskParams): PathResult {
  const { notchPosition = 'top-right' } = params

  switch (notchPosition) {
    case 'top-right':
    case 'top-left':
    case 'bottom-right':
    case 'bottom-left':
      return buildCornerPath(params, notchPosition)
    case 'top':
    case 'right':
    case 'bottom':
    case 'left':
      return buildEdgeCenterPath(params, notchPosition)
  }
}

/**
 * Build an SVG data-URI **fill** mask with an L-shaped or U-shaped cutout.
 * Uses the card's actual pixel dimensions as the SVG viewBox so coordinates
 * map 1:1 -- no stretching distortion.
 */
export function buildPanelMask(params: PanelMaskParams): string {
  const { W, H, d } = resolvePathResult(params)
  return toSvgDataUri(W, H, d)
}

/**
 * Build an SVG data-URI **stroke** mask tracing the full L / U-shape outline.
 * Used to render a border along the entire panel edge (including the notch
 * curves) as a single element -- avoids the double-opacity artifacts that
 * occur when a CSS border overlaps a separate notch-only stroke.
 */
export function buildPanelBorder(params: PanelMaskParams): string {
  const { W, H, d } = resolvePathResult(params)
  return toStrokeSvgDataUri(W, H, d)
}
