'use client';

import { Check, Zap, Star, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out our platform',
    icon: Zap,
    features: [
      '10,000 credits/month',
      'Text-to-Speech',
      'Speech-to-Text',
      'Studio access (limited)',
      'Conversational AI trial',
      'API access (low concurrency)',
      'Basic onboarding',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$5',
    period: '/month',
    description: 'For individuals and hobbyists',
    icon: Star,
    features: [
      '30,000 credits/month',
      'Everything in Free',
      'Commercial license',
      'Instant voice cloning',
      'Dubbing Studio',
      '20 Studio projects',
      'Music for social/ads',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '$11',
    period: '/month',
    description: 'For content creators and small teams',
    icon: Crown,
    features: [
      '100,000 credits/month',
      'Everything in Starter',
      'Professional voice cloning',
      'Usage-based billing',
      'Higher-quality audio (192 kbps)',
      'Advanced export options',
      'Priority email support',
    ],
    cta: 'Start Creating',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For professionals and agencies',
    icon: Crown,
    features: [
      '500,000 credits/month',
      'Everything in Creator',
      '44.1kHz PCM API output',
      'Higher API concurrency',
      'Batch processing',
      'Custom voice training',
      'Priority support',
    ],
    cta: 'Go Pro',
    highlighted: false,
  },
  {
    name: 'Scale',
    price: '$330',
    period: '/month',
    description: 'For growing teams',
    icon: Crown,
    features: [
      '2M credits/month',
      '3 seats included',
      'Everything in Pro',
      'Multi-seat workspace',
      'Team admin controls',
      'Elevated concurrency',
      'Usage analytics',
    ],
    cta: 'Scale Up',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$1,320',
    period: '/month',
    description: 'For large organizations',
    icon: Crown,
    features: [
      '11M credits/month',
      '5 seats included',
      'Everything in Scale',
      'Low-latency TTS',
      '3 professional voice clones',
      'Dedicated support SLA',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale deployments',
    icon: Crown,
    features: [
      'Custom credits & seats',
      'Everything in Business',
      'HIPAA BAA compliance',
      'Custom SSO/SCIM',
      'Elevated concurrency',
      'Managed dubbing',
      'Priority support',
      'Custom SLAs & DPA',
    ],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.slice(0, 4).map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 transition card-hover ${
                plan.highlighted
                  ? 'border-primary-500 shadow-xl'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <plan.icon
                  className={`h-8 w-8 mb-4 ${plan.highlighted ? 'text-primary-600' : 'text-gray-600'}`}
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.slice(4).map((plan, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white card-hover"
            >
              <div className="mb-6">
                <plan.icon className="h-8 w-8 mb-4 text-primary-400" />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
