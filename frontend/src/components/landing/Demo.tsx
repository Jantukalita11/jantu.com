'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Play, Pause, Volume2, Download } from 'lucide-react';

const demoVoices = [
  {
    id: 'sarah',
    name: 'Sarah',
    description: 'Professional female voice, American English',
    gender: 'Female',
    accent: 'American',
    previewText: 'Welcome to Audio AI Studio. Create ultra-realistic voices with our advanced AI technology.',
  },
  {
    id: 'james',
    name: 'James',
    description: 'Warm male voice, British English',
    gender: 'Male',
    accent: 'British',
    previewText: 'Transform your content with professional voice generation and cloning capabilities.',
  },
  {
    id: 'maria',
    name: 'Maria',
    description: 'Energetic female voice, Spanish accent',
    gender: 'Female',
    accent: 'Spanish',
    previewText: 'Crea voces ultra-realistas con nuestra tecnología de inteligencia artificial avanzada.',
  },
  {
    id: 'hiroshi',
    name: 'Hiroshi',
    description: 'Clear male voice, Japanese English',
    gender: 'Male',
    accent: 'Japanese',
    previewText: 'Experience the future of voice generation with our comprehensive audio studio.',
  },
];

export function Demo() {
  const [selectedVoice, setSelectedVoice] = useState(demoVoices[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customText, setCustomText] = useState('Enter your text here to hear it in any voice...');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
    setTimeout(() => setIsPlaying(false), 3000); // Simulate 3-second audio
  };

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Try Our Voices
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Experience the quality of our AI voices. Select a voice and hear the difference.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <Card className="p-8">
            <CardContent className="p-0">
              {/* Voice Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose a Voice
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {demoVoices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        selectedVoice.id === voice.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{voice.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {voice.gender} • {voice.accent}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Enter Text to Generate
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="Type your message here..."
                  maxLength={500}
                />
                <div className="text-sm text-gray-500 mt-2">
                  {customText.length}/500 characters
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedVoice.name} - {selectedVoice.description}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Preview: &quot;{selectedVoice.previewText}&quot;
                    </p>
                  </div>
                  <Volume2 className="h-6 w-6 text-gray-400" />
                </div>

                {/* Waveform Visualization (Mock) */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center h-16 space-x-1">
                    {Array.from({ length: 50 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-primary-500 rounded-full transition-all duration-75 ${
                          isPlaying && i < 25 ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{
                          height: `${Math.random() * 40 + 10}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="w-12 h-12 rounded-full p-0"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5 ml-0.5" />
                      )}
                    </Button>
                    <div className="text-sm text-gray-600">
                      {isPlaying ? 'Playing...' : 'Ready to play'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm">
                      Generate New
                    </Button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to create your own voices?
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign up for free and get 10,000 credits to start generating professional audio.
                </p>
                <Button size="lg">
                  Start Creating Free
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}