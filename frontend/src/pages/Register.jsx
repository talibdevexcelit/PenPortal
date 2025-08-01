import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/create');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        login(data.data.user, data.data.token);
        navigate('/create');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div
          className={`${
            isDarkMode
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-white/10 shadow-xl border border-black/20'
          } rounded-2xl p-8 transition-all duration-300`}
        >
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              Create your account
            </h2>
            <p
              className={`mt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Join our community today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                isDarkMode
                  ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
<div>
  <label
    htmlFor="name"
    className={`block text-sm font-medium mb-2 ${
      isDarkMode ? 'text-gray-200' : 'text-gray-900'
    }`}
  >
    Full Name
  </label>
  <div
    className={`relative ${
      isDarkMode
        ? 'bg-black/20 border-white/30 text-white'
        : 'bg-white/20 border-black/20 text-black'
    } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
  >
    <User
      className={`absolute left-3 top-3.5 h-5 w-5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
    <input
      id="name"
      name="name"
      type="text"
      required
      value={formData.name}
      onChange={handleChange}
      className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0
        ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'}
      `}
      placeholder="Enter your full name"
    />
  </div>
</div>

              {/* Email */}
<div>
  <label
    htmlFor="email"
    className={`block text-sm font-medium mb-2 ${
      isDarkMode ? 'text-gray-200' : 'text-gray-900'
    }`}
  >
    Email address
  </label>
  <div
    className={`relative ${
      isDarkMode
        ? 'bg-black/20 border-white/30 text-white'
        : 'bg-white/20 border-black/20 text-black'
    } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
  >
    <Mail
      className={`absolute left-3 top-3.5 h-5 w-5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
    <input
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      required
      value={formData.email}
      onChange={handleChange}
      className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0
        ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'}
      `}
      placeholder="Enter your email"
    />
  </div>
</div>

              {/* Password */}
<div>
  <label
    htmlFor="password"
    className={`block text-sm font-medium mb-2 ${
      isDarkMode ? 'text-gray-200' : 'text-gray-900'
    }`}
  >
    Password
  </label>
  <div
    className={`relative ${
      isDarkMode
        ? 'bg-black/20 border-white/30 text-white'
        : 'bg-white/20 border-black/20 text-black'
    } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
  >
    <Lock
      className={`absolute left-3 top-3 h-5 w-5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
    <input
      id="password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      value={formData.password}
      onChange={handleChange}
      minLength="6"
      className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0
        ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'}
      `}
      placeholder="Enter your password"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

              {/* Confirm Password */}
<div>
  <label
    htmlFor="confirmPassword"
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
    <Lock
      className={`absolute left-3 top-3 h-5 w-5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
    <input
      id="confirmPassword"
      name="confirmPassword"
      type={showConfirmPassword ? 'text' : 'password'}
      required
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0
        ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-600'}
      `}
      placeholder="Confirm your password"
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
    >
      {showConfirmPassword ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </button>
  </div>
</div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className={`h-4 w-4 mt-1 rounded border cursor-pointer ${
                  isDarkMode
                    ? 'border-gray-500 bg-gray-700 checked:bg-[#625080] focus:ring-[#625080]'
                    : 'border-gray-400 checked:bg-indigo-600 focus:ring-indigo-500'
                }`}
              />
              <label
                htmlFor="terms"
                className={`ml-2 block text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  className={`font-medium ${
                    isDarkMode ? 'text-[#625080] hover:text-[#7a649e]' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className={`font-medium ${
                    isDarkMode ? 'text-[#625080] hover:text-[#7a649e]' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white
                  ${
                    isDarkMode
                      ? 'bg-[#625080] hover:bg-[#7a649e] focus:ring-[#625080]'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all cursor-pointer`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className={`font-medium ${
                  isDarkMode
                    ? 'text-[#625080] hover:text-[#7a649e]'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;