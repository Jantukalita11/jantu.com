'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Zap, ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <div className="bg-primary-600">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your audio content?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            Join thousands of creators who are already using Audio AI Studio to create 
            professional-quality voices and audio content. Start your free trial today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600 px-8"
              >
                Watch Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary-200">
            No credit card required • 10,000 free credits • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}