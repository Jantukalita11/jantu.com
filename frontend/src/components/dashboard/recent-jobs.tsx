'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'

interface Job {
  id: string
  type: string
  status: string
  progress: number
  createdAt: string
  completedAt?: string
  error?: string
}

export function RecentJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getJobIcon = (type: string) => {
    switch (type) {
      case 'TTS':
        return SpeakerWaveIcon
      case 'STT':
        return MicrophoneIcon
      case 'VOICE_CLONING':
        return DocumentDuplicateIcon
      default:
        return ClockIcon
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return CheckCircleIcon
      case 'FAILED':
        return XCircleIcon
      case 'PROCESSING':
        return ExclamationTriangleIcon
      default:
        return ClockIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500'
      case 'FAILED':
        return 'text-red-500'
      case 'PROCESSING':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
        </div>
        <div className="card-body">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          <Link
            href="/jobs"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="card-body">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your processing jobs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const JobIcon = getJobIcon(job.type)
              const StatusIcon = getStatusIcon(job.status)
              
              return (
                <div
                  key={job.id}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <JobIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {job.type} Job
                      </p>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(job.status)}`} />
                        <span className={`text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatDate(job.createdAt)}</span>
                      {job.status === 'PROCESSING' && (
                        <span>{job.progress}% complete</span>
                      )}
                      {job.status === 'COMPLETED' && job.completedAt && (
                        <span>Completed {formatDate(job.completedAt)}</span>
                      )}
                    </div>
                    {job.status === 'PROCESSING' && (
                      <div className="mt-2 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    )}
                    {job.status === 'FAILED' && job.error && (
                      <p className="mt-1 text-xs text-red-600 truncate">
                        {job.error}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}