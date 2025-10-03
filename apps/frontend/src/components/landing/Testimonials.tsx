'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Podcast Producer',
    company: 'AudioCraft Studios',
    image: '👩‍💼',
    rating: 5,
    text: 'Audio AI Studio has completely transformed our production workflow. The voice quality is indistinguishable from human recordings, and the dubbing feature saves us weeks of work.',
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'TechStart Inc',
    image: '👨‍💻',
    rating: 5,
    text: 'We use Audio AI Studio to create localized ads in 15+ languages. The ROI has been incredible, and our global reach has tripled in just 6 months.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Audiobook Author',
    company: 'Independent Creator',
    image: '👩‍🎨',
    rating: 5,
    text: 'The voice cloning feature is a game-changer. I cloned my own voice and now I can produce audiobooks 10x faster while maintaining complete consistency.',
  },
  {
    name: 'David Kim',
    role: 'CTO',
    company: 'HealthTech Solutions',
    image: '👨‍⚕️',
    rating: 5,
    text: 'The HIPAA compliance and enterprise security features were essential for us. The API is robust, well-documented, and scales perfectly with our needs.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-gradient">Thousands</span> of Creators
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about Audio AI Studio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition card-hover"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>

              <div className="flex items-center">
                <div className="text-4xl mr-3">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
