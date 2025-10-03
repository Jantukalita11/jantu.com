import { CheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const tiers = [
  {
    name: 'Free',
    id: 'free',
    href: '/signup',
    priceMonthly: 0,
    description: 'Perfect for trying out our AI voices',
    features: [
      '10k credits/month',
      'TTS & STT access',
      'Studio access (limited)',
      'Conversational AI trial',
      'API access (low concurrency)',
      'Basic onboarding',
    ],
    mostPopular: false,
  },
  {
    name: 'Starter',
    id: 'starter',
    href: '/signup?plan=starter',
    priceMonthly: 5,
    description: 'Great for individual creators',
    features: [
      '30k credits/month',
      'Everything in Free',
      'Commercial license',
      'Instant voice cloning',
      'Dubbing Studio',
      '20 Studio projects',
      'Music use for social/ads',
    ],
    mostPopular: false,
  },
  {
    name: 'Creator',
    id: 'creator',
    href: '/signup?plan=creator',
    priceMonthly: 11,
    description: 'Perfect for content creators',
    features: [
      '100k credits/month',
      'Everything in Starter',
      'Professional voice cloning',
      'Usage-based billing',
      'Higher quality audio (192 kbps)',
    ],
    mostPopular: true,
  },
  {
    name: 'Pro',
    id: 'pro',
    href: '/signup?plan=pro',
    priceMonthly: 99,
    description: 'For professional studios',
    features: [
      '500k credits/month',
      'Everything in Creator',
      '44.1kHz PCM API output',
      'Higher concurrency',
      'Advanced export options',
      'Priority email support',
    ],
    mostPopular: false,
  },
  {
    name: 'Scale',
    id: 'scale',
    href: '/signup?plan=scale',
    priceMonthly: 330,
    description: 'For growing teams',
    features: [
      '2M credits/month + 3 seats',
      'Everything in Pro',
      'Multi-seat workspace',
      'Team admin controls',
      'Elevated concurrency',
    ],
    mostPopular: false,
  },
  {
    name: 'Business',
    id: 'business',
    href: '/signup?plan=business',
    priceMonthly: 1320,
    description: 'For enterprise teams',
    features: [
      '11M credits/month + 5 seats',
      'Everything in Scale',
      'Low-latency TTS pricing',
      '3 professional voice clones',
      'Dedicated support SLA',
    ],
    mostPopular: false,
  },
]

export function Pricing() {
  return (
    <div id="pricing" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`card relative ${
                tier.mostPopular ? 'ring-2 ring-primary-500 shadow-lg' : ''
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="card-body">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${tier.priceMonthly}</span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                
                <ul className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link
                    href={tier.href}
                    className={`w-full ${
                      tier.mostPopular ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {tier.priceMonthly === 0 ? 'Get started' : 'Choose plan'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enterprise */}
        <div className="mt-20 text-center">
          <div className="card max-w-2xl mx-auto">
            <div className="card-body">
              <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
              <p className="mt-4 text-lg text-gray-600">
                Custom solutions for large organizations with specific requirements.
              </p>
              <div className="mt-6">
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Custom credits & seats
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Custom DPA/SLAs
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    BAAs for HIPAA
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Custom SSO
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Elevated concurrency
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Managed dubbing
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                    Priority support
                  </li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/contact" className="btn-primary">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-900">What are credits?</h4>
              <p className="mt-2 text-gray-600">
                Credits are our usage-based billing unit. Roughly 1 credit = 100 characters of TTS or 1 minute of STT.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Can I change plans anytime?</h4>
              <p className="mt-2 text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Do you offer refunds?</h4>
              <p className="mt-2 text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Is there an API?</h4>
              <p className="mt-2 text-gray-600">
                Yes! We provide a comprehensive REST API and SDKs for JavaScript and Python.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}