import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Cookie, ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12">
      <div
        className={`max-w-3xl w-full ${
          isDarkMode
            ? 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-100'
            : 'bg-white/10 shadow-xl border border-black/20 text-gray-800'
        } rounded-2xl p-8 transition-all duration-300`}
      >
        <Link
          to="/register"
          className={`flex items-center text-sm mb-6 ${
            isDarkMode
              ? 'text-[#7a649e] hover:text-white'
              : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Register
        </Link>

        <div className="flex items-center mb-6">
          <Cookie className="h-8 w-8 mr-3 text-[#625080]" />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            Cookie Policy
          </h1>
        </div>

        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help us recognize your browser and remember your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Types of Cookies We Use</h2>
            <ul className="space-y-3">
              <li>
                <strong>Essential Cookies:</strong> Necessary for the website to function properly (e.g., login sessions).
              </li>
              <li>
                <strong>Performance Cookies:</strong> Collect anonymous data about how visitors use our site (e.g., Google Analytics).
              </li>
              <li>
                <strong>Functionality Cookies:</strong> Remember your choices (like theme preference) to improve your experience.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> Used to deliver relevant ads (we do not currently use third-party ads).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Managing Cookies</h2>
            <p>
              You can control or disable cookies through your browser settings. Disabling essential cookies may affect site functionality.
            </p>
            <p className="mt-2">
              Learn how: <a href="https://www.allaboutcookies.org" className="text-[#625080] underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Consent</h2>
            <p>
              By using our website, you consent to our use of cookies as described in this policy. We may use a cookie banner in the future to manage consent explicitly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Changes to This Policy</h2>
            <p>
              We may update this policy to reflect changes in our practices or regulatory requirements. We will notify users of material changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;