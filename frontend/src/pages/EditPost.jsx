import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditPost = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: ''
  });

  // Fetch post data when component mounts
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

      const response = await axios.get(
        `${BASE_URL}/api/blog/post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        const post = response.data.data;

        // Check if the post belongs to the current user
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
      // Format tags
      const formattedTags = postForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const response = await axios.put(
        `${BASE_URL}/api/blog/post/${id}`,
        {
          title: postForm.title,
          content: postForm.content,
          tags: formattedTags
        },
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#625080]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Post</h1>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={postForm.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-200 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={postForm.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
              placeholder="e.g. technology, programming, web development"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={postForm.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] resize-none"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#625080] disabled:bg-[#625080] text-white font-medium rounded-lg transition-colors flex-1"
            >
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
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