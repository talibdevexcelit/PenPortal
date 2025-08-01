// src/pages/Posts.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TiltedCard from '../components/TitledCard';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Posts = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/blog/post`);
      const result = await response.json();

      if (response.ok && result.status === true) {
        const postsArray = Array.isArray(result.data) ? result.data : [];
        setPosts(postsArray);
      } else {
        setError(result.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes with debounce
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoadingSuggestions(true);
        const response = await axios.get(`${BASE_URL}/api/blog/post/suggestions`, {
          params: { query: searchTerm.trim() },
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        const result = response.data;
        if (result.status === true) {
          setSearchSuggestions(result.data);
          setShowSuggestions(true);
        } else {
          setSearchSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSearchSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearchSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, BASE_URL]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion._id);
    setSearchTerm(suggestion.title);
    setTimeout(() => {
      setShowSuggestions(false);
      navigate(`/post/${suggestion._id}`);
    }, 400);
  };

  // Handle form submit (fallback to search results if needed)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            All Posts
          </h1>
          <div className="flex justify-center items-center h-64">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDarkMode ? 'border-[#625080]' : 'border-indigo-600'
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            All Posts
          </h1>
          <div
            className={`${
              isDarkMode
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-red-50 border border-red-200'
            } rounded-lg p-6 max-w-md mx-auto`}
          >
            <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
              {error}
            </p>
            <button
              onClick={fetchPosts}
              className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isDarkMode
                  ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={suggestionsRef}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
        >
          All Posts
        </h1>
        <p
          className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}
        >
          Discover amazing content from our community
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div
            className={`relative rounded-full transition-all duration-300 shadow-lg
              ${
                isDarkMode
                  ? 'backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30'
                  : 'backdrop-blur-sm bg-gray-100 border border-gray-300 hover:bg-gray-200'
              }`}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts, authors, or topics..."
              className={`w-full py-4 pl-6 pr-20 rounded-full bg-transparent text-lg focus:outline-none focus:ring-2
                ${
                  isDarkMode
                    ? 'text-white placeholder-gray-300 focus:ring-[#625080]/50'
                    : 'text-black placeholder-gray-500 focus:ring-indigo-500'
                }`}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                rounded-full p-3 transition-colors
                ${
                  isDarkMode
                    ? 'bg-[#625080] text-white hover:bg-[#7a649e]'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div
              className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg overflow-hidden transition-all duration-300
                ${
                  isDarkMode
                    ? 'bg-zinc-900/50 backdrop-blur-md border border-white/20'
                    : 'bg-white border border-gray-200'
                }`}
            >
              <ul className="max-h-60 overflow-y-auto">
                {loadingSuggestions ? (
                  <li
                    className={`px-4 py-3 text-center ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className={`animate-spin h-5 w-5 ${
                          isDarkMode ? 'text-white' : 'text-indigo-600'
                        }`}
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
                      <span>Loading suggestions...</span>
                    </div>
                  </li>
                ) : searchSuggestions.length === 0 ? (
                  <li
                    className={`px-4 py-3 text-center ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    No results found
                  </li>
                ) : (
                  searchSuggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-3 cursor-pointer transition-colors transform duration-200 overflow-hidden
                        ${
                          isDarkMode
                            ? 'hover:bg-white/10 text-white border-b border-white/10'
                            : 'hover:bg-black/10 text-gray-800 border-b border-gray-100'
                        } ${
                        suggestion === searchSuggestions[searchSuggestions.length - 1]
                          ? 'border-b-0'
                          : ''
                      }
                        ${
                          selectedSuggestion === suggestion._id
                            ? isDarkMode
                              ? 'bg-[#625080]/30'
                              : 'bg-indigo-100'
                            : ''
                        }`}
                    >
                      <div className="font-medium text-base">{suggestion.title}</div>
                      <div
                        className={`text-sm mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        By {suggestion.author}
                      </div>
                      {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {suggestion.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded-full transition-colors
                                ${
                                  isDarkMode
                                    ? 'bg-[#625080]/30 text-gray-300 hover:bg-[#625080]/50'
                                    : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {suggestion.tags.length > 3 && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full
                                ${
                                  isDarkMode
                                    ? 'bg-gray-800 text-gray-400'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                              +{suggestion.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
              <div
                className={`px-4 py-2 text-xs text-center ${
                  isDarkMode
                    ? 'text-gray-400 border-t border-white/10'
                    : 'text-gray-500 border-t border-gray-100'
                }`}
              >
                Click on a suggestion to view the post
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div
            className={`${
              isDarkMode
                ? 'bg-white/10 backdrop-blur-md border border-white/20'
                : 'bg-gray-50 border border-gray-200'
            } rounded-2xl p-8 max-w-2xl mx-auto`}
          >
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              No posts yet
            </h3>
            <p
              className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Be the first to share your thoughts!
            </p>
            <Link
              to="/create"
              className={`inline-block px-6 py-3 text-sm font-medium rounded-lg transition-all transform hover:scale-105
                ${
                  isDarkMode
                    ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
            >
              Create Your First Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <TiltedCard
              key={post._id}
              id={post._id}
              title={post.title}
              excerpt={post.content.substring(0, 100) + '...'}
              author={post.author}
              date={post.createdAt}
              tags={post.tags}
              containerHeight="350px"
              containerWidth="100%"
              rotateAmplitude={8}
              scaleOnHover={1.03}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;