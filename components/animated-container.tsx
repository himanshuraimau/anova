'use client'

import React from 'react'
import { useAnova } from '@/lib/anova-context'

interface AnimatedContainerProps {
  children: React.ReactNode
  animation?: 'fadeInUp' | 'slideInLeft' | 'fadeIn'
  delay?: number
  className?: string
}

export const AnimatedContainer = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = '',
}: AnimatedContainerProps) => {
  const { accessibility, animationControls } = useAnova()

  const reduceMotionClass = accessibility.reduceMotion ? 'reduce-motion' : ''
  const skipClass = animationControls.skipAnimations ? 'reduce-motion' : ''

  return (
    <div
      className={`animate-${animation} ${reduceMotionClass} ${skipClass} ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
