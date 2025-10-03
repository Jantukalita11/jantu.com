const testimonials = [
  {
    content: "Audio AI Studio has revolutionized our podcast production. The voice quality is indistinguishable from human speakers, and the voice cloning feature saved us weeks of recording time.",
    author: {
      name: 'Sarah Chen',
      role: 'Podcast Producer',
      company: 'TechTalk Media',
      avatar: '/avatars/sarah.jpg',
    },
  },
  {
    content: "We use Audio AI Studio for all our e-learning content. The multilingual support and natural-sounding voices make our courses accessible to students worldwide.",
    author: {
      name: 'Marcus Rodriguez',
      role: 'E-Learning Director',
      company: 'EduTech Solutions',
      avatar: '/avatars/marcus.jpg',
    },
  },
  {
    content: "The API integration was seamless. We built voice features into our app in just a few days. The documentation is excellent and the support team is incredibly responsive.",
    author: {
      name: 'Emily Watson',
      role: 'CTO',
      company: 'VoiceFlow',
      avatar: '/avatars/emily.jpg',
    },
  },
  {
    content: "As a content creator, I love how easy it is to create different voices for my characters. The voice cloning feature lets me maintain consistency across all my content.",
    author: {
      name: 'David Kim',
      role: 'Content Creator',
      company: 'StoryCraft Studios',
      avatar: '/avatars/david.jpg',
    },
  },
  {
    content: "The dubbing studio is a game-changer for our international content. We can now localize our videos in multiple languages without the cost and complexity of traditional dubbing.",
    author: {
      name: 'Lisa Thompson',
      role: 'Marketing Manager',
      company: 'Global Media Co',
      avatar: '/avatars/lisa.jpg',
    },
  },
  {
    content: "Enterprise security was our main concern, but Audio AI Studio's HIPAA compliance and SSO integration made it easy to get approval from our security team.",
    author: {
      name: 'James Wilson',
      role: 'IT Director',
      company: 'HealthTech Inc',
      avatar: '/avatars/james.jpg',
    },
  },
]

export function Testimonials() {
  return (
    <div className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by creators worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See what our customers are saying about Audio AI Studio
          </p>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote>
                  <p className="text-gray-900">"{testimonial.content}"</p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.author.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.author.role} at {testimonial.author.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Audio Files Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">32+</div>
              <div className="text-sm text-gray-600">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Uptime SLA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}