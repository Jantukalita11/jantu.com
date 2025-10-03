'use client';

import Link from 'next/link';
import { Mic2, Twitter, Github, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api' },
    { name: 'Docs', href: '/docs' },
    { name: 'Changelog', href: '/changelog' },
  ],
  'Use Cases': [
    { name: 'Podcasting', href: '/use-cases/podcasting' },
    { name: 'Audiobooks', href: '/use-cases/audiobooks' },
    { name: 'Video Dubbing', href: '/use-cases/dubbing' },
    { name: 'E-learning', href: '/use-cases/elearning' },
    { name: 'Gaming', href: '/use-cases/gaming' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Partners', href: '/partners' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'DPA', href: '/dpa' },
    { name: 'Compliance', href: '/compliance' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <Mic2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Audio AI</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Ultra-realistic AI voice generation and cloning platform for creators and enterprises.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                className="text-gray-400 hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                className="text-gray-400 hover:text-white transition"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 Audio AI Studio. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <span className="text-sm text-gray-400">SOC2 Compliant</span>
            <span className="text-sm text-gray-400">GDPR Ready</span>
            <span className="text-sm text-gray-400">HIPAA Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
