'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts'

export const Page12Assumptions = () => {
  const { accessibility } = useAnova()
  const [n, setN] = useState(30)
  const [skewness, setSkewness] = useState(0)
  const [variance1, setVariance1] = useState(1)
  const [variance2, setVariance2] = useState(1.5)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Generate normal data
  const generateData = (n: number, mean: number, sd: number, skew: number) => {
    const data = []
    for (let i = 0; i < n; i++) {
      let z = Math.random() + Math.random() + Math.random() - 1.5
      z = z + skew * (z * z - 1) / 6
      data.push(mean + sd * z)
    }
    return data
  }

  const data1 = generateData(n, 50, Math.sqrt(variance1), skewness)
  const data2 = generateData(n, 55, Math.sqrt(variance2), skewness)

  const histogramData1 = Array.from({ length: 10 }, (_, i) => {
    const binStart = 30 + i * 5
    return { bin: `${binStart}`, count: data1.filter((v) => v >= binStart && v < binStart + 5).length }
  })

  const histogramData2 = Array.from({ length: 10 }, (_, i) => {
    const binStart = 30 + i * 5
    return { bin: `${binStart}`, count: data2.filter((v) => v >= binStart && v < binStart + 5).length }
  })

  const scatterData1 = data1.map((v, idx) => ({ x: idx, y: v, group: 1 }))
  const scatterData2 = data2.map((v, idx) => ({ x: idx + n + 5, y: v, group: 2 }))

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">ANOVA Assumptions</h1>
        <p className="text-muted-foreground font-serif mb-8">Checking assumptions and robustness</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft">
            <Card className="border-2 border-primary p-6 bg-background space-y-4">
              <h2 className="font-serif font-bold text-burgundy">Data Parameters</h2>

              <InteractiveSlider
                label="Sample Size (n) per group"
                min={10}
                max={100}
                step={5}
                value={n}
                onChange={setN}
              />

              <InteractiveSlider
                label="Skewness"
                min={0}
                max={2}
                step={0.1}
                value={skewness}
                onChange={setSkewness}
                displayFormat={(v) => v.toFixed(1)}
              />

              <InteractiveSlider
                label="Group 1 Variance"
                min={0.5}
                max={3}
                step={0.1}
                value={variance1}
                onChange={setVariance1}
                displayFormat={(v) => v.toFixed(1)}
              />

              <InteractiveSlider
                label="Group 2 Variance"
                min={0.5}
                max={3}
                step={0.1}
                value={variance2}
                onChange={setVariance2}
                displayFormat={(v) => v.toFixed(1)}
              />

              <div className="p-3 bg-gold bg-opacity-20 rounded border border-gold mt-4">
                <p className="font-serif text-xs text-muted-foreground mb-1">Variance Ratio:</p>
                <p className="font-serif font-bold text-burgundy">{(Math.max(variance1, variance2) / Math.min(variance1, variance2)).toFixed(2)}:1</p>
                <p className="font-serif text-xs text-muted-foreground mt-1">ANOVA robust up to ~3:1</p>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualizations */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Tabs defaultValue="histogram" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="histogram">Histogram</TabsTrigger>
                <TabsTrigger value="scatter">Scatter</TabsTrigger>
              </TabsList>

              <TabsContent value="histogram">
                <Card className="border-2 border-accent p-4 bg-background">
                  <h3 className="font-serif font-bold text-burgundy mb-3 text-sm">Distribution by Group</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={histogramData1.map((h, idx) => ({ ...h, count2: histogramData2[idx].count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                      <XAxis dataKey="bin" stroke="#292524" />
                      <YAxis stroke="#292524" />
                      <Tooltip contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                      <Bar dataKey="count" fill="#991b1b" />
                      <Bar dataKey="count2" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="scatter">
                <Card className="border-2 border-accent p-4 bg-background">
                  <h3 className="font-serif font-bold text-burgundy mb-3 text-sm">Individual Values</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                      <XAxis dataKey="x" type="number" stroke="#292524" />
                      <YAxis type="number" stroke="#292524" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                      <Scatter data={scatterData1} fill="#991b1b" />
                      <Scatter data={scatterData2} fill="#f59e0b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedContainer>
        </div>

        {/* Key insights */}
        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">ANOVA Robustness</h3>
          <p className={`font-serif text-foreground mb-4 ${textSizeClass}`}>
            ANOVA is surprisingly robust to violations of its assumptions, especially with:
          </p>
          <ul className={`font-serif text-foreground space-y-2 ${textSizeClass}`}>
            <li>✓ Large sample sizes (n &gt; 30 per group)</li>
            <li>✓ Moderate deviations from normality</li>
            <li>✓ Variance ratios up to ~3:1</li>
            <li>⚠️ More sensitive to unequal sample sizes when variances differ</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
