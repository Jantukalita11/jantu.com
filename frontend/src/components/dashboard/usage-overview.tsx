'use client'

import { useState, useEffect } from 'react'
import { 
  SpeakerWaveIcon, 
  MicrophoneIcon, 
  DocumentDuplicateIcon,
  ChartBarIcon
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

interface UsageOverviewProps {
  user: User
}

interface UsageData {
  totalCredits: number
  usageByType: {
    TTS: { credits: number; count: number }
    STT: { credits: number; count: number }
    VOICE_CLONING: { credits: number; count: number }
  }
  usageByDate: { [key: string]: number }
}

export function UsageOverview({ user }: UsageOverviewProps) {
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/usage?period=30d`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsageData(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const creditsRemaining = user.creditsLimit - user.creditsUsed
  const creditsPercentage = (user.creditsUsed / user.creditsLimit) * 100

  const usageStats = [
    {
      name: 'Text-to-Speech',
      icon: SpeakerWaveIcon,
      credits: usageData?.usageByType?.TTS?.credits || 0,
      count: usageData?.usageByType?.TTS?.count || 0,
      color: 'bg-blue-500',
    },
    {
      name: 'Speech-to-Text',
      icon: MicrophoneIcon,
      credits: usageData?.usageByType?.STT?.credits || 0,
      count: usageData?.usageByType?.STT?.count || 0,
      color: 'bg-green-500',
    },
    {
      name: 'Voice Cloning',
      icon: DocumentDuplicateIcon,
      credits: usageData?.usageByType?.VOICE_CLONING?.credits || 0,
      count: usageData?.usageByType?.VOICE_CLONING?.count || 0,
      color: 'bg-purple-500',
    },
  ]

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Credits Overview */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Credits Used</p>
              <p className="text-2xl font-semibold text-gray-900">
                {user.creditsUsed.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                of {user.creditsLimit.toLocaleString()} this month
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Usage</span>
              <span className="text-gray-900">{Math.round(creditsPercentage)}%</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
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
      </div>

      {/* Usage by Type */}
      {usageStats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.credits.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {stat.count} requests
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}