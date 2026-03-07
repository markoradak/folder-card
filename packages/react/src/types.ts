import type { CSSProperties, ReactNode } from 'react'

export type HingeSide = 'bottom' | 'top' | 'left' | 'right'
export type HingeSideProp = HingeSide | 'auto'

export type NotchPosition =
  | 'top-left' | 'top' | 'top-right'
  | 'right'
  | 'bottom-right' | 'bottom' | 'bottom-left'
  | 'left'

export interface SpringConfig {
  stiffness?: number
  damping?: number
}

export interface FolderCardGroupProps {
  children: ReactNode
  /** Padding (px) between the dialog and the viewport edge. Default: 32 */
  dialogViewportPadding?: number
  /** Delay (ms) before dialog content fades in after open spring settles. Default: 200 */
  contentRevealDelay?: number
  /** Override the default open angle (deg) for the lid rotation. When omitted, each hinge side uses its own default. */
  openAngle?: number
  /** Spring config for position/size and lid rotation transitions. */
  springConfig?: SpringConfig
  /** Duration (s) of the backdrop fade in/out. Default: 0.25 */
  backdropDuration?: number
  /** Duration (s) of the content fade-out on close. Default: 0.15 */
  exitDuration?: number
  /** Maximum target width (px) the dialog scales to when content is smaller than this floor. Default: 1000 */
  dialogMinWidth?: number
  backdropClassName?: string
  dialogClassName?: string
  /** When true, the lid fades out as the card opens instead of staying visible during rotation. Default: false */
  fadeLid?: boolean
  onOpen?: (id: string) => void
  onClose?: (id: string) => void
}

export interface FolderCardProps {
  id: string
  /** Renders content on the card face and on the expanded lid's front face. */
  renderLid: () => ReactNode
  /** Renders content inside the expanded dialog. Receives `close` so callers can dismiss. Called twice (measurement + display) — keep side-effect-free. */
  renderDetail: (close: () => void) => ReactNode
  /** Renders content inside the tab notch. When provided, the notch mask is derived from the tab's measured dimensions. */
  renderTab?: () => ReactNode
  className?: string
  style?: CSSProperties
  /** Perspective depth (px) for the 3D lid rotation. Default: 1800 */
  perspective?: number
  /** Which edge the lid hinges on. 'auto' picks 'left' for portrait cards, 'bottom' for landscape. Default: 'auto' */
  hingeSide?: HingeSideProp
  /** Where the tab notch sits. Default: 'top-right' */
  notchPosition?: NotchPosition
  /** Outer (concave) corner radius of the notch cutout in px. Default: 20 */
  notchOuterRadius?: number
  /** Inner (inverted) corner radius of the notch cutout in px. Default: 14 */
  notchInnerRadius?: number
  /** Observe --fc-radius changes at runtime and update the notch mask reactively. Default: false */
  liveRadius?: boolean
  /** Accessible label for the expanded dialog. Announced by screen readers when the card opens. */
  ariaLabel?: string
}
