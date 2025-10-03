'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { StudioHeader } from '@/components/studio/studio-header'
import { TextEditor } from '@/components/studio/text-editor'
import { VoiceControls } from '@/components/studio/voice-controls'
import { Timeline } from '@/components/studio/timeline'
import { ProjectSidebar } from '@/components/studio/project-sidebar'

export default function StudioPage() {
  const { user, loading } = useAuth()
  const [selectedProject, setSelectedProject] = useState(null)
  const [tracks, setTracks] = useState([])
  const [selectedTrack, setSelectedTrack] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
          <p className="mt-2 text-gray-600">You need to be signed in to access the studio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudioHeader 
        user={user}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />
      
      <div className="flex h-screen pt-16">
        {/* Project Sidebar */}
        <ProjectSidebar 
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          tracks={tracks}
          onTracksChange={setTracks}
        />
        
        {/* Main Studio Area */}
        <div className="flex-1 flex flex-col">
          {/* Text Editor */}
          <div className="flex-1 bg-white border-b border-gray-200">
            <TextEditor 
              selectedTrack={selectedTrack}
              onTrackChange={setSelectedTrack}
            />
          </div>
          
          {/* Voice Controls */}
          <div className="bg-white border-b border-gray-200">
            <VoiceControls 
              selectedTrack={selectedTrack}
              onTrackChange={setSelectedTrack}
            />
          </div>
          
          {/* Timeline */}
          <div className="flex-1 bg-gray-100">
            <Timeline 
              tracks={tracks}
              selectedTrack={selectedTrack}
              onTrackSelect={setSelectedTrack}
              onTracksChange={setTracks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}