'use client'

import { useState } from 'react'
import { 
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon
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
}

interface VoiceControlsProps {
  selectedTrack: Track | null
  onTrackChange: (track: Track | null) => void
}

const voices = [
  { id: 'rachel', name: 'Rachel', gender: 'Female', accent: 'US', preview: '/audio/previews/rachel.mp3' },
  { id: 'adam', name: 'Adam', gender: 'Male', accent: 'US', preview: '/audio/previews/adam.mp3' },
  { id: 'emma', name: 'Emma', gender: 'Female', accent: 'UK', preview: '/audio/previews/emma.mp3' },
  { id: 'david', name: 'David', gender: 'Male', accent: 'UK', preview: '/audio/previews/david.mp3' },
]

export function VoiceControls({ selectedTrack, onTrackChange }: VoiceControlsProps) {
  const [selectedVoice, setSelectedVoice] = useState(selectedTrack?.voiceId || 'rachel')
  const [settings, setSettings] = useState({
    speed: selectedTrack?.settings?.speed || 1.0,
    pitch: selectedTrack?.settings?.pitch || 1.0,
    volume: selectedTrack?.settings?.volume || 1.0,
  })

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId)
    if (selectedTrack) {
      onTrackChange({
        ...selectedTrack,
        voiceId,
      })
    }
  }

  const handleSettingChange = (key: string, value: number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    if (selectedTrack) {
      onTrackChange({
        ...selectedTrack,
        settings: newSettings,
      })
    }
  }

  const handlePreview = () => {
    // Implement voice preview
    console.log('Previewing voice:', selectedVoice)
  }

  if (!selectedTrack) {
    return (
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center text-gray-500">
          <SpeakerWaveIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">Select a track to configure voice settings</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Voice Selection */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Voice:</label>
            <select
              value={selectedVoice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="input text-sm"
            >
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} ({voice.gender}, {voice.accent})
                </option>
              ))}
            </select>
            <button
              onClick={handlePreview}
              className="btn-ghost text-sm"
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Preview
            </button>
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Speed:</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speed}
                onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">{settings.speed.toFixed(1)}x</span>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Pitch:</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => handleSettingChange('pitch', parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">{settings.pitch.toFixed(1)}x</span>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Volume:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">{Math.round(settings.volume * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <button className="btn-ghost text-sm">
          <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
          Advanced
        </button>
      </div>
    </div>
  )
}