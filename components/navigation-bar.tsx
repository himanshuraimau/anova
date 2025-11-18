'use client'

import React, { useState, useEffect } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { ChevronDown, Play, Pause, VolumeX, Contrast, FileText, Bookmark } from 'lucide-react'
import { BookmarksIndicator } from '@/components/bookmarks-indicator'
import { NotesPanel } from '@/components/notes-panel'

const PAGE_TITLES = [
  'Title Page',
  'Learning Objectives',
  'Problem Statement',
  'Why Not t-tests?',
  'Means Model',
  'Factor Effect Model',
  'Multiple Testing Problem',
  'Table 7.1 - Pairwise Comparisons',
  'Probability Calculations',
  'Why ANOVA?',
  'One-Way ANOVA',
  'ANOVA Assumptions',
  'ANOVA Hypotheses',
  'Figure 7.1 - Significantly Different',
  'Figure 7.2 - Equal Means',
  'ANOVA Notation',
  'Sum of Squares Total',
  'Summary & Navigation',
]

export const NavigationBar = () => {
  const { currentPage, setCurrentPage, animationControls, setAnimationControls, accessibility, setAccessibility } =
    useAnova()
  const [showPageMenu, setShowPageMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePageChange = (delta: number) => {
    setCurrentPage(currentPage + delta)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b-2 border-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
          <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground order-1 md:order-none">
              <span className="font-serif font-semibold hidden sm:inline">{currentPage} / 18</span>
              <div className="w-16 md:w-24 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${(currentPage / 18) * 100}%` }}
                />
              </div>
            </div>

            {/* Page navigation buttons */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
                className="font-serif text-xs"
              >
                ← Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 18}
                className="font-serif text-xs"
              >
                Next →
              </Button>
            </div>

            {/* Page menu - hidden on mobile */}
            {!isMobile && (
              <div className="relative">
                <button
                  onClick={() => setShowPageMenu(!showPageMenu)}
                  className="px-2 md:px-3 py-2 bg-primary text-primary-foreground rounded-md font-serif text-xs md:text-sm hover:bg-burgundy transition-colors flex items-center gap-1 truncate max-w-xs"
                >
                  <span className="truncate">{PAGE_TITLES[currentPage - 1]}</span>
                  <ChevronDown size={14} />
                </button>
                {showPageMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border-2 border-primary rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
                    {PAGE_TITLES.map((title, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentPage(idx + 1)
                          setShowPageMenu(false)
                        }}
                        className={`w-full text-left px-3 py-2 font-serif text-xs transition-colors ${
                          currentPage === idx + 1
                            ? 'bg-accent text-accent-foreground font-bold'
                            : 'hover:bg-border text-foreground'
                        }`}
                      >
                        {idx + 1}. {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Animation controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={animationControls.isPlaying ? 'default' : 'outline'}
                onClick={() => setAnimationControls({ isPlaying: !animationControls.isPlaying })}
                title={animationControls.isPlaying ? 'Pause' : 'Play'}
                className="font-serif"
              >
                {animationControls.isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </Button>

              {/* Speed control */}
              <select
                value={animationControls.speed}
                onChange={e => setAnimationControls({ speed: parseFloat(e.target.value) as 0.5 | 1 | 2 })}
                className="text-xs bg-background border border-border rounded px-1 py-1 font-serif"
                title="Animation speed"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            {/* Notes and Bookmarks */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowNotes(true)}
                variant="outline"
                size="sm"
                className="font-serif"
                title="Open notes"
              >
                <FileText size={14} />
              </Button>
              <BookmarksIndicator />
            </div>

            {/* Accessibility controls */}
            <div className="flex items-center gap-1">
              <Toggle
                pressed={accessibility.reduceMotion}
                onPressedChange={pressed => setAccessibility({ reduceMotion: pressed })}
                title="Reduce motion"
                size="sm"
                className="w-9 h-9"
              >
                <VolumeX size={14} />
              </Toggle>

              <select
                value={accessibility.textSize}
                onChange={e => setAccessibility({ textSize: e.target.value as any })}
                className="text-xs bg-background border border-border rounded px-1 py-1 font-serif"
                title="Text size"
              >
                <option value="small">A−</option>
                <option value="medium">A</option>
                <option value="large">A+</option>
              </select>

              <Toggle
                pressed={accessibility.highContrast}
                onPressedChange={pressed => setAccessibility({ highContrast: pressed })}
                title="High contrast"
                size="sm"
                className="w-9 h-9"
              >
                <Contrast size={14} />
              </Toggle>
            </div>
          </div>
        </div>
      </nav>

      {/* Notes Panel */}
      <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
    </>
  )
}
