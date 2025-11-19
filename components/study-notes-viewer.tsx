'use client'

import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { PDFGenerator } from '@/lib/pdf-generator'
import mermaid from 'mermaid'

// Initialize mermaid
if (typeof window !== 'undefined') {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'Georgia, serif',
  })
}

interface StudyNotesViewerProps {
  markdownContent: string
}

export const StudyNotesViewer: React.FC<StudyNotesViewerProps> = ({ markdownContent }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const mermaidRefs = useRef<Map<string, string>>(new Map())

  // Render mermaid diagrams after ReactMarkdown renders
  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      const mermaidElements = document.querySelectorAll('.mermaid-diagram')
      for (const element of Array.from(mermaidElements)) {
        const id = element.getAttribute('data-mermaid-id')
        const code = element.textContent || ''
        if (id && code && !mermaidRefs.current.has(id)) {
          try {
            const { svg } = await mermaid.render(id + '-svg', code)
            element.innerHTML = svg
            mermaidRefs.current.set(id, svg)
          } catch (error) {
            console.error('Error rendering mermaid:', error)
          }
        }
      }
    }

    const timer = setTimeout(renderMermaidDiagrams, 500)
    return () => clearTimeout(timer)
  }, [markdownContent])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
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
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Download Button */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b-2 border-primary mb-8 pb-4 pt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              ANOVA Study Notes
            </h1>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="font-serif bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="prose prose-lg max-w-none bg-card rounded-lg shadow-lg p-8 md:p-12"
          style={{
            fontFamily: 'Georgia, serif',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl font-bold text-primary mb-6 mt-8 border-b-2 border-accent pb-2"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-3xl font-bold text-primary mb-4 mt-6"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl font-semibold text-primary mb-3 mt-4"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="text-xl font-semibold text-foreground mb-2 mt-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 text-foreground leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="mb-4 ml-6 list-disc text-foreground" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="mb-4 ml-6 list-decimal text-foreground" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-2 leading-relaxed" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6">
                  <table
                    className="min-w-full border-collapse border-2 border-primary"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-primary text-primary-foreground" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border-2 border-primary px-4 py-2 text-left font-bold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border-2 border-primary px-4 py-2"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : ''
                const codeString = String(children).replace(/\n$/, '')
                
                if (language === 'mermaid') {
                  const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                  return (
                    <div
                      className="mermaid-diagram my-6 flex justify-center"
                      data-mermaid-id={id}
                    >
                      {codeString}
                    </div>
                  )
                }
                
                return inline ? (
                  <code
                    className="bg-accent/20 text-primary px-1.5 py-0.5 rounded font-mono text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className="block bg-foreground/5 text-foreground p-4 rounded-lg overflow-x-auto font-mono text-sm my-4"
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              pre: ({ node, ...props }) => (
                <pre className="my-4" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-accent pl-4 italic text-foreground/80 my-4"
                  {...props}
                />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-t-2 border-accent my-8" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-primary" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-foreground" {...props} />
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

