'use client'

import React, { useEffect } from 'react'

interface MathDisplayProps {
  formula: string
  display?: boolean
  className?: string
}

export const MathDisplay = ({ formula, display = false, className = '' }: MathDisplayProps) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      const mathJax = (window as any).MathJax
      if (mathJax.typesetPromise) {
        mathJax.typesetPromise().catch((err: any) => console.log(err))
      } else if (mathJax.typeset) {
        mathJax.typeset()
      }
    }
  }, [formula])

  const wrapper = display ? '$$' : '$'

  return (
    <span className={`font-serif ${className}`}>
      {wrapper}
      {formula}
      {wrapper}
    </span>
  )
}
