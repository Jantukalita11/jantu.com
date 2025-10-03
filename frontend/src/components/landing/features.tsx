import { 
  SpeakerWaveIcon, 
  MicrophoneIcon, 
  DocumentDuplicateIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  MusicalNoteIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Text-to-Speech',
    description: 'Generate ultra-realistic voices in 32+ languages with natural intonation, emotion, and pacing.',
    icon: SpeakerWaveIcon,
    highlights: ['32+ languages', 'Natural prosody', 'SSML support', 'Multiple formats'],
  },
  {
    name: 'Voice Cloning',
    description: 'Create custom voices from short samples or professional multi-sample cloning for perfect replication.',
    icon: DocumentDuplicateIcon,
    highlights: ['Instant cloning', 'Professional quality', 'Custom voices', 'Brand consistency'],
  },
  {
    name: 'Speech-to-Text',
    description: 'Accurate transcription with punctuation, speaker diarization, and timestamps in multiple formats.',
    icon: MicrophoneIcon,
    highlights: ['High accuracy', 'Speaker diarization', 'Timestamps', 'Multiple formats'],
  },
  {
    name: 'Dubbing Studio',
    description: 'Automated video dubbing with lip-sync technology and subtitle integration for global content.',
    icon: VideoCameraIcon,
    highlights: ['Lip-sync dubbing', 'Subtitle import', 'Multi-language', 'Video export'],
  },
  {
    name: 'Conversational AI',
    description: 'Build voice-based chatbots with persistent context and natural conversation flow.',
    icon: ChatBubbleLeftRightIcon,
    highlights: ['Voice chatbots', 'Persistent context', 'Webchat widget', 'Custom responses'],
  },
  {
    name: 'Music & SFX',
    description: 'Generate royalty-free music and sound effects for your content with commercial licensing.',
    icon: MusicalNoteIcon,
    highlights: ['Royalty-free', 'Commercial license', 'Background mixing', 'Social media ready'],
  },
  {
    name: 'Studio Workspace',
    description: 'Professional multi-track editor with timeline, version history, and collaborative features.',
    icon: CogIcon,
    highlights: ['Multi-track editor', 'Timeline view', 'Version history', 'Team collaboration'],
  },
  {
    name: 'Enterprise Security',
    description: 'HIPAA compliance, SSO integration, audit logs, and enterprise-grade security controls.',
    icon: ShieldCheckIcon,
    highlights: ['HIPAA BAA', 'SSO/SCIM', 'Audit logs', 'Data encryption'],
  },
]

export function Features() {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for professional audio content
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From simple text-to-speech to complex voice cloning and video dubbing, 
            our platform provides all the tools you need to create professional audio content.
          </p>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <feature.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">{feature.description}</p>
                <div className="mt-4">
                  <ul className="space-y-1">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="text-xs text-gray-500 flex items-center">
                        <div className="h-1 w-1 bg-gray-400 rounded-full mr-2"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* API & SDK Section */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Developer-friendly API & SDKs
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Integrate our AI voice technology into your applications with our comprehensive API and SDKs.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">REST</span>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">REST API</h4>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive REST API with OpenAPI documentation and webhook support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">JS</span>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">JavaScript SDK</h4>
              <p className="mt-2 text-sm text-gray-600">
                Easy-to-use JavaScript SDK for web applications and Node.js projects.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">PY</span>
              </div>
              <h4 className="mt-4 text-lg font-medium text-gray-900">Python SDK</h4>
              <p className="mt-2 text-sm text-gray-600">
                Powerful Python SDK for data science, automation, and backend services.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a
              href="/docs"
              className="btn-primary"
            >
              View API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}