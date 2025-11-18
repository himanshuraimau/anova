'use client'

import React, { useEffect, useState } from 'react'
import { useAnova } from '@/lib/anova-context'

export const Page1TitlePage = () => {
  const { animationControls, accessibility } = useAnova()
  const [showQuote, setShowQuote] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState('')
  
  const fisher_quote = '"To call in the statistician after the experiment is done may be no more than asking him to perform a post-mortem examination." — Ronald Fisher'

  useEffect(() => {
    if (animationControls.skipAnimations) {
      setShowQuote(true)
      setDisplayedQuote(fisher_quote)
      return
    }

    if (!animationControls.isPlaying) return

    const delay = 1000 / animationControls.speed
    const timer = setTimeout(() => setShowQuote(true), delay)

    return () => clearTimeout(timer)
  }, [animationControls.isPlaying, animationControls.speed, animationControls.skipAnimations])

  // Typewriter effect for quote
  useEffect(() => {
    if (!showQuote) return

    let index = 0
    const interval = setInterval(() => {
      setDisplayedQuote(fisher_quote.slice(0, index))
      index++
      if (index > fisher_quote.length) clearInterval(interval)
    }, 30 / animationControls.speed)

    return () => clearInterval(interval)
  }, [showQuote, animationControls.speed])

  const reduceMotionClass = accessibility.reduceMotion ? 'reduce-motion' : ''
  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cream px-4">
      {/* Title */}
      <h1 className={`text-6xl md:text-7xl font-serif font-bold text-burgundy mb-12 animate-fadeInUp ${reduceMotionClass}`}>
        Analysis of Variance
      </h1>

      {/* Subtitle */}
      {showQuote && (
        <blockquote
          className={`text-center max-w-2xl mb-20 italic text-lg md:text-xl text-dark-brown animate-fadeIn ${reduceMotionClass} ${textSizeClass}`}
        >
          {displayedQuote}
          {displayedQuote.length < fisher_quote.length && <span className="animate-glow">|</span>}
        </blockquote>
      )}

      {/* Floating math symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['μ', 'σ', 'Σ'].map((symbol, idx) => (
          <div
            key={idx}
            className={`absolute text-4xl text-gold opacity-30 animate-glow ${reduceMotionClass}`}
            style={{
              left: `${20 + idx * 30}%`,
              top: `${30 + Math.sin(idx) * 20}%`,
              animation: `drift 6s ease-in-out infinite`,
              animationDelay: `${idx * 0.5}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      {showQuote && (
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-glow ${reduceMotionClass}`}>
          <div className="text-center text-sm text-muted-foreground font-serif">Click anywhere to continue</div>
          <div className="mt-2 text-burgundy text-2xl">↓</div>
        </div>
      )}
    </div>
  )
}
