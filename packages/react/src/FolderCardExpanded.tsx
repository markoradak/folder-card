'use client'

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, usePresence, useAnimationControls, useMotionValue } from 'framer-motion'
import { getHingeConfig } from './hinge'
import { buildMaskStyle } from './mask'
import { STAGGER_REPLAY_DELAY, TAB_RESHOW_DELAY } from './constants'
import type { HingeSide, NotchPosition } from './types'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

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

export interface FolderCardExpandedConfig {
  dialogViewportPadding: number
  contentRevealDelay: number
  openAngle?: number
  backdropDuration: number
  exitDuration: number
  fadeLid: boolean
  springConfig: { type: 'spring'; stiffness: number; damping: number; restDelta?: number; restSpeed?: number }
  backdropClassName?: string
  dialogClassName?: string
  dialogMinWidth: number
  reducedMotion: boolean
}

interface FolderCardExpandedProps {
  cardRect: DOMRect
  initialAngle: number
  perspective: number
  renderLid: () => ReactNode
  renderDetail: (close: () => void) => ReactNode
  renderTab?: () => ReactNode
  panelMask: string | null
  notchBorder: string | null
  hingeSide: HingeSide
  notchPosition: NotchPosition
  ariaLabel?: string
  onClose: () => void
  config: FolderCardExpandedConfig
}

export function FolderCardExpanded({
  cardRect,
  initialAngle,
  perspective,
  renderLid,
  renderDetail,
  renderTab,
  panelMask,
  notchBorder,
  hingeSide,
  notchPosition,
  ariaLabel,
  onClose,
  config,
}: FolderCardExpandedProps) {
  const {
    dialogViewportPadding,
    contentRevealDelay,
    openAngle,
    backdropDuration,
    exitDuration,
    fadeLid,
    springConfig,
    backdropClassName,
    dialogClassName,
    dialogMinWidth,
    reducedMotion,
  } = config

  const hinge = getHingeConfig(hingeSide)

  const finalOpenAngle = openAngle ?? hinge.openAngle

  const [isPresent, safeToRemove] = usePresence()
  const isPresentRef = useRef(true)
  isPresentRef.current = isPresent

  const lidControls = useAnimationControls()
  const detailControls = useAnimationControls()
  const measureRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null)
  const [tabHidden, setTabHidden] = useState(false)

  // Scroll compensation: a MotionValue that offsets the lid/dialog by the
  // scroll delta during the exit animation. Using a MotionValue (not state)
  // means the spring's exit targets stay stable — scroll updates bypass React
  // rendering so onAnimationComplete fires normally when the spring settles.
  const scrollInfoRef = useRef<{ target: HTMLElement; isBody: boolean; openY: number }>({
    target: document.body,
    isBody: true,
    openY: typeof window !== 'undefined' ? window.scrollY : 0,
  })
  const scrollCompensateY = useMotionValue(0)
  const exitSettledRef = useRef(false)

  // Track viewport size so the dialog repositions on resize
  const [viewport, setViewport] = useState(() =>
    typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 }
  )

  useEffect(() => {
    let rafId = 0
    function handleResize() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight })
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Reveal dialog detail content with stagger after a short delay
  useEffect(() => {
    if (reducedMotion) {
      detailControls.set('visible')
      return
    }
    const t = setTimeout(() => detailControls.start('visible'), contentRevealDelay)
    return () => clearTimeout(t)
  }, [contentRevealDelay, detailControls, reducedMotion])

  // Play stagger on open
  useEffect(() => {
    if (reducedMotion) {
      lidControls.set('visible')
    } else {
      lidControls.start('visible')
    }
  }, [lidControls, reducedMotion])

  // Fade out tab content on open immediately
  useEffect(() => {
    setTabHidden(true)
  }, [])

  // Reset and re-play stagger on close (once lid swings back past -90deg)
  useEffect(() => {
    if (!isPresent) {
      if (reducedMotion) {
        lidControls.set('visible')
      } else {
        lidControls.set('hidden')
        const t = setTimeout(() => lidControls.start('visible'), STAGGER_REPLAY_DELAY)
        return () => clearTimeout(t)
      }
    }
  }, [isPresent, lidControls, reducedMotion])

  // Fade tab content back in on close (with delay so lid settles first)
  useEffect(() => {
    if (!isPresent) {
      const t = setTimeout(() => setTabHidden(false), TAB_RESHOW_DELAY)
      return () => clearTimeout(t)
    }
  }, [isPresent])

  // Lock scroll on the nearest scrollable ancestor (not the body -- the page
  // may use an inner scroll container like <main class="overflow-y-auto">).
  // Compensate for scrollbar width to prevent layout shift.
  // Unlock immediately when close is triggered (isPresent becomes false) so
  // the page is scrollable during the exit animation.
  const scrollLockRef = useRef<{ target: HTMLElement; prevOverflow: string; prevPaddingRight: string } | null>(null)

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

    const isBody = target === document.body
    scrollInfoRef.current = { target, isBody, openY: isBody ? window.scrollY : target.scrollTop }
    scrollLockRef.current = { target, prevOverflow, prevPaddingRight }

    return () => {
      target.style.overflow = prevOverflow
      target.style.paddingRight = prevPaddingRight
      scrollLockRef.current = null
    }
  }, [])

  // Release scroll lock as soon as close is triggered, don't wait for unmount
  useEffect(() => {
    if (!isPresent && scrollLockRef.current) {
      const { target, prevOverflow, prevPaddingRight } = scrollLockRef.current
      target.style.overflow = prevOverflow
      target.style.paddingRight = prevPaddingRight
      scrollLockRef.current = null
    }
  }, [isPresent])

  // Compensate for scroll during exit. Updates a MotionValue (not React state)
  // so the spring exit targets stay stable and onAnimationComplete fires when
  // the spring settles. Once settled, exitSettledRef stops further updates.
  useEffect(() => {
    if (isPresent) return
    const { target, isBody, openY } = scrollInfoRef.current
    const scrollElement = isBody ? window : target

    let rafId = 0
    function handleScroll() {
      if (exitSettledRef.current) return
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (exitSettledRef.current) return
        const currentY = isBody ? window.scrollY : target.scrollTop
        scrollCompensateY.set(-(currentY - openY))
      })
    }

    handleScroll()
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [isPresent, scrollCompensateY])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !e.defaultPrevented) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Focus trap: move focus into the dialog and cycle Tab within it.
  // Restores focus to the previously-focused element on unmount.
  useEffect(() => {
    const dialogEl = dialogRef.current
    if (!dialogEl) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogEl.focus({ preventScroll: true })

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      const focusable = dialogEl!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === dialogEl) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last || document.activeElement === dialogEl) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [])

  // Mark the measurement container as inert (React 18+ compatible)
  useLayoutEffect(() => {
    measureRef.current?.setAttribute('inert', '')
  }, [])

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
    const maxW = viewport.width - pad * 2
    const maxH = viewport.height - pad * 2

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
    let minW = Math.min(dialogMinWidth, maxW)
    let minH = minW / cardAspect
    if (minH > maxH) {
      minH = maxH
      minW = minH * cardAspect
    }

    const finalWidth = Math.min(Math.max(measured.width, minW), maxW)
    const finalHeight = Math.min(Math.max(measured.height, minH), maxH)
    const finalLeft = (viewport.width - finalWidth) / 2
    const finalTop = Math.max(pad, (viewport.height - finalHeight) / 2)
    return { finalWidth, finalHeight, finalLeft, finalTop }
  }, [measured, dialogViewportPadding, dialogMinWidth, cardRect, viewport])

  const { finalWidth, finalHeight, finalLeft, finalTop } = dialogRect
  const springTransition = springConfig

  return (
    <Fragment>
      {/* Hidden measurement container -- renders content off-screen to measure natural size.
          Uses fit-content width so block/flex layouts size naturally within the max-width
          constraint rather than collapsing to minimum intrinsic width.
          Marked inert + aria-hidden so assistive technology and focus ignore it. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          visibility: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          maxWidth: `${viewport.width - dialogViewportPadding * 2}px`,
          width: 'fit-content',
          zIndex: -1,
        }}
      >
        {renderDetail(onClose)}
      </div>

      {/* Backdrop: fades in/out independently */}
      <motion.div
        data-fc-backdrop=""
        className={backdropClassName || undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: backdropDuration }}
        onClick={onClose}
      />

      {/* Front-face lid -- outer div springs position/size with the dialog; inner div rotates.
          Scroll compensation during exit is layered via the y MotionValue (translateY).
          This keeps the exit targets stable so the spring settles and onAnimationComplete fires. */}
      <motion.div
        data-fc-lid=""
        data-fc-lid-expanded=""
        style={{ y: scrollCompensateY }}
        initial={{ left: cardRect.left, top: cardRect.top, width: cardRect.width, height: cardRect.height, opacity: 1 }}
        animate={{ left: finalLeft, top: finalTop, width: finalWidth, height: finalHeight, ...(fadeLid ? { opacity: 0 } : {}) }}
        exit={{ left: cardRect.left, top: cardRect.top, width: cardRect.width, height: cardRect.height, opacity: 1 }}
        transition={{
          ...springTransition,
          ...(fadeLid ? { opacity: { duration: 0.3, ease: 'easeOut' } } : {}),
        }}
      >
        {/* Inner rotating face -- perspective is element-local via transformTemplate
            so it doesn't drift when the FLIP container changes size */}
        <motion.div
          data-fc-lid-rotator=""
          transformTemplate={(_, generated) => `perspective(${perspective}px) ${generated}`}
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
          <div data-fc-lid-back="" style={{ backfaceVisibility: 'hidden' }}>
            {/* Tinted overlay -- uses the same SVG mask as the collapsed card so the
                notch stretches smoothly and continuously during the FLIP spring. */}
            <div
              data-fc-lid-overlay=""
              style={{
                backgroundColor: 'var(--fc-lid, color-mix(in srgb, var(--fc-foreground, #0a0a0a) 6%, var(--fc-card-bg, #fff)))',
                ...(panelMask ? buildMaskStyle(panelMask) : {}),
              }}
            />

            {/* Notch inner-edge border -- stroke-only SVG mask reveals the border color
                along the curved notch boundary where the lid mask clips the regular border. */}
            {notchBorder && (
              <div
                data-fc-lid-overlay=""
                style={{
                  backgroundColor: 'var(--fc-lid-border, transparent)',
                  ...buildMaskStyle(notchBorder),
                }}
              />
            )}

            {/* Tab content on expanded lid -- fades out quickly on open, back in on close */}
            {renderTab && (
              <div
                data-fc-tab=""
                data-fc-notch-position={notchPosition}
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
              data-fc-lid-content=""
              variants={lidContentVariants}
              initial="hidden"
              animate={lidControls}
            >
              {renderLid()}
            </motion.div>
          </div>

          {/* Back face -- gradient visible behind the lid */}
          <div
            data-fc-lid-back=""
            style={{
              transform: hinge.backFaceTransform,
              background:
                `var(--fc-lid-back, linear-gradient(${hinge.gradientDirection}, color-mix(in srgb, var(--fc-foreground, #0a0a0a) 6%, var(--fc-card-bg, #fff)), transparent 50%))`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Dialog container: springs from card position to content-measured overlay */}
      <motion.div
        ref={dialogRef}
        data-fc-dialog=""
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={dialogClassName || undefined}
        style={{ y: scrollCompensateY }}
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
          if (!isPresentRef.current) {
            exitSettledRef.current = true
            safeToRemove?.()
          }
        }}
      >
        {/* Content: staggers in after container settles, fades out as a whole on exit */}
        <motion.div
          data-fc-dialog-content=""
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
