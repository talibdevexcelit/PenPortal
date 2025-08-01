import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, User, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = isAuthenticated() && user?.role === "admin";
  const logoLink = isAdmin ? "/admin" : "/";

  // Unified button class for consistent styling
  const navLinkClass = (isActive = false) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
    ${
      isActive
        ? isDarkMode
          ? "bg-white/20 text-white"
          : "bg-indigo-100 text-indigo-800"
        : isDarkMode
        ? "text-gray-300 hover:text-white hover:bg-white/10"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300
        ${
          isDarkMode
            ? "bg-black/40 border-white/20 text-white"
            : "bg-white/70 border-gray-200 text-black shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={logoLink}
            className={`text-2xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-black"
            } transition-colors`}
          >
            PenPortal
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Public Links (non-admin only) */}
            {!isAdmin && (
              <div className="flex items-center space-x-1">
                <Link
                  to="/"
                  className={navLinkClass(window.location.pathname === "/")}
                >
                  Home
                </Link>
                <Link
                  to="/posts"
                  className={navLinkClass(
                    window.location.pathname === "/posts"
                  )}
                >
                  Posts
                </Link>
              </div>
            )}

            {/* Authenticated User: Show Dropdown on Hover */}
            {isAuthenticated() ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer
                    ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <User size={18} />
                  <span>{user.name}</span>
                  {/* Dropdown Caret */}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className={`absolute -right-3 mt-0.5 w-40 rounded-xl shadow-xl ring-1
                      ${
                        isDarkMode
                          ? "bg-black/30 ring-white/10 text-gray-200"
                          : "bg-white/30 ring-black/5 text-gray-700"
                      } 
                      overflow-hidden z-50`}
                  >
                    <div className="">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className={navLinkClass(
                            window.location.pathname === "/admin"
                          )}
                        >
                          Admin Dashboard
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/create"
                            className={navLinkClass(
                              window.location.pathname === "/create"
                            )}
                          >
                            Create Post
                          </Link>
                          <Link
                            to="/profile"
                            className={navLinkClass(
                              window.location.pathname === "/profile"
                            )}
                          >
                            Profile
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer
                          ${
                            isDarkMode
                              ? "text-red-300 hover:bg-red-900/30"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Links */
              <div className="flex items-center space-x-1">
                <Link
                  to="/login"
                  className={navLinkClass(
                    window.location.pathname === "/login"
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold
                    ${
                      isDarkMode
                        ? "bg-[#625080] hover:bg-[#584775] text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer
                ${
                  isDarkMode
                    ? "text-yellow-300 hover:bg-yellow-500/20"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode ? "text-yellow-300" : "text-indigo-600"
              }`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md
                ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden border-t transition-all duration-300 ease-in-out
            ${
              isDarkMode
                ? "bg-black/40 border-white/20"
                : "bg-white/80 border-gray-200"
            }`}
        >
          <div className="px-4 pt-3 pb-4 space-y-2">
            {!isAdmin && (
              <>
                <Link
                  to="/"
                  className={navLinkClass(window.location.pathname === "/")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/posts"
                  className={navLinkClass(
                    window.location.pathname === "/posts"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Posts
                </Link>
              </>
            )}

            {isAuthenticated() ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className={navLinkClass(
                      window.location.pathname === "/admin"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🛠️ Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/create"
                      className={navLinkClass(
                        window.location.pathname === "/create"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ✍️ Create Post
                    </Link>
                    <Link
                      to="/profile"
                      className={navLinkClass(
                        window.location.pathname === "/profile"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Profile
                    </Link>
                  </>
                )}
                <div
                  className={`px-4 py-2 text-sm rounded-lg font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Welcome, {user.name}!
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    ${
                      isDarkMode
                        ? "text-red-300 hover:bg-red-900/30"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={navLinkClass(
                    window.location.pathname === "/login"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`w-full text-center px-4 py-2 rounded-lg text-sm font-semibold text-white
                    ${
                      isDarkMode
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
