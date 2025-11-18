'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

export const Page17SumOfSquares = () => {
  const { accessibility } = useAnova()
  const [showDeviations, setShowDeviations] = useState(true)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Sample data
  const data = [
    { group: 1, values: [42, 45, 48, 46, 43] },
    { group: 2, values: [48, 51, 52, 50, 49] },
    { group: 3, values: [55, 58, 60, 56, 59] },
  ]

  const allValues = data.flatMap((d) => d.values)
  const overallMean = allValues.reduce((a, b) => a + b, 0) / allValues.length

  // Calculate SST
  const SST = allValues.reduce((sum, val) => sum + Math.pow(val - overallMean, 2), 0)

  // Calculate group means and SSB, SSW
  const groupStats = data.map((d) => {
    const mean = d.values.reduce((a, b) => a + b, 0) / d.values.length
    const n = d.values.length
    const SSB_contrib = n * Math.pow(mean - overallMean, 2)
    const SSW_contrib = d.values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0)
    return { group: d.group, mean, n, SSB_contrib, SSW_contrib }
  })

  const SSB = groupStats.reduce((sum, s) => sum + s.SSB_contrib, 0)
  const SSW = groupStats.reduce((sum, s) => sum + s.SSW_contrib, 0)

  // Create scatter data
  const scatterData = allValues.map((val, idx) => ({
    x: idx,
    y: val,
  }))

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Sum of Squares Total (SST)</h1>
        <p className="text-muted-foreground font-serif mb-8">Partitioning total variation</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Formula and controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-4">
              <div>
                <h2 className="font-serif font-bold text-burgundy mb-3">Formula</h2>
                <div className="bg-cream p-4 rounded border border-primary text-center font-serif font-mono text-burgundy mb-4">
                  SST = Σ Σ (Y<sub>ij</sub> - ȳ..)²
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showDeviations} onChange={(e) => setShowDeviations(e.target.checked)} className="w-4 h-4" />
                <span className="font-serif text-foreground">Show deviation lines</span>
              </label>

              <div className="space-y-3 p-4 bg-gold bg-opacity-20 rounded border border-gold">
                <div>
                  <p className="font-serif text-sm text-muted-foreground">Overall Mean (ȳ..):</p>
                  <p className="font-serif font-bold text-burgundy text-lg">{overallMean.toFixed(2)}</p>
                </div>
                <div className="border-t border-gold pt-3">
                  <p className="font-serif text-sm text-muted-foreground">Total Sum of Squares:</p>
                  <p className="font-serif font-bold text-burgundy text-lg">SST = {SST.toFixed(1)}</p>
                </div>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Deviation Visualization</h2>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis type="number" dataKey="x" stroke="#292524" />
                  <YAxis type="number" stroke="#292524" />
                  {showDeviations && <ReferenceLine y={overallMean} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: `ȳ..=${overallMean.toFixed(1)}`, position: 'right', fill: '#991b1b' }} />}
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }}
                    formatter={(v) => v.toFixed(2)}
                  />
                  <Scatter data={scatterData} fill="#991b1b" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Partitioning */}
        <Card className="border-2 border-gold p-6 bg-background mb-8">
          <h2 className="font-serif font-bold text-burgundy mb-4">Partitioning SST</h2>
          <div className="bg-cream p-4 rounded border border-border text-center font-serif font-mono text-burgundy mb-4">
            SST = SSB + SSW
          </div>
          <p className={`font-serif text-foreground mb-3 ${textSizeClass}`}>
            The total variation can be split into two components:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-background border-2 border-burgundy rounded">
              <p className="font-serif font-semibold text-burgundy mb-2">SSB: Between-Group Sum of Squares</p>
              <p className="font-serif font-mono text-sm text-burgundy mb-2">SSB = {SSB.toFixed(1)}</p>
              <p className={`font-serif text-foreground text-sm ${textSizeClass}`}>Variation due to differences between group means</p>
            </div>
            <div className="p-4 bg-background border-2 border-accent rounded">
              <p className="font-serif font-semibold text-accent mb-2">SSW: Within-Group Sum of Squares</p>
              <p className="font-serif font-mono text-sm text-accent mb-2">SSW = {SSW.toFixed(1)}</p>
              <p className={`font-serif text-foreground text-sm ${textSizeClass}`}>Variation within each group</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gold bg-opacity-20 rounded border border-gold">
            <p className="font-serif font-mono text-burgundy text-center">
              {SST.toFixed(1)} = {SSB.toFixed(1)} + {SSW.toFixed(1)}
            </p>
            <p className="font-serif text-xs text-center text-muted-foreground mt-2">Total = Between + Within</p>
          </div>
        </Card>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Next: F-Test</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            The ANOVA F-statistic compares the mean squares: F = MSB / MSW = (SSB/dfB) / (SSW/dfW). A large F indicates that between-group variation is large relative to within-group variation.
          </p>
        </Card>
      </div>
    </div>
  )
}
