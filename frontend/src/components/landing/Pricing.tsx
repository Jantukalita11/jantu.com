'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check, Zap, Star, Building } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for trying out our platform',
    features: [
      '10k credits/month',
      'Text-to-Speech',
      'Speech-to-Text',
      'Studio access (limited)',
      'Conversational AI trial',
      'API access (low concurrency)',
      'Basic onboarding',
      'Community support',
    ],
    limitations: [
      'Watermarked audio',
      'No commercial license',
      'Limited voice selection',
    ],
    cta: 'Start Free',
    popular: false,
    tier: 'free',
  },
  {
    name: 'Starter',
    price: { monthly: 5, yearly: 50 },
    description: 'Great for individual creators',
    features: [
      '30k credits/month',
      'Everything in Free',
      'Commercial license',
      'Instant voice cloning',
      'Dubbing Studio',
      '20 Studio projects',
      'Music use for social/ads',
      'Email support',
    ],
    cta: 'Start Trial',
    popular: false,
    tier: 'starter',
  },
  {
    name: 'Creator',
    price: { monthly: 11, yearly: 110 },
    description: 'Perfect for content creators',
    features: [
      '100k credits/month',
      'Everything in Starter',
      'Professional voice cloning',
      'Usage-based billing for extra credits',
      'Higher-quality audio (192 kbps)',
      '50 Studio projects',
      'Advanced export options',
      'Priority email support',
    ],
    cta: 'Start Trial',
    popular: true,
    tier: 'creator',
  },
  {
    name: 'Pro',
    price: { monthly: 99, yearly: 990 },
    description: 'For professional studios',
    features: [
      '500k credits/month',
      'Everything in Creator',
      '44.1kHz PCM API output',
      'Higher concurrency',
      '100 Studio projects',
      'Advanced export options',
      'Priority email support',
      'Phone support',
    ],
    cta: 'Start Trial',
    popular: false,
    tier: 'pro',
  },
  {
    name: 'Scale',
    price: { monthly: 330, yearly: 3300 },
    description: 'For growing teams',
    features: [
      '2M credits/month + 3 seats',
      'Everything in Pro',
      'Multi-seat workspace',
      'Team admin controls',
      'Elevated concurrency',
      '200 Studio projects',
      'Team collaboration tools',
      'Dedicated support SLA',
    ],
    cta: 'Start Trial',
    popular: false,
    tier: 'scale',
  },
  {
    name: 'Business',
    price: { monthly: 1320, yearly: 13200 },
    description: 'For large organizations',
    features: [
      '11M credits/month + 5 seats',
      'Everything in Scale',
      'Low-latency TTS pricing',
      '3 professional voice clones',
      'Dedicated support SLA',
      '500 Studio projects',
      'Advanced analytics',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
    tier: 'business',
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For enterprise needs',
    features: [
      'Custom credits & seats',
      'Custom DPA/SLAs',
      'BAAs for HIPAA',
      'Custom SSO',
      'Elevated concurrency',
      'Managed dubbing',
      'Priority support',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    popular: false,
    tier: 'enterprise',
  },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Start free and scale as you grow. All plans include our core AI voice generation features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-16 flex justify-center">
          <div className="relative flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <Badge variant="success" className="ml-2">
                Save 17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:max-w-none lg:grid-cols-4 xl:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200 ${
                plan.popular ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                {plan.tier === 'enterprise' && (
                  <Building className="h-6 w-6 text-gray-400" />
                )}
              </div>
              
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>
              
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  {typeof plan.price[billingCycle] === 'number' ? '$' : ''}
                  {plan.price[billingCycle]}
                </span>
                {typeof plan.price[billingCycle] === 'number' && (
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </p>
              
              <Button
                className={`mt-6 w-full ${
                  plan.popular ? '' : 'variant-outline'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta === 'Start Free' && <Zap className="w-4 h-4 mr-2" />}
                {plan.cta}
              </Button>
              
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary-600" />
                    {feature}
                  </li>
                ))}
                {plan.limitations?.map((limitation) => (
                  <li key={limitation} className="flex gap-x-3 text-gray-400">
                    <span className="h-6 w-5 flex-none">×</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 rounded-2xl bg-gray-900 px-6 py-16 text-center lg:px-16">
          <h3 className="text-2xl font-bold text-white">
            Need something custom?
          </h3>
          <p className="mt-4 text-lg text-gray-300">
            We offer custom solutions for enterprise customers with specific requirements.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100">
              Schedule a Demo
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}