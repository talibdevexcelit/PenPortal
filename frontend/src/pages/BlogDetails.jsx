import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetails = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/blog/post/${id}`);
            const result = await response.json();

            if (response.ok && result.status === true) {
                // Extract post data from the data field
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

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#625080]"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                    <p className="text-red-200">{error}</p>
                    <button
                        onClick={() => navigate('/posts')}
                        className="mt-4 px-4 py-2 bg-[#625080] text-white rounded-lg transition-colors"
                    >
                        Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
                    <p className="text-gray-300 mb-6">The post you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/posts')}
                        className="px-6 py-3 bg-[#625080] text-white font-medium rounded-lg transition-all"
                    >
                        Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/posts')}
                    className="flex items-center text-blue-300 hover:text-blue-100 mb-6 transition-colors"
                >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Posts
                </button>

                {/* Post Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{post.author}</span>
                        </div>

                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm backdrop-blur-sm border border-blue-500/30"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex flex-wrap gap-4 pt-6 border-t border-white/20">
                    <button
                        onClick={() => navigate(`/edit/${post._id}`)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Post
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Post
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default BlogDetails;