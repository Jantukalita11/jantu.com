'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Podcast Producer',
    company: 'Storyteller Media',
    content: 'Audio AI Studio transformed our podcast production. The voice cloning feature lets us maintain consistency across episodes, and the quality is indistinguishable from human voices.',
    rating: 5,
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Content Creator',
    company: 'YouTube (2M subscribers)',
    content: 'The dubbing studio is incredible. I can now create content in multiple languages without hiring voice actors. My international audience has grown by 300%.',
    rating: 5,
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'We use Audio AI Studio for all our marketing videos and ads. The API integration was seamless, and we\'ve reduced our audio production costs by 80%.',
    rating: 5,
    avatar: 'EW',
  },
  {
    name: 'David Kim',
    role: 'Audiobook Producer',
    company: 'AudioWorks Studio',
    content: 'The professional voice cloning feature is a game-changer for audiobook production. We can maintain narrator consistency even when schedules conflict.',
    rating: 5,
    avatar: 'DK',
  },
  {
    name: 'Lisa Thompson',
    role: 'E-learning Developer',
    company: 'EduTech Solutions',
    content: 'Creating multilingual courses is now effortless. The speech-to-text and dubbing features help us localize content quickly and affordably.',
    rating: 5,
    avatar: 'LT',
  },
  {
    name: 'Alex Johnson',
    role: 'Game Developer',
    company: 'Indie Game Studio',
    content: 'Perfect for indie game development. We can create diverse character voices without breaking the budget. The API makes integration into our workflow seamless.',
    rating: 5,
    avatar: 'AJ',
  },
];

export function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by creators worldwide
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl bg-gray-50 p-8 text-sm leading-6"
              >
                <div className="flex gap-x-1 text-yellow-400 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-900">
                  <p>&ldquo;{testimonial.content}&rdquo;</p>
                </blockquote>
                
                <figcaption className="mt-6 flex items-center gap-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </figcaption>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}