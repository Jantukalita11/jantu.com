'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
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
}

interface TextEditorProps {
  selectedTrack: Track | null
  onTrackChange: (track: Track | null) => void
}

export function TextEditor({ selectedTrack, onTrackChange }: TextEditorProps) {
  const [text, setText] = useState(selectedTrack?.text || '')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (selectedTrack) {
      setText(selectedTrack.text)
    } else {
      setText('')
    }
  }, [selectedTrack])

  const handleTextChange = (newText: string) => {
    setText(newText)
    if (selectedTrack) {
      onTrackChange({
        ...selectedTrack,
        text: newText,
      })
    }
  }

  const handleGenerateAudio = async () => {
    if (!text.trim() || !selectedTrack) return

    setIsGenerating(true)
    try {
      // Simulate TTS generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would call the TTS API
      console.log('Generating audio for:', text)
    } catch (error) {
      console.error('Failed to generate audio:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `track_${Date.now()}`,
      name: `Track ${Date.now()}`,
      text: '',
      order: 0,
    }
    onTrackChange(newTrack)
  }

  const handleDeleteTrack = () => {
    if (selectedTrack) {
      onTrackChange(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">
            {selectedTrack ? selectedTrack.name : 'Text Editor'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddTrack}
            className="btn-ghost text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Track
          </button>
          
          {selectedTrack && (
            <button
              onClick={handleDeleteTrack}
              className="btn-ghost text-sm text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        {selectedTrack ? (
          <div className="h-full flex flex-col space-y-4">
            {/* Track name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track Name
              </label>
              <input
                type="text"
                value={selectedTrack.name}
                onChange={(e) => onTrackChange({
                  ...selectedTrack,
                  name: e.target.value,
                })}
                className="input"
                placeholder="Enter track name"
              />
            </div>

            {/* Text area */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text to Convert
              </label>
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                className="flex-1 input resize-none"
                placeholder="Enter the text you want to convert to speech..."
                rows={10}
              />
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{text.length} characters</span>
                <span>~{Math.ceil(text.length / 100)} credits</span>
              </div>
            </div>

            {/* Generate button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {selectedTrack.voiceId ? 'Voice selected' : 'No voice selected'}
              </div>
              
              <button
                onClick={handleGenerateAudio}
                disabled={!text.trim() || isGenerating}
                className="btn-primary flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <SpeakerWaveIcon className="h-4 w-4" />
                    <span>Generate Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No track selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a track from the sidebar or create a new one to start editing.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddTrack}
                  className="btn-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create New Track
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}