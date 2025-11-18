'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'

export const Page8TableTTests = () => {
  const { accessibility } = useAnova()
  const [means, setMeans] = useState([45, 50, 55])
  const [pooledSE] = useState(2)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Calculate t-statistics
  const comparisons = [
    { pair: '1 vs 2', mean1: means[0], mean2: means[1] },
    { pair: '1 vs 3', mean1: means[0], mean2: means[2] },
    { pair: '2 vs 3', mean1: means[1], mean2: means[2] },
  ].map((comp) => {
    const tStat = (comp.mean1 - comp.mean2) / pooledSE
    const pValue = 2 * (1 - tCDF(Math.abs(tStat), 27)) // df = 30 - 3
    return { ...comp, tStat, pValue, significant: pValue < 0.05 }
  })

  // Simple approximation of t CDF
  function tCDF(t: number, df: number): number {
    if (t >= 0) return 0.5 + 0.5 * Math.tanh(t / Math.sqrt(df + 1))
    return 0.5 - 0.5 * Math.tanh(-t / Math.sqrt(df + 1))
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Table 7.1: Pairwise t-tests</h1>
        <p className="text-muted-foreground font-serif mb-8">Three independent t-tests</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-4">
              <h2 className="font-serif font-bold text-burgundy">Group Means</h2>
              {means.map((mean, idx) => (
                <InteractiveSlider
                  key={idx}
                  label={`Group ${idx + 1} Mean (μ${idx + 1})`}
                  min={30}
                  max={70}
                  step={1}
                  value={mean}
                  onChange={(val) => {
                    const newMeans = [...means]
                    newMeans[idx] = val
                    setMeans(newMeans)
                  }}
                  displayFormat={(v) => v.toFixed(0)}
                />
              ))}
            </Card>
          </AnimatedContainer>

          {/* Results table */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Test Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-serif border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="p-2 text-left text-burgundy font-bold">Comparison</th>
                      <th className="p-2 text-center text-burgundy font-bold">t-stat</th>
                      <th className="p-2 text-center text-burgundy font-bold">p-value</th>
                      <th className="p-2 text-center text-burgundy font-bold">Sig?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((comp, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-border ${
                          comp.significant ? 'bg-gold bg-opacity-20' : 'hover:bg-cream'
                        }`}
                      >
                        <td className="p-2 text-foreground font-serif">{comp.pair}</td>
                        <td className="p-2 text-center font-mono">{comp.tStat.toFixed(3)}</td>
                        <td className="p-2 text-center font-mono">{comp.pValue.toFixed(4)}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              comp.significant
                                ? 'bg-burgundy text-white'
                                : 'bg-border text-foreground'
                            }`}
                          >
                            {comp.significant ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-red-100 rounded border border-red-600">
                <p className="font-serif text-xs text-red-700">
                  <strong>⚠️ Multiple Testing Problem:</strong> At least one false positive likely when {comparisons.filter((c) => c.significant).length > 0} tests significant
                </p>
              </div>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Summary */}
        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Issue with Multiple Tests</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            Each t-test controls Type I error at α = 0.05, but running three independent tests inflates the family-wise error rate to approximately 14.3%.
            This is why we need ANOVA to test all differences simultaneously.
          </p>
        </Card>
      </div>
    </div>
  )
}
