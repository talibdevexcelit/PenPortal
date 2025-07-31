import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CreatePost = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: user?.name || '',
    tags: ''
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch all posts when component mounts
  useEffect(() => {
    if (isAuthenticated()) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await fetch(`${BASE_URL}/api/blog/post`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
      setPostsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        tags: tagsArray
      };

      const response = await fetch(`${BASE_URL}/api/blog/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        setMessage('Post created successfully!');
        setFormData({
          title: '',
          content: '',
          author: '',
          tags: ''
        });
        fetchPosts(); // Refresh list
        navigate("/posts")
      } else {
        setError(result.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (post) => {
    setEditingId(post._id);
    setEditForm({
      title: post.title,
      content: post.content,
      author: post.author,
      tags: post.tags ? post.tags.join(', ') : ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      title: '',
      content: '',
      author: '',
      tags: ''
    });
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      const tagsArray = editForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        title: editForm.title,
        content: editForm.content,
        author: editForm.author,
        tags: tagsArray
      };

      const response = await fetch(`${BASE_URL}/api/blog/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        setMessage('Post updated successfully!');
        setEditingId(null);
        fetchPosts();
      } else {
        setError(result.message || 'Failed to update post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/blog/post/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (response.ok && result.status === true) {
        setMessage('Post deleted successfully!');
        fetchPosts();
      } else {
        setError(result.message || 'Failed to delete post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Create Post Form */}
        <div
          className={`${
            isDarkMode
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-white/10 shadow-md border border-white/20'
          } rounded-2xl p-8 transition-all duration-300`}
        >
          <h1
            className={`text-3xl font-bold mb-8 text-center ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            Create New Post
          </h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                isDarkMode
                  ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                isDarkMode
                  ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {error}
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
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                      : 'bg-white/20 border-black/30 text-black placeholder-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                placeholder="Enter post title"
              />
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                readOnly={!!user?.name}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080] cursor-default'
                      : 'bg-white/20 border-black/30 text-black placeholder-gray-700 focus:ring-indigo-500 focus:border-indigo-500 cursor-default'
                  }`}
                placeholder="Enter author name"
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
                value={formData.tags}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                      : 'bg-white/20 border-black/30 text-black placeholder-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                placeholder="e.g., technology, programming, web"
              />
              <p
                className={`mt-1 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
                Separate tags with commas
              </p>
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none
                  ${
                    isDarkMode
                      ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                      : 'bg-white/20 border-black/30 text-black placeholder-gray-700 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 font-medium rounded-lg transition-all transform disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer
                  ${
                    isDarkMode
                      ? 'bg-[#625080] disabled:bg-[#625080]/60 text-white focus:ring-[#625080] focus:ring-offset-transparent'
                      : 'bg-indigo-600 disabled:bg-indigo-400 text-white focus:ring-indigo-500 focus:ring-offset-white'
                  }`}
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
                    Creating...
                  </span>
                ) : (
                  'Create Post'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Manage Posts Section */}
        {/* <div
          className={`${
            isDarkMode
              ? 'bg-white/10 backdrop-blur-md border border-white/20'
              : 'bg-white/80 shadow-md border border-gray-200'
          } rounded-2xl p-8 transition-all duration-300`}
        >
          <h2
            className={`text-3xl font-bold mb-8 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            Manage Posts
          </h2>

          {postsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  isDarkMode ? 'border-[#625080]' : 'border-indigo-600'
                }`}
              ></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p
                className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                No posts found. Create your first post!
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className={`${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  } rounded-xl p-6 border transition-all`}
                >
                  {editingId === post._id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
                          ${
                            isDarkMode
                              ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'
                          }`}
                        placeholder="Post title"
                      />
                      <input
                        type="text"
                        name="author"
                        value={editForm.author}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
                          ${
                            isDarkMode
                              ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'
                          }`}
                        placeholder="Author name"
                      />
                      <input
                        type="text"
                        name="tags"
                        value={editForm.tags}
                        onChange={handleEditChange}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
                          ${
                            isDarkMode
                              ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'
                          }`}
                        placeholder="Tags (comma separated)"
                      />
                      <textarea
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        rows={4}
                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none
                          ${
                            isDarkMode
                              ? 'bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]'
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500'
                          }`}
                        placeholder="Post content"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(post._id)}
                          disabled={loading}
                          className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors
                            ${
                              isDarkMode
                                ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
                                : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white'
                            }`}
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={loading}
                          className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors
                            ${
                              isDarkMode
                                ? 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white'
                                : 'bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white'
                            }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Post Display
                    <div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`text-sm mb-3 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        by {post.author}
                      </p>
                      <p
                        className={`text-sm mb-4 line-clamp-3 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {post.content}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 text-xs rounded-full
                                ${
                                  isDarkMode
                                    ? 'bg-[#625080] text-white'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div
                        className={`flex justify-between items-center text-xs mb-4 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        <span>
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                          <span>
                            Updated: {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(post)}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                            ${
                              isDarkMode
                                ? 'bg-[#625080] hover:bg-[#7a649e] text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={loading}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                            ${
                              isDarkMode
                                ? 'bg-red-700 hover:bg-red-600 disabled:bg-red-400 text-white'
                                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
                            }`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default CreatePost;