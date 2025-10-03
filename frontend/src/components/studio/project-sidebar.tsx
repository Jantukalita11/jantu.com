'use client'

import { useState, useEffect } from 'react'
import { 
  FolderIcon,
  PlusIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  tracks: any[]
  _count: {
    tracks: number
    jobs: number
  }
}

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

interface ProjectSidebarProps {
  selectedProject: Project | null
  onProjectChange: (project: Project | null) => void
  tracks: Track[]
  onTracksChange: (tracks: Track[]) => void
}

export function ProjectSidebar({ 
  selectedProject, 
  onProjectChange, 
  tracks, 
  onTracksChange 
}: ProjectSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    const newProject: Project = {
      id: `project_${Date.now()}`,
      name: 'New Project',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: [],
      _count: { tracks: 0, jobs: 0 },
    }
    onProjectChange(newProject)
  }

  const handleExportProject = () => {
    if (!selectedProject) return
    
    // Implement project export
    console.log('Exporting project:', selectedProject.name)
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>
          <button
            onClick={handleCreateProject}
            className="btn-ghost text-sm"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onProjectChange(project)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedProject?.id === project.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FolderIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {project._count.tracks} tracks • {project._count.jobs} jobs
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Actions */}
      {selectedProject && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button className="w-full btn-secondary text-sm flex items-center justify-center">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Project Settings
          </button>
          
          <button 
            onClick={handleExportProject}
            className="w-full btn-secondary text-sm flex items-center justify-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export Project
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {tracks.length}
            </div>
            <div className="text-xs text-gray-500">Tracks</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {tracks.reduce((sum, track) => sum + (track.text?.length || 0), 0)}
            </div>
            <div className="text-xs text-gray-500">Characters</div>
          </div>
        </div>
      </div>
    </div>
  )
}