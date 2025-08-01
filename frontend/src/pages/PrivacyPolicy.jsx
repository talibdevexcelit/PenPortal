import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <Shield className="h-8 w-8 mr-3 text-[#625080]" />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            Privacy Policy
          </h1>
        </div>

        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p>We collect the following data:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Personal Information:</strong> Name, email address, and password.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages viewed, and time spent.</li>
              <li><strong>Cookies:</strong> We use cookies to enhance user experience (see Cookie Policy).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Provide and maintain our service</li>
              <li>Authenticate and secure your account</li>
              <li>Improve and personalize user experience</li>
              <li>Send service-related communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your personal data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Data Sharing</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share data only with trusted service providers who assist in operating our platform, under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Access and update your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at <a href="mailto:support@yourapp.com" className="text-[#625080] underline">support@yourapp.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, unless required by law to retain it longer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;