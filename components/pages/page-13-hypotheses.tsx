'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'

export const Page13ANOVAHypotheses = () => {
  const { accessibility } = useAnova()
  const [k, setK] = useState(3)
  const [showAltHyp, setShowAltHyp] = useState(false)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const means = Array.from({ length: k }, (_, i) => 45 + i * 5)

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">ANOVA Hypotheses</h1>
        <p className="text-muted-foreground font-serif mb-8">Null and alternative hypotheses</p>

        <div className="mb-8">
          <InteractiveSlider
            label="Number of Groups (k)"
            min={2}
            max={6}
            step={1}
            value={k}
            onChange={setK}
          />
        </div>

        {/* Null Hypothesis */}
        <AnimatedContainer animation="slideInLeft" className="mb-8">
          <Card className="border-2 border-primary p-8 bg-background">
            <h2 className="text-2xl font-serif font-bold text-burgundy mb-4">Null Hypothesis (H₀)</h2>
            <div className="bg-cream p-6 rounded border-2 border-primary mb-4">
              <p className="font-serif text-center text-lg mb-3">All group means are equal:</p>
              <div className="text-center text-xl md:text-2xl font-serif font-bold text-burgundy">
                μ<sub>1</sub> = μ<sub>2</sub> = ⋯ = μ<sub>{k}</sub>
              </div>
            </div>

            <div className="p-4 bg-gold bg-opacity-10 rounded border border-gold">
              <p className={`font-serif text-foreground ${textSizeClass}`}>
                Interpretation: There is <strong>no significant difference</strong> in mean outcomes between the {k} groups. Any observed differences are due to random sampling variation.
              </p>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Alternative Hypothesis */}
        <AnimatedContainer animation="slideInLeft" delay={0.2} className="mb-8">
          <Card className="border-2 border-accent p-8 bg-background">
            <h2 className="text-2xl font-serif font-bold text-burgundy mb-4">Alternative Hypothesis (Hₐ)</h2>
            <div className="bg-cream p-6 rounded border-2 border-accent mb-4">
              <p className="font-serif text-center text-lg mb-3">At least one group mean differs:</p>
              <div className="text-center text-lg md:text-xl font-serif font-bold text-burgundy">
                Not all μ<sub>i</sub> are equal
              </div>
            </div>

            <div className="p-4 bg-burgundy bg-opacity-10 rounded border border-burgundy">
              <p className={`font-serif text-foreground ${textSizeClass}`}>
                Interpretation: There <strong>is a significant difference</strong> in mean outcomes between groups. At least one group differs meaningfully from the others.
              </p>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Equivalence */}
        <AnimatedContainer animation="fadeInUp" delay={0.4} className="mb-8">
          <Card className="border-2 border-gold p-6 bg-background">
            <h2 className="text-lg font-serif font-bold text-burgundy mb-4">Equivalent Formulation Using Treatment Effects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground mb-2">H₀:</p>
                <div className="text-center font-serif font-bold text-burgundy">
                  τ<sub>1</sub> = τ<sub>2</sub> = ⋯ = τ<sub>{k}</sub> = 0
                </div>
              </div>
              <div className="p-4 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground mb-2">Hₐ:</p>
                <div className="text-center font-serif font-bold text-burgundy">
                  Not all τ<sub>i</sub> = 0
                </div>
              </div>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Visual representation */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedContainer animation="fadeIn" delay={0.5}>
            <Card className="border-2 border-primary p-6 bg-background">
              <h3 className="font-serif font-bold text-burgundy mb-4">H₀: Equal Means</h3>
              <div className="space-y-2 h-32 flex flex-col justify-end">
                {means.map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-serif text-sm text-muted-foreground">Group {idx + 1}:</span>
                    <div className="w-full h-6 bg-primary rounded flex items-center justify-center">
                      <div className="h-3 w-3 bg-primary-foreground rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-serif text-xs text-center text-muted-foreground mt-4">All at same level</p>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeIn" delay={0.6}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h3 className="font-serif font-bold text-burgundy mb-4">Hₐ: Different Means</h3>
              <div className="space-y-2 h-32 flex flex-col justify-end">
                {means.map((mean, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-serif text-sm text-muted-foreground">Group {idx + 1}:</span>
                    <div
                      className="h-6 bg-accent rounded flex items-center justify-center"
                      style={{ width: `${30 + idx * 15}%` }}
                    >
                      <div className="h-3 w-3 bg-accent-foreground rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-serif text-xs text-center text-muted-foreground mt-4">At different levels</p>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  )
}
