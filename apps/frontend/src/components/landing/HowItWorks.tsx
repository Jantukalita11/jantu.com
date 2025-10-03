'use client';

import { FileText, Mic, Download, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Enter Your Text',
    description: 'Type or paste your script, or upload documents for batch processing.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Mic,
    title: 'Choose a Voice',
    description: 'Select from 100+ voices or clone your own in seconds.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Sparkles,
    title: 'Customize & Generate',
    description: 'Adjust speed, pitch, emotion, and generate ultra-realistic audio.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Download,
    title: 'Export & Use',
    description: 'Download in multiple formats or use via API in your applications.',
    color: 'bg-green-100 text-green-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional voice-overs in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`${step.color} p-4 rounded-lg w-fit mb-4`}>
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="text-gray-300 text-3xl">→</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
