import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Audio AI Studio - Ultra-Realistic Voice Generation & Speech-to-Text',
  description: 'Professional AI voice generation, voice cloning, dubbing, and speech-to-text studio. Create realistic voices in 32+ languages with our advanced AI technology.',
  keywords: 'AI voice generation, text-to-speech, voice cloning, speech-to-text, dubbing, AI voices, voice synthesis',
  authors: [{ name: 'Audio AI Studio' }],
  openGraph: {
    title: 'Audio AI Studio - Ultra-Realistic Voice Generation',
    description: 'Professional AI voice generation, voice cloning, dubbing, and speech-to-text studio.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio AI Studio - Ultra-Realistic Voice Generation',
    description: 'Professional AI voice generation, voice cloning, dubbing, and speech-to-text studio.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}