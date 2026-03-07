export const DEFAULT_SPRING_STIFFNESS = 320
export const DEFAULT_SPRING_DAMPING = 42

export const DEFAULT_SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: DEFAULT_SPRING_STIFFNESS,
  damping: DEFAULT_SPRING_DAMPING,
}

export const DEFAULT_DIALOG_VIEWPORT_PADDING = 32
export const DEFAULT_CONTENT_REVEAL_DELAY = 200
export const DEFAULT_PERSPECTIVE = 1800
export const DEFAULT_BACKDROP_DURATION = 0.25
export const DEFAULT_EXIT_DURATION = 0.15
export const DEFAULT_FADE_LID = false

// Internal timing constants
export const HOVER_LIFT_Y = -4
export const SETTLE_TIMEOUT = 500
export const STAGGER_REPLAY_DELAY = 150
export const TAB_RESHOW_DELAY = 300
export const EXIT_SAFETY_TIMEOUT = 2000
export const DEFAULT_DIALOG_MIN_WIDTH = 1000
