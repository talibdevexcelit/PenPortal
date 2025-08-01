import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const BlogDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${BASE_URL}/api/blog/post/${id}`);
      const result = await response.json();

      if (response.ok && result.status === true) {
        setPost(result.data);
      } else {
        setError(result.message || 'Failed to fetch post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleteLoading(true);

    try {
      const response = await axios.delete(`${BASE_URL}/api/blog/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        alert('Post deleted successfully!');
        navigate('/posts');
      } else {
        setError(response.data.message || 'Failed to delete post');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
      console.error('Error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isOwner = post && user && post.user === user.id;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
              isDarkMode ? 'border-[#625080]' : 'border-indigo-600'
            }`}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className={`${
            isDarkMode
              ? 'bg-red-500/20 border border-red-500/30'
              : 'bg-red-50 border border-red-200'
          } rounded-lg p-6 max-w-md mx-auto text-center`}
        >
          <p
            className={`text-sm ${
              isDarkMode ? 'text-red-200' : 'text-red-700'
            }`}
          >
            {error}
          </p>
          <Link
            to="/posts"
            className={`mt-4 inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                isDarkMode
                  ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className={`${
            isDarkMode
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-gray-50 border border-gray-200'
          } rounded-2xl p-8 text-center max-w-2xl mx-auto`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Post Not Found
          </h2>
          <p
            className={`mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            The post you're looking for doesn't exist.
          </p>
          <Link
            to="/posts"
            className={`inline-block px-6 py-3 text-sm font-medium rounded-lg transition-all
              ${
                isDarkMode
                  ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
          >
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        className={`${
          isDarkMode
            ? 'bg-black/70 backdrop-blur-md border border-white/20'
            : 'bg-white/70 shadow-md border border-black/20'
        } rounded-2xl p-8 transition-all duration-300`}
      >
        {/* Back Button */}
        <Link
          to="/posts"
          className={`flex items-center text-sm font-medium mb-6 transition-colors
            ${
              isDarkMode
                ? 'text-blue-300 hover:text-blue-100'
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
        >
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Posts
        </Link>

        {/* Post Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            {post.title}
          </h1>

          <div
            className={`flex flex-wrap items-center gap-4 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-6`}
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{post.author}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full backdrop-blur-sm
                    ${
                      isDarkMode
                        ? 'bg-[#625080]/20 text-[#d6d2db] border border-[#625080]/30'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div
          className={`prose prose-invert max-w-none mb-8 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Action Buttons (Only for owner or admin) */}
        {(isOwner || isAdmin) && (
          <div
            className={`flex flex-wrap gap-4 pt-6 border-t ${
              isDarkMode ? 'border-white/20' : 'border-gray-200'
            }`}
          >
            <Link
              to={`/edit/${post._id}`}
              className={`px-6 py-2 flex items-center gap-2 text-sm font-medium rounded-lg transition-colors
                ${
                  isDarkMode
                    ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Post
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`px-6 py-2 flex items-center gap-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                ${
                  isDarkMode
                    ? 'bg-red-700 hover:bg-red-600 disabled:bg-red-400 text-white'
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {deleteLoading ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;