'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface Group {
  id: number
  n: number
  mean: number
  variance: number
  data: number[]
}

interface AnovaData {
  k: number
  groups: Group[]
  alpha: number
  overallMean: number
  SST: number
  SSB: number
  SSW: number
}

interface AnimationControls {
  isPlaying: boolean
  speed: 0.5 | 1 | 2
  skipAnimations: boolean
}

interface AccessibilitySettings {
  reduceMotion: boolean
  textSize: 'small' | 'medium' | 'large'
  highContrast: boolean
}

interface AnovaContextType {
  // Data management
  anovaData: AnovaData
  updateAnovaData: (updates: Partial<AnovaData>) => void
  updateGroup: (id: number, updates: Partial<Group>) => void
  
  // Animation controls
  animationControls: AnimationControls
  setAnimationControls: (controls: Partial<AnimationControls>) => void
  
  // Accessibility
  accessibility: AccessibilitySettings
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void
  
  // Navigation
  currentPage: number
  setCurrentPage: (page: number) => void
  
  // Utilities
  resetAll: () => void
}

const defaultAnovaData: AnovaData = {
  k: 3,
  groups: [
    { id: 1, n: 10, mean: 50, variance: 25, data: Array(10).fill(0).map(() => 50 + Math.random() * 10) },
    { id: 2, n: 10, mean: 55, variance: 25, data: Array(10).fill(0).map(() => 55 + Math.random() * 10) },
    { id: 3, n: 10, mean: 60, variance: 25, data: Array(10).fill(0).map(() => 60 + Math.random() * 10) },
  ],
  alpha: 0.05,
  overallMean: 55,
  SST: 2500,
  SSB: 1500,
  SSW: 1000,
}

const AnovaContext = createContext<AnovaContextType | undefined>(undefined)

export const AnovaProvider = ({ children }: { children: React.ReactNode }) => {
  const [anovaData, setAnovaData] = useState<AnovaData>(defaultAnovaData)
  const [animationControls, setAnimationControlsState] = useState<AnimationControls>({
    isPlaying: true,
    speed: 1,
    skipAnimations: false,
  })
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>({
    reduceMotion: false,
    textSize: 'medium',
    highContrast: false,
  })
  const [currentPage, setCurrentPageState] = useState(1)

  useEffect(() => {
    const savedPage = localStorage.getItem('anova-current-page')
    if (savedPage) setCurrentPageState(Number(savedPage))

    const savedAccessibility = localStorage.getItem('anova-accessibility')
    if (savedAccessibility) {
      setAccessibilityState(JSON.parse(savedAccessibility))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('anova-current-page', String(currentPage))
  }, [currentPage])

  useEffect(() => {
    localStorage.setItem('anova-accessibility', JSON.stringify(accessibility))
  }, [accessibility])

  const updateAnovaData = useCallback((updates: Partial<AnovaData>) => {
    setAnovaData(prev => ({ ...prev, ...updates }))
  }, [])

  const updateGroup = useCallback((id: number, updates: Partial<Group>) => {
    setAnovaData(prev => ({
      ...prev,
      groups: prev.groups.map(g => (g.id === id ? { ...g, ...updates } : g)),
    }))
  }, [])

  const setAnimationControls = useCallback((controls: Partial<AnimationControls>) => {
    setAnimationControlsState(prev => ({ ...prev, ...controls }))
  }, [])

  const setAccessibility = useCallback((settings: Partial<AccessibilitySettings>) => {
    setAccessibilityState(prev => ({ ...prev, ...settings }))
  }, [])

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(Math.max(1, Math.min(18, page)))
  }, [])

  const resetAll = useCallback(() => {
    setAnovaData(defaultAnovaData)
    setCurrentPageState(1)
    localStorage.setItem('anova-current-page', '1')
  }, [])

  return (
    <AnovaContext.Provider
      value={{
        anovaData,
        updateAnovaData,
        updateGroup,
        animationControls,
        setAnimationControls,
        accessibility,
        setAccessibility,
        currentPage,
        setCurrentPage,
        resetAll,
      }}
    >
      {children}
    </AnovaContext.Provider>
  )
}

export const useAnova = () => {
  const context = useContext(AnovaContext)
  if (!context) {
    throw new Error('useAnova must be used within AnovaProvider')
  }
  return context
}
