import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Audio AI Studio - Professional Voice Generation & Cloning',
  description: 'Create ultra-realistic AI voices with our comprehensive audio studio. Text-to-speech, voice cloning, dubbing, and more across 32+ languages.',
  keywords: 'AI voice, text to speech, voice cloning, dubbing, audio generation, TTS, STT',
  authors: [{ name: 'Audio AI Studio' }],
  creator: 'Audio AI Studio',
  publisher: 'Audio AI Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Audio AI Studio - Professional Voice Generation & Cloning',
    description: 'Create ultra-realistic AI voices with our comprehensive audio studio.',
    url: '/',
    siteName: 'Audio AI Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Audio AI Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio AI Studio - Professional Voice Generation & Cloning',
    description: 'Create ultra-realistic AI voices with our comprehensive audio studio.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}