import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useAuth();

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
                // Extract posts array from the data field
                const postsArray = Array.isArray(result.data) ? result.data : [];
                setPosts(postsArray);
            } else {
                setError(result.message || 'Failed to fetch posts');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error:', err);
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
            // Convert tags string to array
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
                // Reset form
                setFormData({
                    title: '',
                    content: '',
                    author: '',
                    tags: ''
                });
                // Refresh posts list
                fetchPosts();
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

            // Convert tags string to array
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
                // Refresh posts list
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
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

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
                // Refresh posts list
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
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Create Post Form */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">Create New Post</h1>

                    {message && (
                        <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] focus:border-[#625080] transition-all"
                                placeholder="Enter post title"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-200 mb-2">
                                Author *
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] focus:border-[#625080] transition-all"
                                placeholder="Enter author name"
                                readOnly={user?.name}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-200 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] focus:border-[#625080] transition-all"
                                placeholder="e.g., technology, programming, web"
                            />
                            <p className="mt-1 text-sm text-gray-400">Separate tags with commas</p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows={10}
                                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] focus:border-[#625080] transition-all resize-none"
                                placeholder="Write your post content here..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-[#625080] disabled:bg-[#625080]/60 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-[#625080] focus:ring-offset-2 focus:ring-offset-transparent"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Manage Posts</h2>

                    {postsLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-300">No posts found. Create your first post!</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    {editingId === post._id ? (
                                        // Edit Form
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
                                                placeholder="Post title"
                                            />
                                            <input
                                                type="text"
                                                name="author"
                                                value={editForm.author}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
                                                placeholder="Author name"
                                            />
                                            <input
                                                type="text"
                                                name="tags"
                                                value={editForm.tags}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
                                                placeholder="Tags (comma separated)"
                                            />
                                            <textarea
                                                name="content"
                                                value={editForm.content}
                                                onChange={handleEditChange}
                                                rows={4}
                                                className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080] resize-none"
                                                placeholder="Post content"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(post._id)}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                                                >
                                                    {loading ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Post Display
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                            <p className="text-gray-300 text-sm mb-3">by {post.author}</p>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.content}</p>

                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {post.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                                <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                                                {post.updatedAt && post.updatedAt !== post.createdAt && (
                                                    <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEditing(post)}
                                                    className="flex-1 px-3 py-2 bg-[#625080] cursor-pointer text-white rounded-lg transition-colors text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    disabled={loading}
                                                    className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 cursor-pointer disabled:bg-red-400 text-white rounded-lg transition-colors text-sm"
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