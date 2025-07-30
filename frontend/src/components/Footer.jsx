import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isDarkMode } = useTheme(); // Use current theme

  return (
    <footer
      className={`mt-16 transition-colors duration-300
        ${
          isDarkMode
            ? 'bg-black/30 backdrop-blur-md border-t border-white/20'
            : 'bg-white/30 backdrop-blur-sm border-t border-gray-200'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className={`text-2xl font-bold mb-4 block ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              PenPortal
            </Link>
            <p
              className={`mb-6 max-w-md text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              A modern blogging platform for writers and readers. Share your thoughts and discover amazing content.
            </p>
            <div className="flex space-x-4">
              {/* Twitter */}
              <a
                href="#"
                className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="#"
                className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className={`transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Post
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4
            ${
              isDarkMode
                ? 'border-white/10 text-gray-400'
                : 'border-gray-200 text-gray-700'
            }`}
        >
          <p className="text-sm text-center md:text-left">
            &copy; {currentYear} PenPortal. All rights reserved.
          </p>
          <div className="text-sm text-center md:text-right">
            <p>Learning Backend</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;