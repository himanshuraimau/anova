'use client'

import React from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'

export const Page9ProbabilityCalculations = () => {
  const { accessibility } = useAnova()

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const alpha = 0.05
  const numComparisons = 3
  const probA = 1 - alpha // P(A) = 0.95
  const probB = 1 - alpha // P(B) = 0.95
  const probC = 1 - alpha // P(C) = 0.95
  const probAllCorrect = probA * probB * probC // P(A ∩ B ∩ C) = 0.8573
  const probAtLeastOneError = 1 - probAllCorrect // 1 - 0.8573 = 0.1426

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-primary mb-2">Probability Calculations</h1>
        <p className="text-muted-foreground font-serif mb-8">Understanding the error inflation</p>

        {/* Main Content */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <div className={`space-y-6 font-serif text-foreground ${textSizeClass}`}>
              <div>
                <p className="mb-4">Let</p>
                <div className="space-y-2 ml-4">
                  <p>P(A) = P (Retain H₀ in test A | H₀ in test A is true)</p>
                  <p>P(B) = P (Retain H₀ in test B | H₀ in test B is true)</p>
                  <p>P(C) = P (Retain H₀ in test C | H₀ in test C is true)</p>
                </div>
                <p className="mt-4">Note that values of P(A) = P(B) = P(C) = 1 – α = 1 – 0.05 = 0.95.</p>
              </div>

              <div className="bg-accent/10 p-4 rounded border-2 border-accent">
                <p className="mb-3">The conditional probability of simultaneously retaining all three null hypotheses when they are true is:</p>
                <div className="text-center my-4 py-3">
                  <div className="text-xl font-serif font-mono text-primary">
                    P(A ∩ B ∩ C) = 0.95 × 0.95 × 0.95 = 0.8573
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3">Now, consider the following null hypothesis:</p>
                <div className="text-center my-4">
                  <div className="text-xl font-serif font-mono text-primary">
                    H₀: μ₀ = μ₁₀ = μ₂₀ &nbsp;&nbsp;&nbsp;&nbsp; (7.3)
                  </div>
                </div>
                <p className="mt-4">
                  If we retain the null hypothesis based on the three individual t-tests, then the significance or Type I error is not equal to the α-value, but much higher than α (Lunney, 1969; Siegel, 1990). For the case discussed above, if we retain the null hypothesis based on three individual tests, then the Type I error is:
                </p>
                <div className="text-center my-4 bg-red-50 p-4 rounded border-2 border-red-300">
                  <div className="text-xl font-serif font-mono text-red-700 font-bold">
                    1 - 0.8573 = 0.1426
                  </div>
                  <p className="mt-2 text-red-700 font-bold">That is, 14.26% instead of 5%!</p>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded border-2 border-primary">
                <p className="mb-3">
                  That is, when more than two groups are involved, checking the population parameter values simultaneously using t-tests is inappropriate since the Type I error will be estimated incorrectly. For <strong>n</strong> simultaneous comparisons, the probability of Type I error is:
                </p>
                <div className="text-center my-4 py-3">
                  <div className="text-xl font-serif font-mono text-primary">
                    1 - (1 - α)<sup>n</sup>
                  </div>
                </div>
                <p className="mt-4">
                  For five simultaneous comparisons, the Type I error will be approximately <strong>0.22</strong> (Kao and Green, 2008). For this reason, we use ANOVA whenever we need to compare three or more groups for population parameter values simultaneously.
                </p>
              </div>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Summary Box */}
        <AnimatedContainer animation="fadeIn" delay={0.2}>
          <Card className="border-2 border-accent p-6 bg-background">
            <h3 className="text-lg font-serif font-bold text-primary mb-4">Key Formula</h3>
            <div className="space-y-3">
              <div className="bg-background p-4 rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground mb-2">For n simultaneous comparisons:</p>
                <div className="text-center py-2">
                  <div className="text-lg font-serif font-mono text-primary">
                    Type I Error = 1 - (1 - α)<sup>n</sup>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-accent/10 p-3 rounded text-center">
                  <p className="text-xs text-muted-foreground">n = 3</p>
                  <p className="font-bold text-primary">14.26%</p>
                </div>
                <div className="bg-accent/10 p-3 rounded text-center">
                  <p className="text-xs text-muted-foreground">n = 5</p>
                  <p className="font-bold text-primary">~22%</p>
                </div>
                <div className="bg-accent/10 p-3 rounded text-center">
                  <p className="text-xs text-muted-foreground">α = 0.05</p>
                  <p className="font-bold text-primary">Per test</p>
                </div>
              </div>
            </div>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  )
}
