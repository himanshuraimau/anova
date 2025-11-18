'use client'

import React from 'react'
import { useAnova } from '@/lib/anova-context'
import { Page1TitlePage } from '@/components/pages/page-1-title'
import { Page2LearningObjectives } from '@/components/pages/page-2-objectives'
import { Page3ProblemStatement } from '@/components/pages/page-3-problem'
import { Page4WhyNotTTests } from '@/components/pages/page-4-why-not-ttests'
import { Page5MeansModel } from '@/components/pages/page-5-means-model'
import { Page6FactorModel } from '@/components/pages/page-6-factor-model'
import { Page7MultipleTestingProblem } from '@/components/pages/page-7-multiple-testing'
import { Page8TableTTests } from '@/components/pages/page-8-table-ttests'
import { Page9ProbabilityCalculations } from '@/components/pages/page-9-probability'
import { Page10WhyANOVA } from '@/components/pages/page-10-why-anova'
import { Page11OneWayIntro } from '@/components/pages/page-11-one-way-intro'
import { Page12Assumptions } from '@/components/pages/page-12-assumptions'
import { Page13ANOVAHypotheses } from '@/components/pages/page-13-hypotheses'
import { Page14Figure71 } from '@/components/pages/page-14-figure-7-1'
import { Page15Figure72 } from '@/components/pages/page-15-figure-7-2'
import { Page16Notation } from '@/components/pages/page-16-notation'
import { Page17SumOfSquares } from '@/components/pages/page-17-sum-squares'
import { Page18Summary } from '@/components/pages/page-18-summary'

const PAGES = [
  Page1TitlePage,
  Page2LearningObjectives,
  Page3ProblemStatement,
  Page4WhyNotTTests,
  Page5MeansModel,
  Page6FactorModel,
  Page7MultipleTestingProblem,
  Page8TableTTests,
  Page9ProbabilityCalculations,
  Page10WhyANOVA,
  Page11OneWayIntro,
  Page12Assumptions,
  Page13ANOVAHypotheses,
  Page14Figure71,
  Page15Figure72,
  Page16Notation,
  Page17SumOfSquares,
  Page18Summary,
]

export const PageRouter = () => {
  const { currentPage } = useAnova()
  const PageComponent = PAGES[currentPage - 1]

  if (!PageComponent) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-foreground font-serif text-lg">Page {currentPage} not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <PageComponent />
    </main>
  )
}
