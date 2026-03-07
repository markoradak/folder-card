'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { FolderCardExpanded, type FolderCardExpandedConfig } from './FolderCardExpanded'
import {
  DEFAULT_BACKDROP_DURATION,
  DEFAULT_CONTENT_REVEAL_DELAY,
  DEFAULT_DIALOG_VIEWPORT_PADDING,
  DEFAULT_EXIT_DURATION,
  DEFAULT_FADE_LID,
  DEFAULT_OPEN_ROTATE_X,
  DEFAULT_SPRING_CONFIG,
} from './constants'
import type { FolderCardGroupProps, HingeSide, NotchPosition } from './types'

export interface OpenCardParams {
  id: string
  rect: DOMRect
  initialAngle: number
  perspective: number
  renderLid: () => ReactNode
  renderDetail: (close: () => void) => ReactNode
  renderTab?: () => ReactNode
  panelMask?: string | null
  notchBorder?: string | null
  hingeSide?: HingeSide
  notchPosition?: NotchPosition
}

interface SelectedCard {
  id: string
  rect: DOMRect
  initialAngle: number
  perspective: number
  renderLid: () => ReactNode
  renderDetail: (close: () => void) => ReactNode
  renderTab?: () => ReactNode
  panelMask: string | null
  notchBorder: string | null
  hingeSide: HingeSide
  notchPosition: NotchPosition
}

interface FolderCardContextValue {
  selectedId: string | null
  exitingId: string | null
  open: (params: OpenCardParams) => void
  close: () => void
  config: FolderCardExpandedConfig
}

const FolderCardContext = createContext<FolderCardContextValue | null>(null)

export function useFolderCard(): FolderCardContextValue {
  const ctx = useContext(FolderCardContext)
  if (!ctx) throw new Error('useFolderCard must be used within <FolderCardGroup>')
  return ctx
}

export function FolderCardGroup({
  children,
  dialogViewportPadding = DEFAULT_DIALOG_VIEWPORT_PADDING,
  contentRevealDelay = DEFAULT_CONTENT_REVEAL_DELAY,
  openRotateX = DEFAULT_OPEN_ROTATE_X,
  backdropDuration = DEFAULT_BACKDROP_DURATION,
  exitDuration = DEFAULT_EXIT_DURATION,
  fadeLid = DEFAULT_FADE_LID,
  springConfig,
  backdropClassName,
  dialogClassName,
  onOpen,
  onClose: onCloseProp,
}: FolderCardGroupProps) {
  const [selected, setSelected] = useState<SelectedCard | null>(null)
  const [exitingId, setExitingId] = useState<string | null>(null)

  const stiffness = springConfig?.stiffness ?? DEFAULT_SPRING_CONFIG.stiffness
  const damping = springConfig?.damping ?? DEFAULT_SPRING_CONFIG.damping

  const config = useMemo<FolderCardExpandedConfig>(() => ({
    dialogViewportPadding,
    contentRevealDelay,
    openRotateX,
    backdropDuration,
    exitDuration,
    fadeLid,
    springConfig: {
      type: 'spring' as const,
      stiffness,
      damping,
      restDelta: 0.01,
      restSpeed: 0.5,
    },
    backdropClassName,
    dialogClassName,
  }), [dialogViewportPadding, contentRevealDelay, openRotateX, backdropDuration, exitDuration, fadeLid, stiffness, damping, backdropClassName, dialogClassName])

  // Stable refs for callbacks so open/close identities never change
  const onOpenRef = useRef(onOpen)
  onOpenRef.current = onOpen
  const onCloseRef = useRef(onCloseProp)
  onCloseRef.current = onCloseProp

  const open = useCallback((params: OpenCardParams) => {
    setSelected({
      id: params.id,
      rect: params.rect,
      initialAngle: params.initialAngle,
      perspective: params.perspective,
      renderLid: params.renderLid,
      renderDetail: params.renderDetail,
      renderTab: params.renderTab,
      panelMask: params.panelMask ?? null,
      notchBorder: params.notchBorder ?? null,
      hingeSide: params.hingeSide ?? 'bottom',
      notchPosition: params.notchPosition ?? 'top-right',
    })
    onOpenRef.current?.(params.id)
  }, [])

  const close = useCallback(() => {
    setSelected(prev => {
      if (prev) {
        setExitingId(prev.id)
        onCloseRef.current?.(prev.id)
      }
      return null
    })
  }, [])

  // Safety: clear exitingId if exit animation doesn't complete within 2s
  useEffect(() => {
    if (!exitingId) return
    const t = setTimeout(() => setExitingId(null), 2000)
    return () => clearTimeout(t)
  }, [exitingId])

  const ctxValue = useMemo<FolderCardContextValue>(() => ({
    selectedId: selected?.id ?? null,
    exitingId,
    open,
    close,
    config,
  }), [selected?.id, exitingId, open, close, config])

  return (
    <FolderCardContext.Provider value={ctxValue}>
      {children}
      <AnimatePresence onExitComplete={() => setExitingId(null)}>
        {selected && (
          <FolderCardExpanded
            key={selected.id}
            cardRect={selected.rect}
            initialAngle={selected.initialAngle}
            perspective={selected.perspective}
            renderLid={selected.renderLid}
            renderDetail={selected.renderDetail}
            renderTab={selected.renderTab}
            panelMask={selected.panelMask}
            notchBorder={selected.notchBorder}
            hingeSide={selected.hingeSide}
            notchPosition={selected.notchPosition}
            onClose={close}
            config={config}
          />
        )}
      </AnimatePresence>
    </FolderCardContext.Provider>
  )
}
