'use client'

import React, { useState, useEffect } from 'react'
import { StorageUtils } from '@/lib/storage-utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Trash2, Copy } from 'lucide-react'

interface NotesPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const NotesPanel = ({ isOpen, onClose }: NotesPanelProps) => {
  const [notes, setNotes] = useState('')
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    setNotes(StorageUtils.getNotes())
  }, [isOpen])

  const handleSave = () => {
    StorageUtils.setNotes(notes)
    setIsSaved(true)
  }

  const handleClear = () => {
    if (confirm('Clear all notes? This cannot be undone.')) {
      StorageUtils.clearNotes()
      setNotes('')
      setIsSaved(true)
    }
  }

  const handleExport = () => {
    StorageUtils.exportAsJSON()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    setIsSaved(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <Card
        className="border-2 border-primary w-full max-w-2xl max-h-96 flex flex-col bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-serif font-bold text-burgundy text-lg">My Notes</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl font-bold"
          >
            ×
          </button>
        </div>

        <Textarea
          value={notes}
          onChange={handleChange}
          className="flex-1 m-4 font-serif border-2 border-border rounded resize-none"
          placeholder="Add your notes here. They'll be saved automatically..."
        />

        <div className="flex gap-2 p-4 border-t border-border justify-between">
          <Button
            onClick={handleClear}
            variant="destructive"
            size="sm"
            className="font-serif"
          >
            <Trash2 size={14} className="mr-2" />
            Clear
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="font-serif"
            >
              <Download size={14} className="mr-2" />
              Export
            </Button>

            <Button
              onClick={handleSave}
              variant={isSaved ? 'outline' : 'default'}
              size="sm"
              className="font-serif"
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
