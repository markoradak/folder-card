'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
}

interface FolderCardItemProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function FolderCardItem({ children, className, style }: FolderCardItemProps) {
  return (
    <motion.div variants={itemVariants} className={className} style={style}>
      {children}
    </motion.div>
  )
}
