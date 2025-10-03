'use client'

import { useAuth } from '@/lib/auth-context'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { UsageOverview } from '@/components/dashboard/usage-overview'
import { RecentProjects } from '@/components/dashboard/recent-projects'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentJobs } from '@/components/dashboard/recent-jobs'

export default function DashboardPage() {
  const { user, loading } = useAuth()

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
          <p className="mt-2 text-gray-600">You need to be signed in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="mt-1 text-gray-600">
              Here's what's happening with your audio projects today.
            </p>
          </div>

          {/* Usage overview */}
          <UsageOverview user={user} />

          {/* Quick actions */}
          <QuickActions />

          {/* Recent projects and jobs */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RecentProjects />
            <RecentJobs />
          </div>
        </div>
      </main>
    </div>
  )
}