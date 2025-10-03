'use client'

import Link from 'next/link'
import { 
  PlusIcon, 
  SpeakerWaveIcon, 
  MicrophoneIcon, 
  DocumentDuplicateIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export function QuickActions() {
  const actions = [
    {
      name: 'New Project',
      description: 'Create a new audio project',
      href: '/studio/new',
      icon: PlusIcon,
      color: 'bg-primary-500',
    },
    {
      name: 'Text-to-Speech',
      description: 'Generate speech from text',
      href: '/studio/tts',
      icon: SpeakerWaveIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Speech-to-Text',
      description: 'Transcribe audio to text',
      href: '/studio/stt',
      icon: MicrophoneIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Voice Cloning',
      description: 'Create custom voices',
      href: '/voice-clones/new',
      icon: DocumentDuplicateIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Video Dubbing',
      description: 'Dub videos with AI voices',
      href: '/studio/dubbing',
      icon: VideoCameraIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Conversational AI',
      description: 'Build voice chatbots',
      href: '/studio/chatbot',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-indigo-500',
    },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started with common tasks
        </p>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}