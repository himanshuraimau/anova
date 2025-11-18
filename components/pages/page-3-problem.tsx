'use client'

import React, { useState, useEffect } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { InteractiveSlider } from '@/components/interactive-slider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const Page3ProblemStatement = () => {
  const { accessibility, animationControls } = useAnova()
  const [discounts, setDiscounts] = useState([0, 10, 20])
  const [sales, setSales] = useState([100, 140, 180])

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const reduceMotionClass = accessibility.reduceMotion ? 'reduce-motion' : ''

  const chartData = discounts.map((disc, idx) => ({
    discount: `${disc}%`,
    sales: sales[idx],
  }))

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">Problem Statement: Retail Discounts</h1>
        <p className="text-muted-foreground font-serif mb-8">Does discount level significantly affect sales?</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Interactive controls */}
          <AnimatedContainer animation="slideInLeft" className="space-y-6">
            <Card className="border-2 border-primary p-6 bg-background">
              <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Interactive Controls</h2>

              <div className="space-y-6">
                {discounts.map((discount, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="font-serif font-semibold text-foreground">Group {idx + 1}: Discount</label>
                    <InteractiveSlider
                      label={`Discount ${idx + 1}: ${discount}%`}
                      min={0}
                      max={50}
                      step={1}
                      value={discount}
                      onChange={(val) => {
                        const newDiscounts = [...discounts]
                        newDiscounts[idx] = val
                        setDiscounts(newDiscounts)
                      }}
                      displayFormat={(v) => `${v}%`}
                    />

                    <InteractiveSlider
                      label={`Sales ${idx + 1}:`}
                      min={50}
                      max={250}
                      step={5}
                      value={sales[idx]}
                      onChange={(val) => {
                        const newSales = [...sales]
                        newSales[idx] = val
                        setSales(newSales)
                      }}
                      displayFormat={(v) => `$${v.toFixed(0)}`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedContainer>

          {/* Chart */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="text-xl font-serif font-bold text-burgundy mb-4">Sales by Discount Level</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d2b48c" />
                  <XAxis dataKey="discount" stroke="#292524" />
                  <YAxis stroke="#292524" />
                  <Tooltip formatter={(value) => `$${value}`} contentStyle={{ backgroundColor: '#fffbeb', border: '2px solid #991b1b' }} />
                  <Bar dataKey="sales" fill="#991b1b" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Key question */}
        <Card className="border-2 border-gold p-6 bg-background mb-8">
          <h3 className="text-lg font-serif font-bold text-burgundy mb-2">Key Question</h3>
          <p className={`font-serif text-foreground ${textSizeClass}`}>
            Are the differences in sales between discount levels <strong>statistically significant</strong>, or could they be due to random variation?
          </p>
        </Card>
      </div>
    </div>
  )
}
