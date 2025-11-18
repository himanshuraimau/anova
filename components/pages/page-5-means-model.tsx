'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { MathDisplay } from '@/components/math-display'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export const Page5MeansModel = () => {
  const { accessibility } = useAnova()
  const [mu, setMu] = useState(50)
  const [sigma, setSigma] = useState(5)
  const [showErrors, setShowErrors] = useState(true)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Generate normal distribution data
  const generateNormalData = (mean: number, stdDev: number) => {
    const data = []
    for (let x = mean - 4 * stdDev; x <= mean + 4 * stdDev; x += 0.5) {
      const z = (x - mean) / stdDev
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-(z * z) / 2)
      data.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(4)) })
    }
    return data
  }

  const normalData = generateNormalData(mu, sigma)

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">The Means Model</h1>
        <p className="text-muted-foreground font-serif mb-8">Foundation of ANOVA</p>

        {/* Formula */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <div className="text-center mb-4">
              <p className="font-serif font-semibold text-muted-foreground mb-2">Basic Model:</p>
              <div className="text-xl md:text-2xl font-serif text-burgundy">
                <MathDisplay formula="Y_{{ij}} = \mu + \varepsilon_{{ij}}" display={true} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">Y_{'{ij}'}</p>
                <p className="font-serif text-sm text-burgundy font-bold">Observation</p>
              </div>
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">μ</p>
                <p className="font-serif text-sm text-burgundy font-bold">Population Mean</p>
              </div>
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">ε_{'{ij}'}</p>
                <p className="font-serif text-sm text-burgundy font-bold">Error Term</p>
              </div>
            </div>
          </Card>
        </AnimatedContainer>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft" delay={0.2}>
            <Card className="border-2 border-primary p-6 bg-background space-y-6">
              <div>
                <InteractiveSlider
                  label="Population Mean (μ)"
                  min={30}
                  max={70}
                  step={0.5}
                  value={mu}
                  onChange={setMu}
                  displayFormat={(v) => v.toFixed(1)}
                />
              </div>

              <div>
                <InteractiveSlider
                  label="Standard Deviation (σ)"
                  min={1}
                  max={15}
                  step={0.5}
                  value={sigma}
                  onChange={setSigma}
                  displayFormat={(v) => v.toFixed(1)}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showErrors} onChange={(e) => setShowErrors(e.target.checked)} className="w-4 h-4" />
                <span className="font-serif text-foreground">Show error terms</span>
              </label>

              <div className="p-3 bg-gold bg-opacity-20 rounded border border-gold">
                <p className="font-serif text-sm text-muted-foreground">Interpretation:</p>
                <p className={`font-serif text-burgundy font-bold ${textSizeClass}`}>Each observation = mean + random error</p>
              </div>
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.4}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="text-lg font-serif font-bold text-burgundy mb-4">Normal Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={normalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="x" stroke="#292524" />
                  <YAxis stroke="#292524" />
                  <Tooltip formatter={(v) => v.toFixed(4)} contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                  <ReferenceLine x={mu} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: `μ=${mu}`, position: 'top', fill: '#991b1b' }} />
                  <Line type="monotone" dataKey="y" stroke="#991b1b" dot={false} isAnimationActive={true} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Key insights */}
        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Key Insight</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            In the means model, we assume all observations come from the same normal distribution with mean μ. The differences between observations are explained by random error (ε_{'{ij}'}).
          </p>
        </Card>
      </div>
    </div>
  )
}
