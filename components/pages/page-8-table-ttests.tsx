'use client'

import React from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'

export const Page8TableTTests = () => {
  const { accessibility } = useAnova()

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-primary mb-2">Table 7.1 | Three different two-sample t-tests</h1>
        <p className="text-muted-foreground font-serif mb-8">Pairwise comparisons for multiple groups</p>

        {/* Table 7.1 */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <div className="overflow-x-auto">
              <table className="w-full font-serif border-collapse border-2 border-primary">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="p-4 text-left font-bold border-2 border-primary">Test</th>
                    <th className="p-4 text-left font-bold border-2 border-primary">Null Hypothesis</th>
                    <th className="p-4 text-left font-bold border-2 border-primary">Alternative Hypothesis</th>
                    <th className="p-4 text-center font-bold border-2 border-primary">Significance (α)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-2 border-primary hover:bg-accent/10">
                    <td className="p-4 border-2 border-primary font-bold text-primary text-center">A</td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      H₀: μ₀ = μ₁₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      Hₐ: μ₀ ≠ μ₁₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      α = 0.05
                    </td>
                  </tr>
                  <tr className="border-2 border-primary hover:bg-accent/10">
                    <td className="p-4 border-2 border-primary font-bold text-primary text-center">B</td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      H₀: μ₀ = μ₂₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      Hₐ: μ₀ ≠ μ₂₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      α = 0.05
                    </td>
                  </tr>
                  <tr className="border-2 border-primary hover:bg-accent/10">
                    <td className="p-4 border-2 border-primary font-bold text-primary text-center">C</td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      H₀: μ₁₀ = μ₂₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      Hₐ: μ₁₀ ≠ μ₂₀
                    </td>
                    <td className="p-4 border-2 border-primary text-center font-serif">
                      α = 0.05
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Explanation */}
        <AnimatedContainer animation="fadeIn" delay={0.2}>
          <Card className="border-2 border-accent p-6 bg-background">
            <div className={`space-y-4 font-serif text-foreground ${textSizeClass}`}>
              <p>
                The Type I error will be estimated incorrectly if we conduct the three different tests listed above. For example, assume that the mean sale (population mean) at 0%, 10% and 20% discount is μ₀, μ₁₀ and μ₂₀ respectively. Consider three two-sample t-tests shown in Table 7.1.
              </p>
            </div>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  )
}
