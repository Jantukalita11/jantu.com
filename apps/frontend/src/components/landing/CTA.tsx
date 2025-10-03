'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Start Your Free Trial Today</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Transform Your Audio?
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of creators, businesses, and enterprises using Audio AI Studio to create
          ultra-realistic voices at scale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl flex items-center">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition">
            Schedule Demo
          </button>
        </div>

        <p className="text-white/80 mt-6 text-sm">
          No credit card required • 10,000 free credits • Cancel anytime
        </p>
      </div>
    </section>
  );
}
