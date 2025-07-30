import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TiltedCard from '../components/TitledCard';
import { useTheme } from '../context/ThemeContext';

const Posts = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isDarkMode } = useTheme(); // Use current theme

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
            <p
              className={`text-sm ${
                isDarkMode ? 'text-red-200' : 'text-red-700'
              }`}
            >
              {error}
            </p>
            <button
              onClick={fetchPosts}
              className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  isDarkMode
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
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