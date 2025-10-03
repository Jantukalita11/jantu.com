import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Audio AI Studio - Ultra-Realistic Voice Generation & Cloning',
  description:
    'Professional AI voice generation, voice cloning, dubbing, and speech-to-text studio. Create ultra-realistic voices in 32+ languages with advanced TTS and STT technology.',
  keywords:
    'AI voice generation, text to speech, voice cloning, dubbing, speech to text, TTS, STT, audio AI',
  openGraph: {
    title: 'Audio AI Studio - Ultra-Realistic Voice Generation',
    description: 'Professional AI voice generation and cloning platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
