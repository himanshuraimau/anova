'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Page7MultipleTestingProblem = () => {
  const { accessibility } = useAnova()
  const [numGroups, setNumGroups] = useState(4)
  const [alpha, setAlpha] = useState(0.05)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const comparisons = (numGroups * (numGroups - 1)) / 2
  const familyWiseError = 1 - Math.pow(1 - alpha, comparisons)

  // Generate curve data for family-wise error
  const curveData = []
  for (let k = 2; k <= 10; k++) {
    const c = (k * (k - 1)) / 2
    const fwe = 1 - Math.pow(1 - alpha, c)
    curveData.push({ k, fwe: parseFloat((fwe * 100).toFixed(1)), comparisons: c })
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Multiple Testing Problem</h1>
        <p className="text-muted-foreground font-serif mb-8">Family-wise error rate inflation</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-6">
              <div>
                <InteractiveSlider
                  label="Number of Groups (k)"
                  min={2}
                  max={10}
                  step={1}
                  value={numGroups}
                  onChange={setNumGroups}
                />
              </div>

              <div>
                <InteractiveSlider
                  label="Significance Level (α)"
                  min={0.01}
                  max={0.1}
                  step={0.01}
                  value={alpha}
                  onChange={setAlpha}
                  displayFormat={(v) => v.toFixed(3)}
                />
              </div>

              <div className="p-4 bg-gold bg-opacity-20 rounded border border-gold">
                <p className="font-serif text-sm text-muted-foreground mb-2">Per-Test Error Rate:</p>
                <p className="font-serif font-bold text-burgundy text-lg">α = {alpha.toFixed(3)}</p>
                <p className="font-serif text-xs text-muted-foreground mt-2">For each individual t-test</p>
              </div>

              <div className="p-4 bg-burgundy bg-opacity-10 rounded border-2 border-burgundy">
                <p className="font-serif text-sm text-muted-foreground mb-2">Pairwise Comparisons:</p>
                <p className="font-serif font-bold text-burgundy text-lg">C(k,2) = {comparisons}</p>
                <p className="font-serif text-xs text-muted-foreground mt-2">Formula: k(k-1)/2</p>
              </div>

              <div className="p-4 bg-red-100 rounded border-2 border-red-600">
                <p className="font-serif text-sm text-muted-foreground mb-2">Family-Wise Error Rate:</p>
                <p className="font-serif font-bold text-red-700 text-lg">{(familyWiseError * 100).toFixed(1)}%</p>
                <p className="font-serif text-xs text-muted-foreground mt-2">Probability of at least one false positive</p>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="text-lg font-serif font-bold text-burgundy mb-4">Error Rate by Number of Groups</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={curveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="k" stroke="#292524" label={{ value: 'Number of Groups (k)', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#292524" label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(v) => `${v.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }}
                  />
                  <Line type="monotone" dataKey="fwe" stroke="#991b1b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Explanation */}
        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">The Mathematics</h3>
          <div className="space-y-3">
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              When tests are independent, the probability that ALL tests are correct is:
            </p>
            <div className="bg-cream p-3 rounded border border-border text-center font-serif font-mono text-burgundy">
              P(all correct) = (1 - α)^m = (1 - {alpha.toFixed(3)})^{comparisons} = {Math.pow(1 - alpha, comparisons).toFixed(4)}
            </div>
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              The family-wise error rate (probability of at least one error) is:
            </p>
            <div className="bg-cream p-3 rounded border border-border text-center font-serif font-mono text-burgundy">
              P(at least one error) = 1 - (1 - α)^m = {familyWiseError.toFixed(4)} = {(familyWiseError * 100).toFixed(1)}%
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
