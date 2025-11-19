'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MathDisplayProps {
  formula: string
  display?: boolean
  className?: string
}

export const MathDisplay = ({ formula, display = false, className = '' }: MathDisplayProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const renderMath = () => {
      if (typeof window === 'undefined') return
      
      const mathJax = (window as any).MathJax
      
      if (mathJax && ref.current) {
        const wrapper = display ? '$$' : '$'
        ref.current.textContent = `${wrapper}${formula}${wrapper}`
        
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          if (mathJax.typesetPromise) {
            mathJax.typesetPromise([ref.current]).then(() => {
              setIsRendered(true)
            }).catch((err: any) => {
              console.log('MathJax error:', err)
              setIsRendered(true)
            })
          } else if (mathJax.typeset) {
            try {
              mathJax.typeset([ref.current])
              setIsRendered(true)
            } catch (err) {
              console.log('MathJax typeset error:', err)
              setIsRendered(true)
            }
          } else {
            setIsRendered(true)
          }
        })
      } else {
        // Fallback: show raw LaTeX
        const wrapper = display ? '$$' : '$'
        if (ref.current) {
          ref.current.textContent = `${wrapper}${formula}${wrapper}`
          setIsRendered(true)
        }
      }
    }

    setIsRendered(false)
    const timer = setTimeout(renderMath, 100)
    return () => clearTimeout(timer)
  }, [formula, display])

  return (
    <span 
      ref={ref} 
      className={`font-serif ${display ? 'block w-full' : 'inline'} ${className}`}
      style={{ minHeight: display ? '2em' : 'auto' }}
    />
  )
}
