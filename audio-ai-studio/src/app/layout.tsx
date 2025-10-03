import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audio AI Studio - Ultra-Realistic Text-to-Speech & Voice Cloning",
  description: "Professional audio AI studio with human-like TTS, instant voice cloning, dubbing, and conversational AI. Create, edit, and export high-quality audio content with our comprehensive platform.",
  keywords: "text-to-speech, voice cloning, AI audio, dubbing studio, speech-to-text, conversational AI, audio production",
  authors: [{ name: "Audio AI Studio" }],
  creator: "Audio AI Studio",
  publisher: "Audio AI Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://audioaistudio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://audioaistudio.com',
    title: 'Audio AI Studio - Ultra-Realistic Text-to-Speech & Voice Cloning',
    description: 'Professional audio AI studio with human-like TTS, instant voice cloning, dubbing, and conversational AI.',
    siteName: 'Audio AI Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Audio AI Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio AI Studio - Ultra-Realistic Text-to-Speech & Voice Cloning',
    description: 'Professional audio AI studio with human-like TTS, instant voice cloning, dubbing, and conversational AI.',
    images: ['/og-image.png'],
    creator: '@audioaistudio',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
