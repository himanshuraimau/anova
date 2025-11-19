import type { Metadata } from 'next'
import { Geist_Mono, Merriweather } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geistMono = Geist_Mono({ subsets: ['latin'] })
const _georgia = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Interactive ANOVA Presentation',
  description: 'Explore Analysis of Variance through interactive visualizations and dynamic mathematics',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* MathJax v3 Configuration */}
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\$$', '\\\$$']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                },
                svg: { fontCache: 'global' },
              };
            `,
          }}
        />
        <Script
          id="mathjax-script"
          src="https://polyfill.io/v3/polyfill.min.js?features=es6"
          strategy="beforeInteractive"
        />
        <Script
          id="mathjax-v3"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="beforeInteractive"
          async
        />
      </head>
      <body className={`${_georgia.variable} font-serif antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
