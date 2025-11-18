'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

export const Page6FactorModel = () => {
  const { accessibility } = useAnova()
  const [mu, setMu] = useState(50)
  const [tau, setTau] = useState([0, 5, 10])

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const groupMeans = tau.map((t) => mu + t)

  const chartData = tau.map((t, idx) => ({
    group: `Group ${idx + 1}`,
    mean: parseFloat((mu + t).toFixed(1)),
    tau: t,
  }))

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Factor Effect Model</h1>
        <p className="text-muted-foreground font-serif mb-8">Introducing treatment effects</p>

        {/* Formula */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <div className="text-center mb-4">
              <p className="font-serif font-semibold text-muted-foreground mb-2">Factor Effect Model:</p>
              <div className="text-2xl md:text-3xl font-serif text-burgundy font-bold">
                Y<sub>ij</sub> = μ + τ<sub>i</sub> + ε<sub>ij</sub>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-3 mt-6">
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">Y<sub>ij</sub></p>
                <p className="font-serif text-xs text-burgundy font-bold">Observation</p>
              </div>
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">μ</p>
                <p className="font-serif text-xs text-burgundy font-bold">Grand Mean</p>
              </div>
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">τ<sub>i</sub></p>
                <p className="font-serif text-xs text-burgundy font-bold">Treatment Effect</p>
              </div>
              <div className="text-center p-3 bg-cream rounded border border-border">
                <p className="font-serif text-sm text-muted-foreground">ε<sub>ij</sub></p>
                <p className="font-serif text-xs text-burgundy font-bold">Error Term</p>
              </div>
            </div>
          </Card>
        </AnimatedContainer>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <AnimatedContainer animation="slideInLeft" delay={0.2}>
            <Card className="border-2 border-primary p-6 bg-background space-y-4">
              <div>
                <InteractiveSlider
                  label="Grand Mean (μ)"
                  min={30}
                  max={70}
                  step={0.5}
                  value={mu}
                  onChange={setMu}
                  displayFormat={(v) => v.toFixed(1)}
                />
              </div>

              {tau.map((t, idx) => (
                <div key={idx}>
                  <InteractiveSlider
                    label={`Treatment Effect τ${idx + 1}`}
                    min={-15}
                    max={15}
                    step={0.5}
                    value={t}
                    onChange={(val) => {
                      const newTau = [...tau]
                      newTau[idx] = val
                      setTau(newTau)
                    }}
                    displayFormat={(v) => v.toFixed(1)}
                  />
                  <p className="text-xs font-serif text-muted-foreground mt-1">
                    Group {idx + 1} mean: μ + τ = {(mu + t).toFixed(1)}
                  </p>
                </div>
              ))}
            </Card>
          </AnimatedContainer>

          {/* Visualization */}
          <AnimatedContainer animation="fadeIn" delay={0.4}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="text-lg font-serif font-bold text-burgundy mb-4">Group Means</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="group" stroke="#292524" />
                  <YAxis stroke="#292524" />
                  <Tooltip formatter={(v) => v.toFixed(1)} contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                  <ReferenceLine y={mu} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: `μ=${mu}`, position: 'top', fill: '#991b1b' }} />
                  <Bar dataKey="mean" fill="#991b1b" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Interpretation */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-2 border-gold p-4 bg-background">
            <h3 className="font-serif font-bold text-burgundy mb-2">Null Hypothesis (H₀)</h3>
            <p className={`font-serif text-foreground ${textSizeClass}`}>
              All treatment effects are zero: τ<sub>1</sub> = τ<sub>2</sub> = τ<sub>3</sub> = 0
            </p>
            <p className="font-serif text-xs text-muted-foreground mt-2">Groups have same mean</p>
          </Card>

          <Card className="border-2 border-gold p-4 bg-background">
            <h3 className="font-serif font-bold text-burgundy mb-2">Alternative Hypothesis (Hₐ)</h3>
            <p className={`font-serif text-foreground ${textSizeClass}`}>At least one treatment effect is non-zero</p>
            <p className="font-serif text-xs text-muted-foreground mt-2">Groups have different means</p>
          </Card>
        </div>

        <Card className="border-2 border-gold p-6 bg-background">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-3">Key Difference from Means Model</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            The factor effect model allows different groups to have different means. The treatment effect (τ<sub>i</sub>) captures how much group i differs from the grand mean.
          </p>
        </Card>
      </div>
    </div>
  )
}
