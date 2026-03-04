'use client'

import {
  createContext,
  useCallback,
  useContext,
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
  DEFAULT_OPEN_ROTATE_X,
  DEFAULT_SPRING_CONFIG,
} from './constants'
import type { FolderCardGroupProps, HingeSide, NotchPosition } from './types'

interface SelectedCard {
  id: string
  rect: DOMRect
  initialAngle: number
  renderLid: () => ReactNode
  renderDetail: (close: () => void) => ReactNode
  renderTab?: () => ReactNode
  panelMask: string | null
  hingeSide: HingeSide
  notchPosition: NotchPosition
}

interface FolderCardContextValue {
  selectedId: string | null
  exitingId: string | null
  open: (
    id: string,
    rect: DOMRect,
    initialAngle: number,
    renderLid: () => ReactNode,
    renderDetail: (close: () => void) => ReactNode,
    renderTab?: () => ReactNode,
    panelMask?: string | null,
    hingeSide?: HingeSide,
    notchPosition?: NotchPosition,
  ) => void
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
  springConfig,
  backdropClassName,
  dialogClassName,
  onOpen,
  onClose: onCloseProp,
}: FolderCardGroupProps) {
  const [selected, setSelected] = useState<SelectedCard | null>(null)
  const [exitingId, setExitingId] = useState<string | null>(null)

  const config: FolderCardExpandedConfig = {
    dialogViewportPadding,
    contentRevealDelay,
    openRotateX,
    backdropDuration,
    exitDuration,
    springConfig: {
      type: 'spring',
      stiffness: springConfig?.stiffness ?? DEFAULT_SPRING_CONFIG.stiffness,
      damping: springConfig?.damping ?? DEFAULT_SPRING_CONFIG.damping,
      restDelta: 0.01,
      restSpeed: 0.5,
    },
    backdropClassName,
    dialogClassName,
  }

  const open = useCallback(
    (
      id: string,
      rect: DOMRect,
      initialAngle: number,
      renderLid: () => ReactNode,
      renderDetail: (close: () => void) => ReactNode,
      renderTab?: () => ReactNode,
      panelMask?: string | null,
      hingeSide?: HingeSide,
      notchPosition?: NotchPosition,
    ) => {
      setSelected({
        id,
        rect,
        initialAngle,
        renderLid,
        renderDetail,
        renderTab,
        panelMask: panelMask ?? null,
        hingeSide: hingeSide ?? 'bottom',
        notchPosition: notchPosition ?? 'top-right',
      })
      onOpen?.(id)
    },
    [onOpen],
  )

  const close = useCallback(() => {
    setSelected(prev => {
      if (prev) {
        setExitingId(prev.id)
        onCloseProp?.(prev.id)
      }
      return null
    })
  }, [onCloseProp])

  return (
    <FolderCardContext.Provider value={{ selectedId: selected?.id ?? null, exitingId, open, close, config }}>
      {children}
      <AnimatePresence onExitComplete={() => setExitingId(null)}>
        {selected && (
          <FolderCardExpanded
            key={selected.id}
            cardRect={selected.rect}
            initialAngle={selected.initialAngle}
            renderLid={selected.renderLid}
            renderDetail={selected.renderDetail}
            renderTab={selected.renderTab}
            panelMask={selected.panelMask}
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
