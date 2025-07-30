import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        const { id, name, email, role } = data.data;
        login({ id, name, email, role }, data.data.token);

        // Small delay to ensure persistence
        setTimeout(() => {
          navigate('/create');
        }, 100);
      } else {
        setError(data.message || 'Login failed');
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
              Sign in to your account
            </h2>
            <p
              className={`mt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Welcome back! Please enter your details
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
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                    ${
                      isDarkMode
                        ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]/50'
                        : 'bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                    ${
                      isDarkMode
                        ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]/50'
                        : 'bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded border cursor-pointer ${
                    isDarkMode
                      ? 'border-gray-500 bg-gray-700 checked:bg-[#625080] focus:ring-[#625080]'
                      : 'border-gray-400 checked:bg-indigo-600 focus:ring-indigo-500'
                  }`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className={`text-sm font-medium cursor-pointer ${
                  isDarkMode
                    ? 'text-[#625080] hover:text-[#7a649e]'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                Forgot your password?
              </Link>
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
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`font-medium ${
                    isDarkMode
                      ? 'text-[#625080] hover:text-[#7a649e]'
                      : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;