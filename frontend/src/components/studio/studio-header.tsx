'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon, 
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  name: string
  role: string
  creditsUsed: number
  creditsLimit: number
  planType: string
  subscriptionStatus: string
}

interface StudioHeaderProps {
  user: User
  selectedProject: any
  onProjectChange: (project: any) => void
}

export function StudioHeader({ user, selectedProject, onProjectChange }: StudioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    setIsPaused(false)
    // Implement play functionality
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
    // Implement pause functionality
  }

  const handleStop = () => {
    setIsPlaying(false)
    setIsPaused(false)
    // Implement stop functionality
  }

  const handleRegenerate = () => {
    // Implement regenerate functionality
  }

  const creditsRemaining = user.creditsLimit - user.creditsUsed
  const creditsPercentage = (user.creditsUsed / user.creditsLimit) * 100

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Audio AI Studio</span>
              </Link>
            </div>
            
            {/* Project selector */}
            <div className="ml-8">
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  // Handle project selection
                }}
                className="border-0 text-lg font-medium text-gray-900 focus:ring-0 focus:outline-none"
              >
                <option value="">Select Project</option>
                <option value="new">+ New Project</option>
              </select>
            </div>
          </div>

          {/* Center - Playback controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStop}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Stop"
            >
              <StopIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
              title={isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
            >
              {isPlaying && !isPaused ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleRegenerate}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Regenerate"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Credits indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <SpeakerWaveIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {creditsRemaining.toLocaleString()} credits
              </span>
              <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    creditsPercentage > 90 ? 'bg-red-500' : 
                    creditsPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Export button */}
            <button className="btn-secondary text-sm">
              Export
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Credits</span>
                <span className="text-sm text-gray-900">
                  {creditsRemaining.toLocaleString()} remaining
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    creditsPercentage > 90 ? 'bg-red-500' : 
                    creditsPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}