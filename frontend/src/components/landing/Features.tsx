'use client';

import { 
  Mic, 
  Volume2, 
  Copy, 
  Video, 
  MessageSquare, 
  FileText, 
  Music, 
  Zap,
  Globe,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

const features = [
  {
    name: 'Advanced Text-to-Speech',
    description: 'Ultra-realistic AI voices with adjustable prosody, speed, pitch, and SSML support across 32+ languages.',
    icon: Volume2,
    color: 'bg-blue-500',
  },
  {
    name: 'Instant Voice Cloning',
    description: 'Clone any voice with just a few seconds of audio. Professional multi-sample cloning available.',
    icon: Copy,
    color: 'bg-purple-500',
  },
  {
    name: 'Studio Workspace',
    description: 'Professional multi-track editor with timeline, import/export, batch processing, and version history.',
    icon: Mic,
    color: 'bg-green-500',
  },
  {
    name: 'Dubbing Studio',
    description: 'Automated lip-sync dubbing with video upload, subtitle import, and per-segment voice assignment.',
    icon: Video,
    color: 'bg-red-500',
  },
  {
    name: 'Conversational AI',
    description: 'Voice-based chatbots with persistent context and webchat widget for websites.',
    icon: MessageSquare,
    color: 'bg-indigo-500',
  },
  {
    name: 'Speech-to-Text',
    description: 'High-accuracy transcription with punctuation, speaker diarization, and timestamps.',
    icon: FileText,
    color: 'bg-yellow-500',
  },
  {
    name: 'Music & SFX',
    description: 'Royalty-free music generation and background mixing tools for social media and ads.',
    icon: Music,
    color: 'bg-pink-500',
  },
  {
    name: 'API & SDKs',
    description: 'REST API with webhooks and client SDKs for JavaScript and Python integration.',
    icon: Zap,
    color: 'bg-orange-500',
  },
  {
    name: 'Global Scale',
    description: '32+ languages supported with 99.9% uptime and global CDN for low-latency delivery.',
    icon: Globe,
    color: 'bg-cyan-500',
  },
  {
    name: 'Enterprise Security',
    description: 'End-to-end encryption, HIPAA compliance, SSO/SCIM, and audit logs for enterprise needs.',
    icon: Shield,
    color: 'bg-emerald-500',
  },
  {
    name: 'Team Collaboration',
    description: 'Multi-seat workspaces with role-based access control and team management tools.',
    icon: Users,
    color: 'bg-violet-500',
  },
  {
    name: 'Usage Analytics',
    description: 'Detailed usage tracking, credit management, and billing analytics with real-time monitoring.',
    icon: BarChart3,
    color: 'bg-rose-500',
  },
];

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">
            Complete Audio AI Platform
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create professional audio content
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From voice generation to dubbing, our comprehensive platform provides all the tools 
            you need to create, edit, and distribute high-quality audio content at scale.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}