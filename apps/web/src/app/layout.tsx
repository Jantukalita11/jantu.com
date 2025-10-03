import '../styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Audio AI Studio',
  description: 'Ultra-realistic TTS, cloning, dubbing, and STT.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased bg-zinc-950 text-zinc-100">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="text-lg font-semibold">Audio AI Studio</div>
              <nav className="space-x-6 text-sm text-zinc-300">
                <a href="/pricing" className="hover:text-white">Pricing</a>
                <a href="/studio" className="hover:text-white">Studio</a>
                <a href="/dashboard" className="hover:text-white">Dashboard</a>
                <a href="/api" className="hover:text-white">API</a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-zinc-400">© {new Date().getFullYear()} Audio AI Studio</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
