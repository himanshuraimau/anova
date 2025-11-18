'use client'

import { AnovaProvider } from '@/lib/anova-context'
import { NavigationBar } from '@/components/navigation-bar'
import { PageRouter } from '@/components/page-router'

export default function Home() {
  return (
    <AnovaProvider>
      <NavigationBar />
      <PageRouter />
    </AnovaProvider>
  )
}
