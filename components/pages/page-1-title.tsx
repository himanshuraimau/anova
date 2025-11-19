'use client'

import React, { useEffect, useState } from 'react'
import { useAnova } from '@/lib/anova-context'

export const Page1TitlePage = () => {
  const { animationControls, accessibility } = useAnova()
  const [showQuote, setShowQuote] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState('')
  const [showPresenters, setShowPresenters] = useState(false)
  
  const anova_quote = '"Analysis of variance is not a mathematical theorem, but rather a convenient method of arranging the arithmetic." — Ronald Fisher'
  
  const presenters = [
    { name: 'Himanshu', id: '1SI23AD016' },
    { name: 'Suraj', id: '1SI23AD057' },
    { name: 'Jishnu', id: '1SI23CI017' },
    { name: 'Kumarswami', id: '1SI23CI019' },
  ]

  useEffect(() => {
    if (animationControls.skipAnimations) {
      setShowQuote(true)
      setDisplayedQuote(anova_quote)
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
      setDisplayedQuote(anova_quote.slice(0, index))
      index++
      if (index > anova_quote.length) {
        clearInterval(interval)
        // Show presenters after quote is complete
        setTimeout(() => {
          setShowPresenters(true)
        }, 500 / animationControls.speed)
      }
    }, 30 / animationControls.speed)

    return () => clearInterval(interval)
  }, [showQuote, animationControls.speed])

  // Show presenters immediately if animations are skipped
  useEffect(() => {
    if (animationControls.skipAnimations && showQuote && displayedQuote === anova_quote) {
      setShowPresenters(true)
    }
  }, [animationControls.skipAnimations, showQuote, displayedQuote])

  const reduceMotionClass = accessibility.reduceMotion ? 'reduce-motion' : ''
  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 py-8">
      {/* Title */}
      <h1 className={`text-6xl md:text-7xl font-serif font-bold text-burgundy mb-12 animate-fadeInUp ${reduceMotionClass}`}>
        Analysis of Variance
      </h1>

      {/* Subtitle */}
      {showQuote && (
        <blockquote
          className={`text-center max-w-2xl mb-12 italic text-lg md:text-xl text-dark-brown animate-fadeIn ${reduceMotionClass} ${textSizeClass}`}
        >
          {displayedQuote}
          {displayedQuote.length < anova_quote.length && <span className="animate-glow">|</span>}
        </blockquote>
      )}

      {/* Presented By Section */}
      {showPresenters && (
        <div className={`mt-8 w-full max-w-3xl animate-fadeInUp ${reduceMotionClass}`}>
          <div className="text-center mb-8">
            <p className="text-xl md:text-2xl font-serif text-gold font-semibold tracking-wide mb-2">
              Presented by
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {presenters.map((presenter, idx) => (
              <div
                key={idx}
                className="group relative"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 shadow-lg border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-burgundy mb-2 group-hover:text-gold transition-colors duration-300">
                      {presenter.name}
                    </h3>
                    <p className="text-sm md:text-base text-dark-brown/70 font-mono tracking-wider">
                      {presenter.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating math symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['μ', 'σ', 'Σ', 'α', 'β', 'χ²', 'F', '∑', 'x̄'].map((symbol, idx) => {
          // Use deterministic positioning based on index to avoid hydration mismatch
          const positions = [
            { left: 15, top: 20, rotation: -5 },
            { left: 75, top: 15, rotation: 8 },
            { left: 25, top: 70, rotation: -3 },
            { left: 85, top: 60, rotation: 6 },
            { left: 10, top: 45, rotation: -7 },
            { left: 60, top: 25, rotation: 4 },
            { left: 40, top: 80, rotation: -2 },
            { left: 70, top: 45, rotation: 5 },
            { left: 30, top: 35, rotation: -4 }
          ]
          const position = positions[idx]
          
          return (
            <div
              key={idx}
              className={`absolute text-3xl md:text-4xl text-gold opacity-20 ${reduceMotionClass}`}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                animation: `floatAround${(idx % 3) + 1} ${8 + idx * 2}s ease-in-out infinite`,
                animationDelay: `${idx * 0.7}s`,
                transform: `rotate(${position.rotation}deg)`,
              }}
            >
              {symbol}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes floatAround1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, -30px) rotate(5deg); }
          50% { transform: translate(-20px, -60px) rotate(-3deg); }
          75% { transform: translate(-40px, 20px) rotate(7deg); }
        }
        
        @keyframes floatAround2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 40px) rotate(-5deg); }
          66% { transform: translate(40px, -20px) rotate(8deg); }
        }
        
        @keyframes floatAround3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(30px, 50px) rotate(3deg); }
          40% { transform: translate(-50px, 20px) rotate(-7deg); }
          60% { transform: translate(20px, -40px) rotate(4deg); }
          80% { transform: translate(-10px, -20px) rotate(-2deg); }
        }
      `}</style>
    </div>
  )
}
