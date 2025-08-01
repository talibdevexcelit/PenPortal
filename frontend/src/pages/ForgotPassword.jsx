// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Key, Check, ArrowLeft, EyeOff, Eye, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Set base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [token, setToken] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract token from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setEmailSent(true);
      handleTokenVerification(null, tokenFromUrl);
    }
  }, [location]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      setLoading(false);
      setEmailSent(true);
      toast.success(data.message || 'Password reset email sent successfully');
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || 'Failed to send password reset email'
      );
    }
  };

  const handleTokenVerification = async (e, tokenParam) => {
    if (e) e.preventDefault();

    const tokenToVerify = tokenParam || token;

    if (!tokenToVerify) {
      toast.error('Please enter the verification token');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/auth/verify-reset-token/${tokenToVerify}`);
      setLoading(false);
      setShowResetForm(true);
      toast.success(data.message || 'Token verified successfully');
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || 'Invalid or expired token'
      );
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/reset-password', {
        token,
        password: newPassword,
      });
      setLoading(false);
      setResetSuccess(true);
      toast.success(data.message || 'Password reset successfully');
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || 'Failed to reset password'
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div
          className={`${
            isDarkMode
              ? 'bg-black/70 backdrop-blur-md border border-white/20'
              : 'bg-white/70 shadow-xl border border-black/20'
          } rounded-2xl p-8 transition-all duration-300`}
        >
          {/* Back Link */}
          <Link
            to="/login"
            className={`flex items-center text-sm mb-6 ${
              isDarkMode
                ? 'text-[#7a649e] hover:text-white'
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              {resetSuccess
                ? 'Password Reset Successful'
                : showResetForm
                ? 'Reset Your Password'
                : emailSent
                ? 'Verify Token'
                : 'Forgot Password'}
            </h2>
            <p
              className={`mt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              {resetSuccess
                ? 'Your password has been updated.'
                : showResetForm
                ? 'Enter your new password'
                : emailSent
                ? 'Enter the token sent to your email'
                : 'We’ll send you a link to reset it'}
            </p>
          </div>

          {resetSuccess ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <Check className="w-16 h-16 text-green-500" />
                </div>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your password has been reset successfully.
                </p>
                <Link
                  to="/login"
                  className={`w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white ${
                    isDarkMode
                      ? 'bg-[#625080] hover:bg-[#7a649e]'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition-colors`}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : showResetForm ? (
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  New Password
                </label>
                <div
                  className={`relative ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white'
                      : 'bg-white/20 border-black/20 text-black'
                  } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
                >
                  <Lock className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0 ${
                      isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  Confirm Password
                </label>
                <div
                  className={`relative ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white'
                      : 'bg-white/20 border-black/20 text-black'
                  } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
                >
                  <Lock className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0 ${
                      isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#625080] hover:bg-[#7a649e] focus:ring-[#625080]'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : emailSent ? (
            <form className="space-y-6" onSubmit={handleTokenVerification}>
              <div>
                <label
                  htmlFor="token"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  Verification Token
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white placeholder-gray-400'
                      : 'bg-white/20 border-black/20 text-black placeholder-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#625080]`}
                  placeholder="Enter token from your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white ${
                  isDarkMode
                    ? 'bg-[#625080] hover:bg-[#7a649e] focus:ring-[#625080]'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
              >
                {loading ? 'Verifying...' : 'Verify Token'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  Email Address
                </label>
                <div
                  className={`relative ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white'
                      : 'bg-white/20 border-black/20 text-black'
                  } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
                >
                  <Mail className={`absolute left-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0 ${
                      isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-sm font-medium text-white ${
                  isDarkMode
                    ? 'bg-[#625080] hover:bg-[#7a649e] focus:ring-[#625080]'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all`}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;