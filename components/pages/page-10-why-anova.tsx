'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Page10WhyANOVA = () => {
  const { accessibility } = useAnova()
  const [alpha, setAlpha] = useState(0.05)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Generate data showing error inflation curve
  const data = []
  for (let m = 1; m <= 20; m++) {
    const bonferroni = Math.min(alpha / m, 1) // Bonferroni correction
    const anova = alpha // ANOVA maintains α
    data.push({ m, bonferroni: parseFloat((bonferroni * 100).toFixed(2)), anova: parseFloat((anova * 100).toFixed(2)) })
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Why ANOVA?</h1>
        <p className="text-muted-foreground font-serif mb-8">ANOVA maintains α across multiple comparisons</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Control */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-6">
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

              <div className="space-y-3 p-4 bg-gold bg-opacity-20 rounded border border-gold">
                <h3 className="font-serif font-bold text-burgundy">ANOVA Advantage</h3>
                <ul className={`font-serif text-foreground space-y-2 ${textSizeClass}`}>
                  <li>✓ Tests all group differences simultaneously</li>
                  <li>✓ Maintains family-wise error rate at α</li>
                  <li>✓ More powerful than Bonferroni correction</li>
                  <li>✓ Elegant mathematical framework</li>
                </ul>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Chart */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Significance Level by Comparisons</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="m" stroke="#292524" label={{ value: 'Number of Comparisons', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#292524" label={{ value: 'α (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(v) => `${v.toFixed(2)}%`} contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                  <Line type="monotone" dataKey="bonferroni" name="Bonferroni" stroke="#999" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="anova" name="ANOVA" stroke="#991b1b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Comparison table */}
        <Card className="border-2 border-gold p-6 bg-background mb-8">
          <h2 className="font-serif font-bold text-burgundy mb-4">Approaches Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-serif border-collapse">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="p-2 text-left text-burgundy font-bold">Approach</th>
                  <th className="p-2 text-center text-burgundy font-bold">Maintains α</th>
                  <th className="p-2 text-center text-burgundy font-bold">Power</th>
                  <th className="p-2 text-center text-burgundy font-bold">Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-cream">
                  <td className="p-2">Multiple t-tests</td>
                  <td className="p-2 text-center">✗ No</td>
                  <td className="p-2 text-center">High</td>
                  <td className="p-2 text-center">Low</td>
                </tr>
                <tr className="border-b border-border hover:bg-cream">
                  <td className="p-2">Bonferroni Correction</td>
                  <td className="p-2 text-center">✓ Yes</td>
                  <td className="p-2 text-center">Low</td>
                  <td className="p-2 text-center">Low</td>
                </tr>
                <tr className="bg-gold bg-opacity-20">
                  <td className="p-2 font-bold">ANOVA</td>
                  <td className="p-2 text-center font-bold">✓ Yes</td>
                  <td className="p-2 text-center font-bold">High</td>
                  <td className="p-2 text-center font-bold">Medium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Key Insight</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            ANOVA achieves the "best of both worlds": it maintains the family-wise error rate at α while preserving statistical power. It's the gold standard for comparing three or more group means.
          </p>
        </Card>
      </div>
    </div>
  )
}
