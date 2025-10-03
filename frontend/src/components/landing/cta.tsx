import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export function CTA() {
  return (
    <div className="bg-primary-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to create amazing audio content?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of creators who are already using Audio AI Studio to bring their ideas to life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Start your free trial
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 transition-colors duration-200"
            >
              Talk to sales
            </Link>
          </div>
          <p className="mt-4 text-sm text-primary-100">
            No credit card required • 10k free credits • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}