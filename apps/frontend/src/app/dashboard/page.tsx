'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  Mic2,
  FileAudio,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    creditsUsed: 2450,
    creditsTotal: 10000,
    projectsCount: 12,
    audioDuration: 142,
    teamMembers: 1,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your activity overview.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Credits Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-500">Credits</span>
            </div>
            <div className="mb-2">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.creditsTotal - stats.creditsUsed}
                </span>
                <span className="text-gray-500 ml-2">/ {stats.creditsTotal}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${((stats.creditsTotal - stats.creditsUsed) / stats.creditsTotal) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {stats.creditsUsed} used this month
            </p>
          </div>

          {/* Projects Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <FileAudio className="h-6 w-6 text-secondary-600" />
              </div>
              <span className="text-sm text-gray-500">Projects</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{stats.projectsCount}</span>
            </div>
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3 this week
            </p>
          </div>

          {/* Audio Duration Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Audio Generated</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{stats.audioDuration}</span>
              <span className="text-gray-500 ml-1">min</span>
            </div>
            <p className="text-sm text-gray-500">This month</p>
          </div>

          {/* Team Members Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Team</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-900">{stats.teamMembers}</span>
              <span className="text-gray-500 ml-1">member</span>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Upgrade plan
            </button>
          </div>
        </div>

        {/* Recent Projects & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Podcast Episode 12', type: 'TTS', date: '2 hours ago' },
                { name: 'Product Demo Voice', type: 'Voice Clone', date: '1 day ago' },
                { name: 'Multilingual Ad', type: 'Dubbing', date: '2 days ago' },
              ].map((project, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                  <div className="flex items-center">
                    <div className="bg-primary-100 p-2 rounded-lg mr-3">
                      <Mic2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.type}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{project.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Usage This Month</h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                { service: 'Text-to-Speech', credits: 1200, percentage: 49 },
                { service: 'Voice Cloning', credits: 800, percentage: 33 },
                { service: 'Transcription', credits: 450, percentage: 18 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.service}</span>
                    <span className="text-sm text-gray-500">{item.credits} credits</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition text-center">
              <Mic2 className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">New TTS</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition text-center">
              <FileAudio className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Clone Voice</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Transcribe</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-4 rounded-lg transition text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Upgrade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
