'use client'

import React, { useState, useCallback } from 'react'
import { useAnova } from '@/lib/anova-context'
import { Card } from '@/components/ui/card'
import { AnimatedContainer } from '@/components/animated-container'
import { Button } from '@/components/ui/button'

export const Page16Notation = () => {
  const { accessibility, anovaData, updateAnovaData } = useAnova()
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [tempValue, setTempValue] = useState('')

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[accessibility.textSize]

  // Sample data
  const data = [
    [42, 48, 55],
    [45, 51, 58],
    [48, 52, 60],
    [46, 50, 56],
  ]

  const calculateStats = () => {
    const k = data[0].length
    const ns = data[0].map((_, col) => data.filter((_, row) => true).length)
    const n = data.length * k
    const groupMeans = Array.from({ length: k }, (_, col) => {
      const sum = data.reduce((sum, row) => sum + row[col], 0)
      return sum / data.length
    })
    const overallMean = data.flat().reduce((a, b) => a + b, 0) / n

    return { k, ns, n, groupMeans, overallMean }
  }

  const stats = calculateStats()

  const handleCellEdit = (row: number, col: number) => {
    setEditingCell({ row, col })
    setTempValue(data[row][col].toString())
  }

  const saveCellEdit = () => {
    if (editingCell && !isNaN(Number(tempValue))) {
      data[editingCell.row][editingCell.col] = Number(tempValue)
      setEditingCell(null)
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-burgundy mb-2">ANOVA Notation</h1>
        <p className="text-muted-foreground font-serif mb-8">Data structure and calculations</p>

        {/* Data Grid */}
        <AnimatedContainer animation="slideInLeft" className="mb-8">
          <Card className="border-2 border-primary p-6 bg-background">
            <h2 className="font-serif font-bold text-burgundy mb-4">Interactive Data Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full font-serif text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="p-2 text-left text-burgundy font-bold">i (row)</th>
                    {Array.from({ length: stats.k }).map((_, col) => (
                      <th key={col} className="p-2 text-center text-burgundy font-bold">
                        Group {col + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-border hover:bg-cream">
                      <td className="p-2 font-bold text-burgundy">{rowIdx + 1}</td>
                      {row.map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className="p-2 text-center cursor-pointer hover:bg-gold hover:bg-opacity-20 border border-border"
                          onClick={() => handleCellEdit(rowIdx, colIdx)}
                        >
                          {editingCell?.row === rowIdx && editingCell?.col === colIdx ? (
                            <input
                              type="number"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              onBlur={saveCellEdit}
                              onKeyDown={(e) => e.key === 'Enter' && saveCellEdit()}
                              autoFocus
                              className="w-12 text-center border border-burgundy rounded px-1"
                            />
                          ) : (
                            val
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-serif">Click cells to edit values</p>
          </Card>
        </AnimatedContainer>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Group Statistics */}
          <AnimatedContainer animation="fadeIn" delay={0.2}>
            <Card className="border-2 border-accent p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Group Means (ȳᵢ.)</h2>
              <div className="space-y-2">
                {stats.groupMeans.map((mean, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-cream rounded">
                    <span className="font-serif font-semibold text-burgundy">ȳ{idx + 1}. =</span>
                    <span className="font-serif font-mono text-dark-brown">{mean.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedContainer>

          {/* Overall Statistics */}
          <AnimatedContainer animation="fadeIn" delay={0.3}>
            <Card className="border-2 border-gold p-6 bg-background">
              <h2 className="font-serif font-bold text-burgundy mb-4">Overall Statistics</h2>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-cream rounded">
                  <span className="font-serif font-semibold text-burgundy">k =</span>
                  <span className="font-serif font-mono text-dark-brown">{stats.k}</span>
                </div>
                <div className="flex justify-between p-2 bg-cream rounded">
                  <span className="font-serif font-semibold text-burgundy">n =</span>
                  <span className="font-serif font-mono text-dark-brown">{stats.n}</span>
                </div>
                <div className="flex justify-between p-2 bg-cream rounded">
                  <span className="font-serif font-semibold text-burgundy">ȳ.. =</span>
                  <span className="font-serif font-mono text-dark-brown">{stats.overallMean.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </AnimatedContainer>
        </div>

        {/* Notation Reference */}
        <Card className="border-2 border-gold p-6 bg-background">
          <h2 className="font-serif font-bold text-burgundy mb-4">Notation Reference</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">Y<sub>ij</sub></p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>The jth observation in group i</p>
            </div>
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">ȳᵢ.</p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>Mean of group i</p>
            </div>
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">ȳ..</p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>Grand mean (overall mean)</p>
            </div>
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">k</p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>Number of groups</p>
            </div>
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">nᵢ</p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>Number of observations in group i</p>
            </div>
            <div>
              <p className="font-serif font-semibold text-burgundy mb-2">n</p>
              <p className={`font-serif text-foreground ${textSizeClass}`}>Total number of observations</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
