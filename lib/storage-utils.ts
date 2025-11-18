'use client'


export interface NotesData {
  timestamp: number
  content: string
}

export const StorageUtils = {
  // User Notes
  getNotes: (): string => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('anova-notes') || ''
  },

  setNotes: (content: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('anova-notes', content)
    localStorage.setItem('anova-notes-updated', new Date().toISOString())
  },

  clearNotes: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('anova-notes')
  },

  // Bookmarks
  getBookmarks: (): number[] => {
    if (typeof window === 'undefined') return []
    const bookmarks = localStorage.getItem('anova-bookmarks')
    return bookmarks ? JSON.parse(bookmarks) : []
  },

  addBookmark: (page: number) => {
    if (typeof window === 'undefined') return
    const bookmarks = StorageUtils.getBookmarks()
    if (!bookmarks.includes(page)) {
      bookmarks.push(page)
      localStorage.setItem('anova-bookmarks', JSON.stringify(bookmarks.sort((a, b) => a - b)))
    }
  },

  removeBookmark: (page: number) => {
    if (typeof window === 'undefined') return
    const bookmarks = StorageUtils.getBookmarks()
    const filtered = bookmarks.filter(b => b !== page)
    localStorage.setItem('anova-bookmarks', JSON.stringify(filtered))
  },

  isBookmarked: (page: number): boolean => {
    return StorageUtils.getBookmarks().includes(page)
  },

  // Session History
  getHistory: (): number[] => {
    if (typeof window === 'undefined') return []
    const history = localStorage.getItem('anova-history')
    return history ? JSON.parse(history) : []
  },

  addToHistory: (page: number) => {
    if (typeof window === 'undefined') return
    const history = StorageUtils.getHistory()
    history.push(page)
    // Keep only last 50 pages visited
    if (history.length > 50) history.shift()
    localStorage.setItem('anova-history', JSON.stringify(history))
  },

  clearHistory: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('anova-history')
  },

  // Export data as JSON
  exportAllData: () => {
    if (typeof window === 'undefined') return null
    const data = {
      notes: StorageUtils.getNotes(),
      bookmarks: StorageUtils.getBookmarks(),
      currentPage: localStorage.getItem('anova-current-page'),
      accessibility: localStorage.getItem('anova-accessibility'),
      exportedAt: new Date().toISOString(),
    }
    return data
  },

  exportAsJSON: () => {
    const data = StorageUtils.exportAllData()
    if (!data) return
    const element = document.createElement('a')
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)))
    element.setAttribute('download', `anova-session-${new Date().toISOString().split('T')[0]}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },
}
