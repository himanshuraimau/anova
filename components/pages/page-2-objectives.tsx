'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

const LEARNING_OBJECTIVES = [
  'Understand the purpose and application of Analysis of Variance (ANOVA)',
  'Learn why ANOVA is superior to multiple t-tests',
  'Master the mathematical foundations and notation of ANOVA',
  'Interpret ANOVA results and make data-driven decisions',
  'Apply ANOVA to real-world experimental design problems',
]

export const Page2LearningObjectives = () => {
  const { accessibility } = useAnova()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const reduceMotionClass = accessibility.reduceMotion ? 'reduce-motion' : ''

  return (
    <div className="min-h-screen bg-cream px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-burgundy mb-2 text-center">
          Learning Objectives
        </h1>
        <p className="text-center text-muted-foreground mb-12 font-serif">
          By the end of this presentation, you will be able to:
        </p>

        <div className="space-y-4">
          {LEARNING_OBJECTIVES.map((objective, idx) => (
            <Card
              key={idx}
              className={`border-2 border-primary bg-background p-6 cursor-pointer hover:shadow-lg transition-all duration-300 ${
                reduceMotionClass
              } animate-slideInLeft`}
              style={{
                animationDelay: `${idx * 0.1}s`,
              }}
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold ${textSizeClass}`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-serif font-bold text-burgundy ${textSizeClass}`}>{objective}</h3>
                  {expandedIndex === idx && (
                    <div className={`mt-4 text-foreground font-serif animate-fadeIn ${reduceMotionClass}`}>
                      <p>This objective will be explored through interactive visualizations and real-world examples throughout the presentation.</p>
                    </div>
                  )}
                </div>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-primary transition-transform ${expandedIndex === idx ? 'rotate-180' : ''}`}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Progress dots */}
        <div className="mt-12 flex justify-center gap-2">
          {LEARNING_OBJECTIVES.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx <= 1 ? 'bg-accent w-4' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
