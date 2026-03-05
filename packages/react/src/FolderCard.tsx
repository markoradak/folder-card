'use client'

import { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFolderCard } from './FolderCardGroup'
import { buildPanelMask } from './mask'
import { getHingeConfig, resolveHingeSide, getNotchPositionClasses } from './hinge'
import { DEFAULT_PERSPECTIVE } from './constants'
import type { FolderCardProps } from './types'

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function FolderCard({
  id,
  renderLid,
  renderDetail,
  renderTab,
  className,
  style,
  perspective = DEFAULT_PERSPECTIVE,
  hingeSide = 'auto',
  notchPosition = 'top-right',
  notchOuterRadius,
  notchInnerRadius,
  liveRadius = false,
}: FolderCardProps) {
  const { selectedId, exitingId, open, config } = useFolderCard()
  const isSelected = selectedId === id
  const isHidden = isSelected || exitingId === id
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLDivElement>(null)
  const radiusSentinelRef = useRef<HTMLDivElement>(null)
  const settlingRef = useRef(false)

  const [cardSize, setCardSize] = useState({ width: 0, height: 0 })
  const [tabSize, setTabSize] = useState({ width: 0, height: 0 })
  const [cardRadius, setCardRadius] = useState(16)

  const resolvedSide = resolveHingeSide(hingeSide, cardSize.width, cardSize.height)
  const hinge = getHingeConfig(resolvedSide)

  // Measure card and tab dimensions, keep current on resize
  useLayoutEffect(() => {
    const lidEl = lidRef.current
    const tabEl = tabRef.current
    const sentinelEl = radiusSentinelRef.current
    if (!lidEl) return

    const measureSizes = () => {
      const lidRect = lidEl.getBoundingClientRect()
      setCardSize({ width: lidRect.width, height: lidRect.height })

      if (tabEl) {
        const tabRect = tabEl.getBoundingClientRect()
        setTabSize({ width: tabRect.width, height: tabRect.height })
      }
    }

    // Synchronous initial measurement before first paint
    measureSizes()
    if (sentinelEl) {
      setCardRadius(sentinelEl.getBoundingClientRect().width)
    }

    // Observe ongoing changes (resize, CSS variable updates via sentinel when liveRadius is on)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === sentinelEl) {
          setCardRadius(entry.contentRect.width)
        } else {
          measureSizes()
        }
      }
    })
    ro.observe(lidEl)
    if (tabEl) ro.observe(tabEl)
    if (liveRadius && sentinelEl) ro.observe(sentinelEl)

    return () => ro.disconnect()
  }, [renderTab, liveRadius])

  // Generate mask dynamically from measured values
  const panelMask = useMemo(() => {
    if (!renderTab || cardSize.width === 0 || tabSize.width === 0) return null
    return buildPanelMask({
      cardWidth: cardSize.width,
      cardHeight: cardSize.height,
      tabWidth: tabSize.width,
      tabHeight: tabSize.height,
      notchPosition,
      concaveRadius: notchOuterRadius ?? cardRadius,
      invertedRadius: notchInnerRadius ?? Math.round(cardRadius * 0.7),
    })
  }, [renderTab, cardSize.width, cardSize.height, tabSize.width, tabSize.height, notchPosition, notchOuterRadius, notchInnerRadius, cardRadius])

  const { stiffness, damping } = config.springConfig
  const angleBase = useMotionValue(hinge.restAngle)
  const angle = useSpring(angleBase, { stiffness, damping })

  // Hover lift -- driven by framer-motion so it coordinates with the FLIP spring
  const hoverYBase = useMotionValue(0)
  const hoverY = useSpring(hoverYBase, { stiffness: 400, damping: 28 })

  // Sync rest angle when auto-resolution changes the hinge side
  useEffect(() => {
    angleBase.set(hinge.restAngle)
  }, [resolvedSide, angleBase, hinge.restAngle])

  // Suppress hover effects during open/close so the hover lift
  // doesn't offset the card while the expanded FLIP is still springing.
  useEffect(() => {
    if (isSelected) {
      settlingRef.current = true
      hoverYBase.set(0)
      angleBase.set(hinge.restAngle)
    } else if (settlingRef.current) {
      const t = setTimeout(() => { settlingRef.current = false }, 500)
      return () => clearTimeout(t)
    }
  }, [isSelected, hoverYBase, angleBase, hinge.restAngle])

  return (
    <div
      ref={wrapperRef}
      data-fc-card-wrapper=""
      style={{
        opacity: isHidden ? 0 : 1,
        // Fade out when opening; appear instantly when exit animation completes
        transition: isHidden ? 'opacity 0.15s ease-out' : 'none',
        pointerEvents: isHidden ? 'none' : 'auto',
        ...style,
      }}
    >
      <motion.button
        type="button"
        data-fc-card=""
        style={{ y: hoverY }}
        onMouseEnter={() => {
          if (settlingRef.current) return
          angleBase.set(hinge.hoverAngle)
          hoverYBase.set(-4)
        }}
        onMouseLeave={() => {
          if (settlingRef.current) return
          angleBase.set(hinge.restAngle)
          hoverYBase.set(0)
        }}
        onClick={() => {
          hoverYBase.jump(0)
          const rect = wrapperRef.current?.getBoundingClientRect()
          if (rect) open(id, rect, angle.get(), renderLid, renderDetail, renderTab, panelMask, resolvedSide, notchPosition)
        }}
        className={cn(
          'group relative flex w-full cursor-pointer flex-col rounded-(--fc-radius,1rem) text-left',
          'border border-border/40 dark:border-white/6',
          'shadow-(--fc-shadow-sm)',
          'outline-none focus-visible:ring-2 focus-visible:ring-(--fc-focus-ring,rgba(0,0,0,0.2)) focus-visible:ring-offset-2 focus-visible:ring-offset-card',
          className,
        )}
        whileHover={{
          boxShadow: 'var(--fc-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sentinel: tracks --fc-radius changes so ResizeObserver re-reads border-radius */}
        <div
          ref={radiusSentinelRef}
          aria-hidden
          style={{ position: 'absolute', top: 0, left: 0, width: 'var(--fc-radius, 1rem)', height: 'var(--fc-radius, 1rem)', visibility: 'hidden', pointerEvents: 'none' }}
        />

        {/* 3D lid -- perspective is element-local via transformTemplate to match
            FolderCardExpanded and avoid drift during the FLIP animation */}
        <motion.div
          ref={lidRef}
          className="relative transform-3d"
          transformTemplate={(_, generated) => `perspective(${perspective}px) ${generated}`}
          style={{ transformOrigin: hinge.transformOrigin, [hinge.axis]: angle }}
        >
            {/* L-shape tinted overlay with mask (only when renderTab provides a tab) */}
            {panelMask && (
              <div
                className="pointer-events-none absolute inset-0 rounded-(--fc-radius,1rem)"
                style={{
                  backgroundColor: 'var(--fc-lid, color-mix(in srgb, var(--color-foreground) 6%, var(--color-card)))',
                  border: '1px solid var(--fc-lid-border, transparent)',
                  maskImage: panelMask,
                  maskSize: '100% 100%',
                  maskRepeat: 'no-repeat',
                  WebkitMaskImage: panelMask,
                  WebkitMaskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            )}

            {/* Full-rectangle tint when no tab is provided */}
            {!renderTab && (
              <div
                className="pointer-events-none absolute inset-0 rounded-(--fc-radius,1rem)"
                style={{
                  backgroundColor: 'var(--fc-lid, color-mix(in srgb, var(--color-foreground) 6%, var(--color-card)))',
                  border: '1px solid var(--fc-lid-border, transparent)',
                }}
              />
            )}

            {/* Tab content -- positioned according to notchPosition */}
            {renderTab && (
              <div ref={tabRef} className={cn('pointer-events-none', getNotchPositionClasses(notchPosition))}>
                {renderTab()}
              </div>
            )}

            {/* Lid content (consumer-provided) */}
            <div className="relative z-10 backface-hidden">
              {renderLid()}
            </div>

            {/* Back face -- gradient visible behind the tilted lid */}
            <div
              className="absolute inset-0 rounded-(--fc-radius,1rem) backface-hidden"
              style={{
                transform: hinge.backFaceTransform,
                background:
                  `var(--fc-lid-back, linear-gradient(${hinge.gradientDirection}, color-mix(in srgb, var(--color-foreground, #0a0a0a) 6%, var(--color-card, #fff)), transparent 50%))`,
              }}
            />
        </motion.div>
      </motion.button>
    </div>
  )
}
