'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlayIcon, MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'

export function Hero() {
  const [demoText, setDemoText] = useState('Hello! I am an AI-generated voice that sounds incredibly human. Listen to how natural and expressive I can be.')

  const handleDemo = async () => {
    // Simulate TTS demo
    console.log('Playing demo with text:', demoText)
  }

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Ultra-realistic{' '}
                <span className="text-gradient">AI voices</span>{' '}
                in 32+ languages
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Create professional voice content with our advanced AI technology. 
                Generate speech, clone voices, dub videos, and transcribe audio with 
                industry-leading quality and speed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                <Link href="/signup" className="btn-primary text-lg px-8 py-3">
                  Start free trial
                </Link>
                <button
                  onClick={handleDemo}
                  className="btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2"
                >
                  <PlayIcon className="h-5 w-5" />
                  Try demo
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  10k free credits
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Cancel anytime
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:col-span-6 lg:mt-0">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Try our AI voices
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter text to convert to speech
                    </label>
                    <textarea
                      value={demoText}
                      onChange={(e) => setDemoText(e.target.value)}
                      className="input h-24 resize-none"
                      placeholder="Type your text here..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice
                      </label>
                      <select className="input">
                        <option>Rachel (Female, US)</option>
                        <option>Adam (Male, US)</option>
                        <option>Emma (Female, UK)</option>
                        <option>David (Male, UK)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="input">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDemo}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <SpeakerWaveIcon className="h-5 w-5" />
                    Generate & Play
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Credits used: 0</span>
                    <span>Duration: 0s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust indicators */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Trusted by creators worldwide
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
              {['Spotify', 'Netflix', 'Adobe', 'Microsoft', 'Google', 'Meta'].map((company) => (
                <div key={company} className="flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-400">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}