'use client'

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, usePresence, useAnimationControls } from 'framer-motion'
import { getHingeConfig, getNotchPositionClasses } from './hinge'
import type { HingeSide, NotchPosition } from './types'

const lidContentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const lidItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
}

const detailContentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export { lidContentVariants, lidItemVariants, detailContentVariants }
export { itemVariants } from './FolderCardItem'

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export interface FolderCardExpandedConfig {
  dialogViewportPadding: number
  contentRevealDelay: number
  openRotateX: number
  backdropDuration: number
  exitDuration: number
  springConfig: { type: 'spring'; stiffness: number; damping: number; restDelta?: number; restSpeed?: number }
  backdropClassName?: string
  dialogClassName?: string
}

interface FolderCardExpandedProps {
  cardRect: DOMRect
  initialAngle: number
  renderLid: () => ReactNode
  renderDetail: (close: () => void) => ReactNode
  renderTab?: () => ReactNode
  panelMask: string | null
  hingeSide: HingeSide
  notchPosition: NotchPosition
  onClose: () => void
  config: FolderCardExpandedConfig
}

export function FolderCardExpanded({
  cardRect,
  initialAngle,
  renderLid,
  renderDetail,
  renderTab,
  panelMask,
  hingeSide,
  notchPosition,
  onClose,
  config,
}: FolderCardExpandedProps) {
  const {
    dialogViewportPadding,
    contentRevealDelay,
    openRotateX,
    backdropDuration,
    exitDuration,
    springConfig,
    backdropClassName,
    dialogClassName,
  } = config

  const hinge = getHingeConfig(hingeSide)

  // Determine the final open angle:
  // For bottom hinge, honor the group-level openRotateX override if it differs from the default.
  // For other hinge sides, always use the hinge config's openAngle.
  const finalOpenAngle = hingeSide === 'bottom' ? openRotateX : hinge.openAngle

  const [isPresent, safeToRemove] = usePresence()
  const isPresentRef = useRef(true)
  isPresentRef.current = isPresent

  const lidControls = useAnimationControls()
  const detailControls = useAnimationControls()
  const measureRef = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null)
  const [tabHidden, setTabHidden] = useState(false)

  // Reveal dialog detail content with stagger after a short delay
  useEffect(() => {
    const t = setTimeout(() => detailControls.start('visible'), contentRevealDelay)
    return () => clearTimeout(t)
  }, [contentRevealDelay, detailControls])

  // Play stagger on open
  useEffect(() => {
    lidControls.start('visible')
  }, [lidControls])

  // Fade out tab content on open immediately
  useEffect(() => {
    setTabHidden(true)
  }, [])

  // Reset and re-play stagger on close (once lid swings back past -90deg)
  useEffect(() => {
    if (!isPresent) {
      lidControls.set('hidden')
      const t = setTimeout(() => lidControls.start('visible'), 150)
      return () => clearTimeout(t)
    }
  }, [isPresent, lidControls])

  // Fade tab content back in on close (with delay so lid settles first)
  useEffect(() => {
    if (!isPresent) {
      const t = setTimeout(() => setTabHidden(false), 300)
      return () => clearTimeout(t)
    }
  }, [isPresent])

  // Lock scroll on the nearest scrollable ancestor (not the body -- the page
  // may use an inner scroll container like <main class="overflow-y-auto">).
  // Compensate for scrollbar width to prevent layout shift.
  useEffect(() => {
    const wrapper = measureRef.current
    let scrollParent: HTMLElement | null = null
    if (wrapper) {
      let el: HTMLElement | null = wrapper.parentElement
      while (el && el !== document.documentElement) {
        const { overflowY } = getComputedStyle(el)
        if (overflowY === 'auto' || overflowY === 'scroll') {
          scrollParent = el
          break
        }
        el = el.parentElement
      }
    }
    const target = scrollParent ?? document.body

    // Measure scrollbar width before hiding overflow
    const scrollbarWidth = target === document.body
      ? window.innerWidth - document.documentElement.clientWidth
      : target.offsetWidth - target.clientWidth

    const prevOverflow = target.style.overflow
    const prevPaddingRight = target.style.paddingRight

    target.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      target.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      target.style.overflow = prevOverflow
      target.style.paddingRight = prevPaddingRight
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Continuously measure the hidden container. A ResizeObserver handles both
  // the initial layout and subsequent size changes when async content loads
  // (e.g. data fetches that replace a loading skeleton with full content).
  // framer-motion reactively springs to the updated animate targets.
  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const update = () => {
      setMeasured({ width: el.scrollWidth, height: el.scrollHeight })
    }

    // Synchronous initial measurement (before first paint)
    update()

    // Observe ongoing size changes (async content loading)
    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => ro.disconnect()
  }, [renderDetail])

  // Compute dialog target rect from measurements.
  // Minimum size preserves the card's aspect ratio scaled up so that loading
  // states don't produce a tiny dialog -- the card visually "grows" into the
  // dialog proportionally, then content takes over once it exceeds the floor.
  const dialogRect = useMemo(() => {
    const pad = dialogViewportPadding
    const maxW = window.innerWidth - pad * 2
    const maxH = window.innerHeight - pad * 2

    if (!measured) {
      // Before measurement completes, default to card rect (no premature animation)
      return {
        finalWidth: cardRect.width,
        finalHeight: cardRect.height,
        finalLeft: cardRect.left,
        finalTop: cardRect.top,
      }
    }

    // Aspect-ratio-preserving minimum: scale the card up to a target width,
    // then clamp to viewport if the resulting height overflows.
    const cardAspect = cardRect.width / cardRect.height
    let minW = Math.min(1000, maxW)
    let minH = minW / cardAspect
    if (minH > maxH) {
      minH = maxH
      minW = minH * cardAspect
    }

    const finalWidth = Math.min(Math.max(measured.width, minW), maxW)
    const finalHeight = Math.min(Math.max(measured.height, minH), maxH)
    const finalLeft = (window.innerWidth - finalWidth) / 2
    const finalTop = Math.max(pad, (window.innerHeight - finalHeight) / 2)
    return { finalWidth, finalHeight, finalLeft, finalTop }
  }, [measured, dialogViewportPadding, cardRect])

  const { finalWidth, finalHeight, finalLeft, finalTop } = dialogRect
  const springTransition = springConfig

  return (
    <Fragment>
      {/* Hidden measurement container -- renders content off-screen to measure natural size.
          Uses fit-content width so block/flex layouts size naturally within the max-width
          constraint rather than collapsing to minimum intrinsic width. */}
      <div
        ref={measureRef}
        style={{
          visibility: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          maxWidth: `${window.innerWidth - dialogViewportPadding * 2}px`,
          width: 'fit-content',
          zIndex: -1,
        }}
      >
        {renderDetail(onClose)}
      </div>

      {/* Backdrop: fades in/out independently */}
      <motion.div
        data-fc-backdrop=""
        className={cn('fixed inset-0 z-40 bg-black/50 backdrop-blur-sm', backdropClassName)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: backdropDuration }}
        onClick={onClose}
      />

      {/* Front-face lid -- outer div springs position/size with the dialog; inner div rotates */}
      <motion.div
        className="pointer-events-none fixed z-55"
        style={{ overflow: 'visible' }}
        initial={{ left: cardRect.left, top: cardRect.top, width: cardRect.width, height: cardRect.height }}
        animate={{ left: finalLeft, top: finalTop, width: finalWidth, height: finalHeight }}
        exit={{ left: cardRect.left, top: cardRect.top, width: cardRect.width, height: cardRect.height }}
        transition={springTransition}
      >
        {/* Inner rotating face -- perspective is element-local via transformTemplate
            so it doesn't drift when the FLIP container changes size */}
        <motion.div
          className="absolute inset-px transform-3d"
          transformTemplate={(_, generated) => `perspective(1800px) ${generated}`}
          style={{ transformOrigin: hinge.transformOrigin }}
          initial={{ [hinge.axis]: initialAngle }}
          animate={{ [hinge.axis]: finalOpenAngle }}
          exit={{ [hinge.axis]: hinge.restAngle }}
          transition={springTransition}
        >
          {/* Front face -- card content, hidden past -90deg via backface-visibility.
              No border / bg-card here -- the dialog (z-50) provides those.
              Using inset-px on the rotating div matches the collapsed card's lid
              (which sits inside the button's 1px border), ensuring identical
              perspective projection and no visual jump on close. */}
          <div className="absolute inset-0 rounded-(--fc-radius,1rem) backface-hidden">
            {/* Tinted overlay -- uses the same SVG mask as the collapsed card so the
                notch stretches smoothly and continuously during the FLIP spring. */}
            <div
              className="pointer-events-none absolute inset-0 rounded-(--fc-radius,1rem)"
              style={{
                backgroundColor: 'var(--fc-tint, color-mix(in srgb, var(--color-foreground) 6%, var(--color-card)))',
                ...(panelMask ? {
                  maskImage: panelMask,
                  maskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskImage: panelMask,
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                } : {}),
              }}
            />

            {/* Tab content on expanded lid -- fades out quickly on open, back in on close */}
            {renderTab && (
              <div
                className={cn('pointer-events-none', getNotchPositionClasses(notchPosition))}
                style={{
                  opacity: tabHidden ? 0 : 1,
                  transition: tabHidden ? 'opacity 0.05s ease-out' : 'opacity 0.15s ease-out',
                }}
              >
                {renderTab()}
              </div>
            )}

            {/* Lid content with stagger animation controller */}
            <motion.div
              className="relative z-10"
              variants={lidContentVariants}
              initial="hidden"
              animate={lidControls}
            >
              {renderLid()}
            </motion.div>
          </div>

          {/* Back face -- gradient visible behind the lid */}
          <div
            className="absolute inset-0 rounded-(--fc-radius,1rem)"
            style={{
              transform: hinge.backFaceTransform,
              background:
                `linear-gradient(${hinge.gradientDirection}, var(--fc-back-face, color-mix(in srgb, var(--color-foreground) 6%, var(--color-card))), transparent 50%)`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Dialog container: springs from card position to content-measured overlay */}
      <motion.div
        data-fc-dialog=""
        className={cn(
          'fixed z-50 overflow-hidden rounded-(--fc-radius,1rem) border border-border/40 bg-card shadow-2xl dark:border-white/6',
          dialogClassName,
        )}
        initial={{
          left: cardRect.left,
          top: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
        }}
        animate={{
          left: finalLeft,
          top: finalTop,
          width: finalWidth,
          height: finalHeight,
        }}
        exit={{
          left: cardRect.left,
          top: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
        }}
        transition={springTransition}
        onAnimationComplete={() => {
          if (!isPresentRef.current) safeToRemove?.()
        }}
      >
        {/* Content: staggers in after container settles, fades out as a whole on exit */}
        <motion.div
          className="h-full overflow-auto"
          variants={detailContentVariants}
          initial="hidden"
          animate={detailControls}
          exit={{ opacity: 0, transition: { duration: exitDuration } }}
        >
          {renderDetail(onClose)}
        </motion.div>
      </motion.div>
    </Fragment>
  )
}
