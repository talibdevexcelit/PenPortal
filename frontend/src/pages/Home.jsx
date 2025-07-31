import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TiltedCard from "../components/TitledCard";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

const Home = () => {
  const { isDarkMode } = useTheme();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage (or your auth method)
      const token = localStorage.getItem("token"); // Adjust based on how you store the token

      const response = await axios.get(`${BASE_URL}/api/blog/post`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // Include token if available
        },
        withCredentials: true, // Enable if backend uses cookies
      });

      const result = response.data;

      if (result.status === true) {
        const posts = Array.isArray(result.data) ? result.data : [];
        setFeaturedPosts(posts.slice(0, 6));
      } else {
        console.error("API Error:", result.message || "Failed to fetch posts");
        setError(result.message || "Failed to fetch posts");
        setFeaturedPosts([]);
      }
    } catch (err) {
      if (err.response) {
        console.error("Response Error:", err.response.data);
        setError(
          err.response.data.message || `HTTP Error: ${err.response.status}`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError(
          "No response from server. Check your network or server status."
        );
      } else {
        console.error("Error:", err.message);
        setError(err.message);
      }
      setFeaturedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/posts?search=${encodeURIComponent(
        searchTerm.trim()
      )}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1
          className={`text-4xl md:text-6xl font-bold mb-6 ${
            isDarkMode ? "text-white/80" : "text-gray-800"
          }`}
        >
          Welcome to{" "}
          <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
            PenPortal
          </span>
        </h1>
        <p
          className={`text-lg md:text-xl ${
            isDarkMode ? "text-gray-300" : "text-gray-900"
          } mb-12 max-w-3xl mx-auto`}
        >
          Discover amazing stories, share your thoughts, and connect with our
          community of writers and readers.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <div
              className={`relative rounded-full transition-all duration-300 shadow-lg
                ${
                  isDarkMode
                    ? "backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30"
                    : "backdrop-blur-sm bg-gray-100 border border-gray-300 hover:bg-gray-200"
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
                      ? "text-white placeholder-gray-300 focus:ring-[#625080]/50"
                      : "text-black placeholder-gray-500 focus:ring-indigo-500"
                  }`}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 
                  rounded-full p-3 transition-colors
                  ${
                    isDarkMode
                      ? "bg-[#625080] text-white hover:bg-[#7a649e]"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
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
          </form>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Featured Posts
          </h2>
          <Link
            to="/posts"
            className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base
              ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm"
                  : "bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 hover:border-gray-400"
              }`}
          >
            View All Posts
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                isDarkMode ? "border-blue-500" : "border-indigo-600"
              }`}
            ></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div
              className={`${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-md border border-white/20"
                  : "bg-gray-100 border border-gray-200"
              } rounded-2xl p-8 max-w-2xl mx-auto`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Error Fetching Posts
              </h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {error}
              </p>
              <button
                onClick={fetchFeaturedPosts}
                className={`inline-block px-6 py-3 font-medium rounded-lg transition-all transform hover:scale-105
                  ${
                    isDarkMode
                      ? "bg-[#625080] hover:bg-[#7a649e] text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                Retry
              </button>
            </div>
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div
              className={`${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-md border border-white/20"
                  : "bg-gray-100 border border-gray-200"
              } rounded-2xl p-8 max-w-2xl mx-auto`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                No posts yet
              </h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Be the first to share your thoughts!
              </p>
              <Link
                to="/create"
                className={`inline-block px-6 py-3 font-medium rounded-lg transition-all transform hover:scale-105
                  ${
                    isDarkMode
                      ? "bg-[#625080] hover:bg-[#7a649e] text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                Create Your First Post
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <TiltedCard
                key={post._id}
                id={post._id}
                title={post.title}
                excerpt={post.content.substring(0, 100) + "..."}
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
    </div>
  );
};

export default Home;
