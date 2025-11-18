'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'

export const Page9ProbabilityCalculations = () => {
  const { accessibility } = useAnova()
  const [alpha, setAlpha] = useState(0.05)
  const [numComparisons, setNumComparisons] = useState(3)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const probAllCorrect = Math.pow(1 - alpha, numComparisons)
  const probAtLeastOneError = 1 - probAllCorrect

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Probability Calculations</h1>
        <p className="text-muted-foreground font-serif mb-8">Understanding the error inflation</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-6">
              <div>
                <InteractiveSlider
                  label="Per-Test α (significance level)"
                  min={0.01}
                  max={0.1}
                  step={0.01}
                  value={alpha}
                  onChange={setAlpha}
                  displayFormat={(v) => v.toFixed(3)}
                />
              </div>

              <div>
                <InteractiveSlider
                  label="Number of Comparisons (m)"
                  min={1}
                  max={15}
                  step={1}
                  value={numComparisons}
                  onChange={setNumComparisons}
                />
              </div>

              <div className="space-y-3 p-4 bg-cream rounded border-2 border-border">
                <div>
                  <p className="font-serif text-xs text-muted-foreground">P(one test correct):</p>
                  <p className="font-serif font-bold text-burgundy text-lg">1 - α = {(1 - alpha).toFixed(4)}</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="font-serif text-xs text-muted-foreground">P(all {numComparisons} tests correct):</p>
                  <p className="font-serif font-bold text-burgundy text-lg">(1 - α)^m = {probAllCorrect.toFixed(4)}</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="font-serif text-xs text-muted-foreground">P(at least one error):</p>
                  <p className="font-serif font-bold text-red-700 text-lg">{(probAtLeastOneError * 100).toFixed(2)}%</p>
                </div>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <div className="space-y-4">
              {/* Bar showing error rate */}
              <Card className="border-2 border-accent p-6 bg-background">
                <h2 className="font-serif font-bold text-burgundy mb-4">Error Rate Visualization</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-border rounded-full h-8 overflow-hidden">
                      <div className="h-full bg-green-500 flex items-center justify-center text-xs font-bold text-white font-serif" style={{ width: `${probAllCorrect * 100}%` }}>
                        {(probAllCorrect * 100).toFixed(1)}%
                      </div>
                      {probAtLeastOneError > 0 && (
                        <div className="inline-block h-full bg-red-500 text-xs font-bold text-white font-serif" style={{ width: `${probAtLeastOneError * 100}%` }}>
                          {(probAtLeastOneError * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-serif text-muted-foreground">
                    <span className="text-green-600 font-bold">Green:</span> All tests correct {' '}
                    <span className="text-red-600 font-bold">Red:</span> At least one error
                  </p>
                </div>
              </Card>

              {/* Interpretation */}
              <Card className="border-2 border-gold p-4 bg-background">
                <h3 className="font-serif font-bold text-burgundy mb-2">Interpretation</h3>
                <p className={`font-serif text-foreground ${textSizeClass}`}>
                  With {numComparisons} independent tests at α = {alpha.toFixed(3)}, there's a {(probAtLeastOneError * 100).toFixed(1)}% chance of at least one false positive.
                </p>
              </Card>
            </div>
          </AnimatedContainer>
        </div>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Bonferroni Correction</h3>
          <p className={`font-serif text-foreground mb-3 ${textSizeClass}`}>
            To maintain family-wise error rate at α, use adjusted significance level:
          </p>
          <div className="bg-cream p-3 rounded border border-border text-center font-serif font-mono text-burgundy mb-3">
            α<sub>adjusted</sub> = α / m = {alpha.toFixed(3)} / {numComparisons} = {(alpha / numComparisons).toFixed(5)}
          </div>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            But this is overly conservative. ANOVA provides a more powerful solution by testing all differences simultaneously.
          </p>
        </Card>
      </div>
    </div>
  )
}
