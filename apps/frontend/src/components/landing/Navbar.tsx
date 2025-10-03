'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Mic2 } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
              <Mic2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Audio AI Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-primary-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary-600 transition">
              Pricing
            </Link>
            <Link href="#api" className="text-gray-700 hover:text-primary-600 transition">
              API
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-primary-600 transition">
              Docs
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="#features"
              className="block text-gray-700 hover:text-primary-600 transition py-2"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block text-gray-700 hover:text-primary-600 transition py-2"
            >
              Pricing
            </Link>
            <Link
              href="#api"
              className="block text-gray-700 hover:text-primary-600 transition py-2"
            >
              API
            </Link>
            <Link
              href="/docs"
              className="block text-gray-700 hover:text-primary-600 transition py-2"
            >
              Docs
            </Link>
            <Link
              href="/login"
              className="block text-gray-700 hover:text-primary-600 transition py-2 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 transition font-medium text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
