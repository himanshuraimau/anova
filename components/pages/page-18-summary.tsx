'use client'

import React, { useState } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { Button } from '@/components/ui/button'
import { Download, RotateCcw, Loader2, FileText } from 'lucide-react'
import { PDFGenerator } from '@/lib/pdf-generator'

const PAGE_TOPICS = [
  {
    page: 1,
    title: 'Title Page',
    description: 'Introduction to ANOVA with Fisher\'s foundational quote',
  },
  {
    page: 2,
    title: 'Learning Objectives',
    description: 'Five key learning outcomes for this presentation',
  },
  {
    page: 3,
    title: 'Problem Statement',
    description: 'Real-world retail discount scenario',
  },
  {
    page: 4,
    title: 'Why Not t-tests?',
    description: 'Multiple testing problem and family-wise error rate',
  },
  {
    page: 5,
    title: 'Means Model',
    description: 'Foundation: Y_ij = μ + ε_ij',
  },
  {
    page: 6,
    title: 'Factor Effect Model',
    description: 'Extensions: Y_ij = μ + τ_i + ε_ij',
  },
  {
    page: 7,
    title: 'Multiple Testing Problem',
    description: 'Error inflation with multiple comparisons',
  },
  {
    page: 8,
    title: 'Pairwise t-tests',
    description: 'Three independent comparisons and results',
  },
  {
    page: 9,
    title: 'Probability Calculations',
    description: 'Understanding error rate mathematics',
  },
  {
    page: 10,
    title: 'Why ANOVA?',
    description: 'ANOVA as the superior solution',
  },
  {
    page: 11,
    title: 'One-Way ANOVA',
    description: 'Three essential assumptions for ANOVA',
  },
  {
    page: 12,
    title: 'ANOVA Assumptions',
    description: 'Testing and checking assumptions in practice',
  },
  {
    page: 13,
    title: 'ANOVA Hypotheses',
    description: 'Null and alternative hypotheses formulation',
  },
  {
    page: 14,
    title: 'Figure 7.1',
    description: 'Well-separated group distributions',
  },
  {
    page: 15,
    title: 'Figure 7.2',
    description: 'Overlapping group distributions',
  },
  {
    page: 16,
    title: 'ANOVA Notation',
    description: 'Data structure, notation, and calculations',
  },
]

export const Page18Summary = () => {
  const { accessibility, currentPage, setCurrentPage, resetAll } = useAnova()
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  const completionPercent = ((currentPage) / 17) * 100

  const handleTopicClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleReset = () => {
    resetAll()
  }

  const handleExportNotes = () => {
    const notes = localStorage.getItem('anova-notes') || 'No notes yet'
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(notes))
    element.setAttribute('download', 'anova-notes.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadStudyNotesPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Fetch the study notes markdown file
      const response = await fetch('/study-notes.md')
      const markdownContent = await response.text()
      
      // Generate PDF
      await PDFGenerator.generatePDF(markdownContent, {
        title: 'Analysis of Variance (ANOVA) - Complete Study Notes',
        backgroundColor: '#fffbeb',
        textColor: '#292524',
        primaryColor: '#991b1b',
        accentColor: '#f59e0b',
      })
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-primary mb-2">Summary & Review</h1>
        <p className="text-muted-foreground font-serif mb-8">Complete overview of ANOVA concepts</p>

        {/* Progress Overview */}
        <AnimatedContainer animation="fadeInUp" className="mb-8">
          <Card className="border-2 border-accent p-6 bg-background">
            <h2 className="font-serif font-bold text-primary mb-4">Your Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-serif text-foreground">{currentPage} / 17 pages completed</span>
                <span className="font-serif font-bold text-primary">{completionPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleReset} variant="outline" size="sm" className="font-serif">
                <RotateCcw size={16} className="mr-2" />
                Restart
              </Button>
              <Button onClick={handleExportNotes} variant="outline" size="sm" className="font-serif">
                <Download size={16} className="mr-2" />
                Export Notes
              </Button>
              <Button 
                onClick={handleDownloadStudyNotesPDF} 
                disabled={isGeneratingPDF}
                variant="default" 
                size="sm" 
                className="font-serif bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText size={16} className="mr-2" />
                    Download Study Notes PDF
                  </>
                )}
              </Button>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Timeline of Topics */}
        <AnimatedContainer animation="slideInLeft" delay={0.2} className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <h2 className="font-serif font-bold text-primary mb-6">Complete Topic Timeline</h2>
            <div className="space-y-2">
              {PAGE_TOPICS.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTopicClick(topic.page)}
                  className={`w-full text-left p-3 rounded transition-all font-serif border-2 ${
                    currentPage === topic.page
                      ? 'border-accent bg-accent bg-opacity-20'
                      : idx < currentPage - 1
                        ? 'border-accent bg-accent bg-opacity-10'
                        : 'border-border hover:bg-background'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentPage === topic.page
                        ? 'bg-accent text-accent-foreground'
                        : idx < currentPage - 1
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-border text-foreground'
                    }`}>
                      {topic.page}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-primary">{topic.title}</p>
                      <p className={`text-muted-foreground text-sm ${textSizeClass}`}>{topic.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </AnimatedContainer>

        {/* Key Takeaways */}
        <AnimatedContainer animation="fadeIn" delay={0.4} className="mb-8">
          <Card className="border-2 border-accent p-6 bg-background">
            <h2 className="font-serif font-bold text-primary mb-4">Key Takeaways</h2>
            <ul className={`font-serif text-foreground space-y-3 ${textSizeClass}`}>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Multiple Testing Problem:</strong> Running many t-tests inflates the family-wise error rate far above α.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>ANOVA Solution:</strong> Tests all group differences simultaneously while maintaining the error rate at α.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Model Foundation:</strong> ANOVA partitions variation into between-group (SSB) and within-group (SSW) components.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Mathematical Power:</strong> The F-ratio (MSB/MSW) provides an elegant test for overall equality of means.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">✓</span>
                <span><strong>Practical Robustness:</strong> ANOVA is robust to assumption violations, especially with larger sample sizes.</span>
              </li>
            </ul>
          </Card>
        </AnimatedContainer>

        {/* Next Steps */}
        <Card className="border-2 border-primary bg-primary bg-opacity-10 p-6">
          <h2 className="font-serif font-bold text-primary mb-4">Next Steps in Your Learning</h2>
          <ul className={`font-serif text-foreground space-y-2 ${textSizeClass}`}>
            <li>• Practice implementing ANOVA with your own datasets</li>
            <li>• Explore post-hoc tests for pairwise comparisons (Tukey, Scheffé)</li>
            <li>• Study two-way and multi-factor ANOVA designs</li>
            <li>• Review contrasts and orthogonal polynomials for planned comparisons</li>
            <li>• Consider Bayesian approaches to ANOVA analysis</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
