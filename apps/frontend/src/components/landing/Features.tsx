'use client';

import {
  Mic2,
  Languages,
  Wand2,
  Film,
  MessageSquare,
  FileAudio,
  Music,
  Code,
  Shield,
  Zap,
  Users,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Mic2,
    title: 'Ultra-Realistic TTS',
    description:
      'Multi-modal text-to-speech with 100+ voices, adjustable prosody, speed, pitch, and SSML support.',
  },
  {
    icon: Wand2,
    title: 'Voice Cloning',
    description:
      'Instant voice cloning from short samples or professional multi-sample cloning for perfect replication.',
  },
  {
    icon: Languages,
    title: '32+ Languages',
    description:
      'Generate voices in 32+ languages with native accent support and cross-lingual voice transfer.',
  },
  {
    icon: Film,
    title: 'Dubbing Studio',
    description:
      'Automated lip-sync dubbing with video upload, subtitle import, and per-segment voice assignment.',
  },
  {
    icon: FileAudio,
    title: 'Speech-to-Text',
    description:
      'High-accuracy transcription with speaker diarization, timestamps, and punctuation.',
  },
  {
    icon: MessageSquare,
    title: 'Conversational AI',
    description:
      'Voice-based chatbots with persistent context and embeddable webchat widgets.',
  },
  {
    icon: Music,
    title: 'Music & SFX',
    description:
      'Royalty-permitted music generation and mixing tools for ads and social content.',
  },
  {
    icon: Code,
    title: 'REST API & SDKs',
    description: 'Comprehensive API with JS and Python SDKs, webhooks, and OpenAPI docs.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Multi-seat workspaces with role-based access control and seat management.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2, HIPAA BAA, SSO/SCIM, encryption at rest and in transit, audit logs.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Sub-300ms latency with autoscaling infrastructure and GPU-accelerated inference.',
  },
  {
    icon: Sparkles,
    title: 'Studio Workspace',
    description:
      'Professional multi-track editor with timeline, version history, and batch processing.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Create
            <span className="text-gradient"> Amazing Audio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From voice generation to dubbing, our comprehensive platform has all the tools
            professionals need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition card-hover"
            >
              <div className="bg-primary-100 p-3 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
