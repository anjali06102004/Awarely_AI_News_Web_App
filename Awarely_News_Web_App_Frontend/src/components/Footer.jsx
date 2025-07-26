import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/awarely',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/awarely',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/anjali-kumari-4915a6253/',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/awarely',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.388 14.42c.583.583 1.297.972 2.12.972 1.65 0 2.973-1.323 2.973-2.973S10.158 9.446 8.508 9.446c-.823 0-1.537.389-2.12.972L5.121 9.151c.88-.807 2.031-1.297 3.328-1.297 2.65 0 4.797 2.146 4.797 4.797s-2.146 4.797-4.797 4.797zm7.424 0c-1.297 0-2.448-.49-3.328-1.297l1.267-1.267c.583.583 1.297.972 2.12.972 1.65 0 2.973-1.323 2.973-2.973s-1.323-2.973-2.973-2.973c-.823 0-1.537.389-2.12.972l-1.267-1.267c.88-.807 2.031-1.297 3.328-1.297 2.65 0 4.797 2.146 4.797 4.797s-2.146 4.797-4.797 4.797z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/anjali06102004',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Help Center', href: '/help' }
  ];

  const newsCategories = [
    { name: 'Technology', href: '/category/technology' },
    { name: 'Business', href: '/category/business' },
    { name: 'Science', href: '/category/science' },
    { name: 'Health', href: '/category/health' },
    { name: 'World News', href: '/category/world' }
  ];

  const resources = [
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Developer Tools', href: '/developers' },
    { name: 'Media Kit', href: '/media-kit' },
    { name: 'Careers', href: '/careers' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <GlobeAltIcon className="h-8 w-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Awarely
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your trusted source for AI-powered news analysis and global awareness. 
              We deliver accurate, unbiased reporting with cutting-edge technology.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <EnvelopeIcon className="h-4 w-4 mr-3 text-blue-400 flex-shrink-0" />
                <a href="mailto:contact@awarely.news" className="hover:text-blue-400 transition-colors">
                  contact@awarely.news
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <PhoneIcon className="h-4 w-4 mr-3 text-blue-400 flex-shrink-0" />
                <span>+91 7488975549</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MapPinIcon className="h-4 w-4 mr-3 text-blue-400 flex-shrink-0" />
                <span>Dhanbad, Jharkhand, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* News Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Categories</h3>
            <ul className="space-y-3">
              {newsCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href} 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-semibold mb-2 text-white">Daily News Digest</h4>
              <p className="text-xs text-gray-400 mb-3">Get AI-curated news delivered to your inbox</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-1 py-2 bg-gray-700 text-white text-sm rounded-l-md border border-gray-600 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
                <button className="px-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-r-md transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-white">Resources</h4>
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.name}>
                    <Link 
                      to={resource.href} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm"
                    >
                      {resource.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-sm">
              <span> {currentYear} Awarely News. Made with</span>
              <HeartIcon className="h-4 w-4 mx-1 text-red-500" />
              <span>for global awareness.</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-sm mr-3">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs max-w-4xl mx-auto">
              Awarely is committed to providing accurate, unbiased news coverage through AI-powered analysis. 
              All content is verified through multiple sources and fact-checking algorithms. 
              We respect your privacy and are committed to transparent journalism.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
