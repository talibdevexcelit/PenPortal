import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/create");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        const { id, name, email, role } = data.data;
        login({ id, name, email, role }, data.data.token);

        // Small delay to ensure persistence
        setTimeout(() => {
          navigate("/create");
        }, 100);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    setResetLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        setResetSuccess(true);
        // Close modal after a delay
        setTimeout(() => {
          setShowForgotPasswordModal(false);
          setResetEmail("");
          setResetSuccess(false);
          // Navigate to the forgot password page with the token
          navigate(`/forgot-password?token=${data.data.resetToken}`);
        }, 3000);
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div
          className={`${
            isDarkMode
              ? "bg-white/10 backdrop-blur-md border border-white/20"
              : "bg-white/10 shadow-xl border border-black/20"
          } rounded-2xl p-8 transition-all duration-300`}
        >
          <div className="text-center mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Sign in to your account
            </h2>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
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
                  ? "bg-red-500/20 border border-red-500/30 text-red-200"
                  : "bg-red-50 border border-red-200 text-red-700"
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
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Email address
                </label>
                <div
                  className={`relative ${
                    isDarkMode
                      ? "bg-black/20 border-white/30 text-white"
                      : "bg-white/20 border-black/20 text-black"
                  } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
                >
                  <Mail
                    className={`absolute left-3 top-3.5 h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
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
        ${
          isDarkMode
            ? "text-white placeholder-gray-400"
            : "text-black placeholder-gray-600"
        }
      `}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Password
                </label>
                <div
                  className={`relative flex items-center ${
                    isDarkMode
                      ? "bg-black/20 border-white/30 text-white"
                      : "bg-white/20 border-black/20 text-black"
                  } border rounded-lg focus-within:ring-2 focus-within:ring-[#625080]`}
                >
                  <Lock
                    className={`absolute left-3 h-5 w-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-10 py-3 rounded-lg border-0 bg-transparent focus:outline-none focus:ring-0
        ${
          isDarkMode
            ? "text-white placeholder-gray-400"
            : "text-black placeholder-gray-600"
        }
      `}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
                      ? "border-gray-500 bg-gray-700 checked:bg-[#625080] focus:ring-[#625080]"
                      : "border-gray-400 checked:bg-indigo-600 focus:ring-indigo-500"
                  }`}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className={`text-sm font-medium cursor-pointer ${
                  isDarkMode
                    ? "text-[#625080] hover:text-[#7a649e]"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                Forgot your password?
              </button>
              
              {/* Forgot Password Modal */}
               {showForgotPasswordModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                   <div className={`${isDarkMode ? 'bg-black border border-white/20' : 'bg-neutral-200 border border-gray-200'} rounded-lg shadow-xl p-6 w-full max-w-sm`}>
                     {resetSuccess ? (
                       <div className="text-center">
                         <div className="mb-4 flex justify-center">
                           <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                           </svg>
                         </div>
                         <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Email Sent!</h3>
                         <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                           We've sent a password reset link to your email. You'll be redirected to the reset page shortly.
                         </p>
                       </div>
                     ) : (
                       <>
                         <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reset Password</h3>
                         <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enter your email address and we'll send you a link to reset your password.</p>
                         
                         {error && (
                           <div className={`mb-4 p-3 rounded-lg text-sm ${isDarkMode ? 'bg-red-500/20 border border-red-500/30 text-red-200' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                             {error}
                           </div>
                         )}
                         
                         <div className="mb-4">
                           <label htmlFor="reset-email" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Email address</label>
                           <input
                             id="reset-email"
                             type="email"
                             className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-black/20 border-white/30 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-none focus:ring-2 focus:ring-[#625080]`}
                             placeholder="Enter your email"
                             value={resetEmail}
                             onChange={(e) => setResetEmail(e.target.value)}
                           />
                         </div>
                         
                         <div className="flex justify-end space-x-3">
                           <button
                             type="button"
                             onClick={() => {
                               setShowForgotPasswordModal(false);
                               setResetEmail('');
                               setError('');
                             }}
                             className={`px-4 py-2 rounded-md cursor-pointer ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                           >
                             Cancel
                           </button>
                           <button
                             type="button"
                             onClick={handlePasswordReset}
                             className={`px-4 py-2 rounded-md text-white cursor-pointer ${isDarkMode ? 'bg-[#625080] hover:bg-[#7a649e]' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                             disabled={resetLoading}
                           >
                             {resetLoading ? 'Sending...' : 'Send Reset Link'}
                           </button>
                         </div>
                       </>
                     )}
                   </div>
                 </div>
               )}

            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white
                  ${
                    isDarkMode
                      ? "bg-[#625080] hover:bg-[#7a649e] focus:ring-[#625080]"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
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
                        strokeWidth={4}
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
                  "Sign in"
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className={`font-medium ${
                    isDarkMode
                      ? "text-[#625080] hover:text-[#7a649e]"
                      : "text-indigo-600 hover:text-indigo-800"
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
