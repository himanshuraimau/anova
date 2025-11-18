'use client'

import React from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'

export const Page11OneWayIntro = () => {
  const { accessibility } = useAnova()

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const conditions = [
    {
      title: '1. Independence',
      description: 'Observations within and between groups are independent',
      icon: '🔗',
    },
    {
      title: '2. Normality',
      description: 'Within each group, data approximately follows a normal distribution',
      icon: '📊',
    },
    {
      title: '3. Homogeneity of Variance',
      description: 'All groups have approximately equal population variances (σ²)',
      icon: '⚖️',
    },
  ]

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">One-Way ANOVA</h1>
        <p className="text-muted-foreground font-serif mb-8">Requirements and assumptions</p>

        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-burgundy mb-6">Three Essential Assumptions</h2>
          <div className="grid gap-4">
            {conditions.map((condition, idx) => (
              <AnimatedContainer key={idx} animation="slideInLeft" delay={idx * 0.15}>
                <Card className="border-2 border-primary p-6 bg-background hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-3xl">{condition.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-burgundy mb-2">{condition.title}</h3>
                      <p className={`font-serif text-foreground ${textSizeClass}`}>{condition.description}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Historical context */}
        <AnimatedContainer animation="fadeInUp" delay={0.5}>
          <Card className="border-2 border-gold p-6 bg-background">
            <h2 className="text-xl font-serif font-bold text-burgundy mb-3">Historical Context: Fisher's Experiment</h2>
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              Ronald Fisher developed ANOVA in the 1920s while analyzing agricultural experiments at Rothamsted. He famously studied the effects of different fertilizers on crop yields across multiple fields. This practical problem led to the statistical framework we use today to compare means across multiple treatment groups.
            </p>
          </Card>
        </AnimatedContainer>

        {/* When to use ANOVA */}
        <div className="mt-8 p-6 bg-gold bg-opacity-20 rounded-lg border-2 border-gold">
          <h3 className="font-serif font-bold text-burgundy mb-3">When to Use One-Way ANOVA</h3>
          <ul className={`font-serif text-foreground space-y-2 ${textSizeClass}`}>
            <li>✓ Comparing means across 3+ independent groups</li>
            <li>✓ One categorical predictor (grouping variable)</li>
            <li>✓ One continuous outcome variable</li>
            <li>✓ Groups are independent (not paired)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
