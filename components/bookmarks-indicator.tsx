'use client'

import React, { useState, useEffect } from 'react'
import { useAnova } from '@/lib/anova-context'
import { StorageUtils } from '@/lib/storage-utils'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'

export const BookmarksIndicator = () => {
  const { currentPage, setCurrentPage } = useAnova()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)

  useEffect(() => {
    setIsBookmarked(StorageUtils.isBookmarked(currentPage))
    setBookmarks(StorageUtils.getBookmarks())
  }, [currentPage])

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      StorageUtils.removeBookmark(currentPage)
    } else {
      StorageUtils.addBookmark(currentPage)
    }
    setIsBookmarked(!isBookmarked)
    setBookmarks(StorageUtils.getBookmarks())
  }

  return (
    <div className="relative">
      <Button
        onClick={handleToggleBookmark}
        variant={isBookmarked ? 'default' : 'outline'}
        size="sm"
        className="font-serif"
        title="Toggle bookmark"
      >
        <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
      </Button>

      {bookmarks.length > 0 && (
        <Button
          onClick={() => setShowBookmarks(!showBookmarks)}
          variant="outline"
          size="sm"
          className="font-serif ml-2"
          title={`${bookmarks.length} bookmarks`}
        >
          {bookmarks.length}
        </Button>
      )}

      {showBookmarks && bookmarks.length > 0 && (
        <div className="absolute top-full mt-2 left-0 bg-background border-2 border-primary rounded-lg shadow-lg w-32 z-10">
          {bookmarks.map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page)
                setShowBookmarks(false)
              }}
              className="w-full text-left px-3 py-2 font-serif text-sm hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-0"
            >
              Page {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
