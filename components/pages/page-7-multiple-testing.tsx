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
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-primary mb-2">7.2 | Multiple t-Tests for Comparing Several Means</h1>
        <p className="text-muted-foreground font-serif mb-8">Family-wise error rate inflation</p>

        {/* Main Content */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <div className={`space-y-4 font-serif text-foreground ${textSizeClass}`}>
              <p>
                Continuing with the example from Section 7.1, if we had only two values for 'price discount', then we could have used the two-sample t-test to check whether there is a statistically significant relationship between price discount and average sales quantity. When we have more than two levels of discounts, one option is to compare the population parameters two at a time (two discount values). For example, we can compare each of the following three cases using a two-sample t-test:
              </p>
              
              <ol className="list-decimal ml-6 space-y-2">
                <li>Test between 0% and 10%</li>
                <li>Test between 0% and 20%</li>
                <li>Test between 10% and 20%</li>
              </ol>

              <p>
                The Type I error will be estimated incorrectly if we conduct the three different tests listed above. For example, assume that the mean sale (population mean) at 0%, 10% and 20% discount is μ₀, μ₁₀ and μ₂₀ respectively. Consider three two-sample t-tests shown in Table 7.1.
              </p>
            </div>
          </Card>
        </AnimatedContainer>

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

              <div className="p-4 bg-accent bg-opacity-20 rounded border border-accent">
                <p className="font-serif text-sm text-muted-foreground mb-2">Per-Test Error Rate:</p>
                <p className="font-serif font-bold text-primary text-lg">α = {alpha.toFixed(3)}</p>
                <p className="font-serif text-xs text-muted-foreground mt-2">For each individual t-test</p>
              </div>

              <div className="p-4 bg-primary bg-opacity-10 rounded border-2 border-primary">
                <p className="font-serif text-sm text-muted-foreground mb-2">Pairwise Comparisons:</p>
                <p className="font-serif font-bold text-primary text-lg">C(k,2) = {comparisons}</p>
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
              <h2 className="text-lg font-serif font-bold text-primary mb-4">Error Rate by Number of Groups</h2>
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
        <Card className="border-2 border-accent p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-primary mb-3">The Mathematics</h3>
          <div className="space-y-3">
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              When tests are independent, the probability that ALL tests are correct is:
            </p>
            <div className="bg-background p-4 rounded border border-border text-center py-4 my-4">
              <div className="text-lg font-serif font-mono text-primary">
                P(all correct) = (1 - α)<sup>m</sup> = (1 - {alpha.toFixed(3)})<sup>{comparisons}</sup> = {Math.pow(1 - alpha, comparisons).toFixed(4)}
              </div>
            </div>
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              The family-wise error rate (probability of at least one error) is:
            </p>
            <div className="bg-background p-4 rounded border border-border text-center py-4 my-4">
              <div className="text-lg font-serif font-mono text-primary">
                P(at least one error) = 1 - (1 - α)<sup>m</sup> = {familyWiseError.toFixed(4)} = {(familyWiseError * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
