'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'

export const Page4WhyNotTTests = () => {
  const { accessibility } = useAnova()
  const [numGroups, setNumGroups] = useState(3)

  const calculateComparisons = (k: number) => (k * (k - 1)) / 2

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const comparisons = calculateComparisons(numGroups)

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Why Not Just Use t-tests?</h1>
        <p className="text-muted-foreground font-serif mb-8">The problem with multiple comparisons</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Control */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background">
              <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Number of Groups</h2>
              <InteractiveSlider
                label="k = number of groups"
                min={2}
                max={6}
                step={1}
                value={numGroups}
                onChange={setNumGroups}
              />

              <div className="mt-6 p-4 bg-gold bg-opacity-20 rounded-lg border border-gold">
                <p className="font-serif font-bold text-burgundy mb-2">Pairwise Comparisons Needed:</p>
                <p className="text-2xl font-serif font-bold text-burgundy">
                  C(k,2) = {comparisons}
                </p>
                <p className="text-sm font-serif text-muted-foreground mt-2">
                  Formula: k(k-1)/2 = {numGroups}({numGroups - 1})/2
                </p>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Comparison grid */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Problem Escalation</h2>
              <div className="space-y-3">
                {Array.from({ length: numGroups }).map((_, i) =>
                  Array.from({ length: numGroups }).map((_, j) =>
                    i < j ? (
                      <div
                        key={`${i}-${j}`}
                        className="flex items-center gap-3 p-2 bg-background border border-border rounded animate-slideInLeft"
                        style={{ animationDelay: `${(i + j) * 0.05}s` }}
                      >
                        <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-serif text-sm font-bold">
                          {i + 1}
                        </div>
                        <span className="font-serif text-foreground">vs</span>
                        <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-serif text-sm font-bold">
                          {j + 1}
                        </div>
                        <span className="text-xs font-serif text-muted-foreground ml-auto">α = 0.05</span>
                      </div>
                    ) : null
                  )
                )}
              </div>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Warning box */}
        <Card className="border-4 border-burgundy bg-burgundy bg-opacity-10 p-6 mb-8">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">⚠️ Family-Wise Error Rate Problem</h3>
          <p className={`font-serif text-foreground mb-4 ${textSizeClass}`}>
            When running multiple independent t-tests, the probability of making <strong>at least one Type I error</strong> (false positive) increases dramatically.
          </p>
          <div className="bg-background p-4 rounded border border-burgundy">
            <p className="font-serif font-mono text-sm text-burgundy">
              P(at least one error) = 1 - (1 - α)^m
            </p>
            <p className="font-serif text-sm text-muted-foreground mt-2">
              Where m = number of comparisons = {comparisons}
            </p>
            <p className="font-serif font-bold text-burgundy mt-3">
              True error rate ≈ {(1 - Math.pow(1 - 0.05, comparisons)).toFixed(4)} ({((1 - Math.pow(1 - 0.05, comparisons)) * 100).toFixed(1)}%)
            </p>
          </div>
        </Card>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-2">Solution: ANOVA</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            ANOVA controls the family-wise error rate by testing all group differences simultaneously with a single test.
          </p>
        </Card>
      </div>
    </div>
  )
}
