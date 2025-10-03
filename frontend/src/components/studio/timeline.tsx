'use client'

import { useState } from 'react'
import { 
  ClockIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

interface Track {
  id: string
  name: string
  text: string
  voiceId?: string
  settings?: {
    speed?: number
    pitch?: number
    volume?: number
  }
  order: number
  audioUrl?: string
  duration?: number
}

interface TimelineProps {
  tracks: Track[]
  selectedTrack: Track | null
  onTrackSelect: (track: Track | null) => void
  onTracksChange: (tracks: Track[]) => void
}

export function Timeline({ tracks, selectedTrack, onTrackSelect, onTracksChange }: TimelineProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTrackClick = (track: Track) => {
    onTrackSelect(track)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Implement play/pause functionality
  }

  return (
    <div className="h-full flex flex-col">
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto p-4">
        {tracks.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tracks</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create tracks in the text editor to see them here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handleTrackClick(track)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTrack?.id === track.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        selectedTrack?.id === track.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <SpeakerWaveIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {track.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {track.text.substring(0, 100)}
                        {track.text.length > 100 && '...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {track.voiceId ? (
                        <span className="capitalize">{track.voiceId}</span>
                      ) : (
                        <span className="text-gray-400">No voice</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {track.duration ? formatTime(track.duration) : '0:00'}
                    </div>
                  </div>
                </div>

                {/* Audio waveform placeholder */}
                {track.audioUrl && (
                  <div className="mt-3 h-8 bg-gray-100 rounded flex items-center px-2">
                    <div className="flex-1 h-2 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}