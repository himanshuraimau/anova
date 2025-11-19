'use client'

import React, { useState, useEffect } from 'react'
import { StudyNotesViewer } from '@/components/study-notes-viewer'

export const PageStudyNotes = () => {
  const [markdownContent, setMarkdownContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the markdown file
    fetch('/study-notes.md')
      .then((res) => res.text())
      .then((text) => {
        setMarkdownContent(text)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load study notes:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground font-serif text-lg">Loading study notes...</p>
        </div>
      </div>
    )
  }

  return <StudyNotesViewer markdownContent={markdownContent} />
}

