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
  /** Final rotateX of the lid when fully open (deg). Default: -100 */
  openRotateX?: number
  /** Spring config for position/size and lid rotation transitions. */
  springConfig?: SpringConfig
  /** Duration (s) of the backdrop fade in/out. Default: 0.25 */
  backdropDuration?: number
  /** Duration (s) of the content fade-out on close. Default: 0.15 */
  exitDuration?: number
  backdropClassName?: string
  dialogClassName?: string
  onOpen?: (id: string) => void
  onClose?: (id: string) => void
}

export interface FolderCardProps {
  id: string
  /** Renders content on the card face and on the expanded lid's front face. */
  renderLid: () => ReactNode
  /** Renders content inside the expanded dialog. Receives `close` so callers can dismiss. */
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
}
