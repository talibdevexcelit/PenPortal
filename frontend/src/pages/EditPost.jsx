import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const EditPost = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchPost();
  }, [id, token, navigate]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${BASE_URL}/api/blog/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        const post = response.data.data;

        // Permission check
        if (post.user !== user.id) {
          setError('You do not have permission to edit this post');
          setTimeout(() => navigate('/profile'), 3000);
          return;
        }

        setPostForm({
          title: post.title,
          content: post.content,
          tags: post.tags ? post.tags.join(', ') : ''
        });
      } else {
        setError(response.data.message || 'Failed to fetch post');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to fetch post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPostForm({
      ...postForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const formattedTags = postForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const response = await axios.put(
        `${BASE_URL}/api/blog/post/${id}`,
        { title: postForm.title, content: postForm.content, tags: formattedTags },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status) {
        setMessage('Post updated successfully!');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setError(response.data.message || 'Failed to update post');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        className={`${
          isDarkMode
            ? 'bg-white/10 backdrop-blur-md border border-white/20'
            : 'bg-white/10 shadow-md border border-black/20'
        } rounded-2xl p-8 transition-all duration-300`}
      >
        <h1
          className={`text-3xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Edit Post
        </h1>

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

        {/* Success Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              isDarkMode
                ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={postForm.title}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                ${
                  isDarkMode
                    ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                    : 'bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              placeholder="Enter post title"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={postForm.tags}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                ${
                  isDarkMode
                    ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                    : 'bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              placeholder="e.g. technology, programming, web development"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={postForm.content}
              onChange={handleChange}
              required
              rows={12}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none
                ${
                  isDarkMode
                    ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                    : 'bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              placeholder="Write your post content here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 font-medium rounded-lg flex-1 transition-colors cursor-pointer
                ${
                  isDarkMode
                    ? 'bg-[#625080] disabled:bg-gray-500 text-white hover:bg-[#7a649e]'
                    : 'bg-indigo-600 disabled:bg-gray-400 text-white hover:bg-indigo-700'
                }`}
            >
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors
                ${
                  isDarkMode
                    ? 'bg-black/50 text-white cursor-pointer'
                    : 'bg-white/50 text-black cursor-pointer'
                }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;