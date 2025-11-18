'use client'

import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

interface InteractiveSliderProps {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  displayFormat?: (val: number) => string
}

export const InteractiveSlider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  displayFormat = (v) => v.toFixed(2),
}: InteractiveSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-serif font-semibold text-foreground">{label}</Label>
        <span className="font-serif font-bold text-accent">{displayFormat(value)}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-full"
      />
    </div>
  )
}
