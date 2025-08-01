import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12">
      <div
        className={`max-w-3xl w-full ${
          isDarkMode
            ? 'bg-black/70 backdrop-blur-md border border-white/20 text-gray-100'
            : 'bg-white/70 shadow-xl border border-black/20 text-gray-800'
        } rounded-2xl p-8 transition-all duration-300`}
      >
        {/* Back Button */}
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
          <FileText className="h-8 w-8 mr-3 text-[#625080]" />
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            Terms and Conditions
          </h1>
        </div>

        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Prohibited Activities</h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Violate any laws or regulations</li>
              <li>Engage in fraudulent or harmful behavior</li>
              <li>Transmit viruses or malicious code</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, if you breach these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We will notify users of significant changes via email or in-app notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;