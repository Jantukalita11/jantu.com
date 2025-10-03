'use client';

import { useState } from 'react';
import { Play, Sparkles, Globe, Zap } from 'lucide-react';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDemoPlay = () => {
    setIsPlaying(true);
    // Play demo audio logic here
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Ultra-Realistic AI Voice Technology</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
            Create{' '}
            <span className="text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Human-Like Voices
            </span>
            <br />
            in Seconds
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            Professional AI voice generation, instant voice cloning, and dubbing studio for
            creators, businesses, and enterprises. 32+ languages, ultra-low latency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-300">
              View Pricing
            </button>
          </div>

          {/* Demo Audio Player */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDemoPlay}
                  className="bg-primary-600 text-white p-4 rounded-full hover:bg-primary-700 transition"
                  disabled={isPlaying}
                >
                  <Play className="h-6 w-6" fill="currentColor" />
                </button>
                <div>
                  <p className="font-semibold text-gray-900">Try Demo Voice</p>
                  <p className="text-sm text-gray-500">
                    "Welcome to Audio AI Studio, where your words come to life."
                  </p>
                </div>
              </div>
            </div>

            {/* Waveform visualization placeholder */}
            <div className="h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              {isPlaying ? (
                <div className="flex items-center space-x-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary-600 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 20}px`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Click play to hear demo</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-primary-600 mr-2" />
                <p className="text-4xl font-bold text-gray-900">32+</p>
              </div>
              <p className="text-gray-600">Languages Supported</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-primary-600 mr-2" />
                <p className="text-4xl font-bold text-gray-900">&lt;300ms</p>
              </div>
              <p className="text-gray-600">Average Latency</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-primary-600 mr-2" />
                <p className="text-4xl font-bold text-gray-900">99.9%</p>
              </div>
              <p className="text-gray-600">Voice Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
