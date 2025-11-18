'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'

export const Page15Figure72 = () => {
  const { accessibility } = useAnova()
  const [mu1, setMu1] = useState(48)
  const [mu2, setMu2] = useState(50)
  const [mu3, setMu3] = useState(52)
  const [sigma, setSigma] = useState(5)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Generate normal distributions
  const generateCurve = (mean: number, stdDev: number) => {
    const data = []
    for (let x = 20; x <= 80; x += 0.5) {
      const z = (x - mean) / stdDev
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-(z * z) / 2)
      data.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(4)) })
    }
    return data
  }

  const data1 = generateCurve(mu1, sigma)
  const data2 = generateCurve(mu2, sigma)
  const data3 = generateCurve(mu3, sigma)

  const mergedData = data1.map((point, idx) => ({
    x: point.x,
    group1: data1[idx]?.y || 0,
    group2: data2[idx]?.y || 0,
    group3: data3[idx]?.y || 0,
  }))

  const maxDiff = Math.abs(mu3 - mu1)
  const overlapPercent = Math.min(100, 100 - (maxDiff / (4 * sigma)) * 100)

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Figure 7.2: Equal Means</h1>
        <p className="text-muted-foreground font-serif mb-8">Overlapping group distributions</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-4">
              <h2 className="font-serif font-bold text-burgundy">Group Means</h2>

              <InteractiveSlider
                label="Group 1 Mean (μ₁)"
                min={20}
                max={80}
                step={1}
                value={mu1}
                onChange={setMu1}
              />

              <InteractiveSlider
                label="Group 2 Mean (μ₂)"
                min={20}
                max={80}
                step={1}
                value={mu2}
                onChange={setMu2}
              />

              <InteractiveSlider
                label="Group 3 Mean (μ₃)"
                min={20}
                max={80}
                step={1}
                value={mu3}
                onChange={setMu3}
              />

              <InteractiveSlider
                label="Common SD (σ)"
                min={1}
                max={15}
                step={0.5}
                value={sigma}
                onChange={setSigma}
                displayFormat={(v) => v.toFixed(1)}
              />

              <div className="space-y-2 p-4 bg-gold bg-opacity-20 rounded border border-gold">
                <div>
                  <p className="font-serif text-xs text-muted-foreground">Max Difference:</p>
                  <p className="font-serif font-bold text-burgundy">{maxDiff.toFixed(1)}</p>
                </div>
                <div>
                  <p className="font-serif text-xs text-muted-foreground">Overlap:</p>
                  <p className="font-serif font-bold text-burgundy">{overlapPercent.toFixed(0)}%</p>
                </div>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Distribution Overlap</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mergedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="x" stroke="#292524" />
                  <YAxis stroke="#292524" />
                  <Tooltip
                    formatter={(v) => v.toFixed(4)}
                    contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }}
                  />
                  <Legend />
                  <ReferenceLine x={mu1} stroke="#999" strokeDasharray="5 5" />
                  <ReferenceLine x={mu2} stroke="#999" strokeDasharray="5 5" />
                  <ReferenceLine x={mu3} stroke="#999" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="group1" name="Group 1" stroke="#d4623a" dot={false} isAnimationActive={true} />
                  <Line type="monotone" dataKey="group2" name="Group 2" stroke="#991b1b" dot={false} isAnimationActive={true} />
                  <Line type="monotone" dataKey="group3" name="Group 3" stroke="#654321" dot={false} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Interpretation</h3>
          <p className={`font-serif text-foreground mb-3 ${textSizeClass}`}>
            When group distributions are <strong>highly overlapping</strong> (small differences relative to within-group variation), ANOVA will not detect significant differences.
          </p>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            In this scenario, you would <strong>fail to reject the null hypothesis</strong> and conclude that there is insufficient evidence that group means differ.
          </p>
        </Card>
      </div>
    </div>
  )
}
