import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import TiltedCard from '../components/TitledCard';

const Home = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedPosts();
    }, []);

    const fetchFeaturedPosts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/blog/post`);
            const result = await response.json();

            if (response.ok && result.status === true) {
                // Get first 6 posts from the data field
                const posts = Array.isArray(result.data) ? result.data : [];
                setFeaturedPosts(posts.slice(0, 6));
            } else {
                // Handle error response
                console.error('API Error:', result.message || 'Failed to fetch posts');
                setFeaturedPosts([]);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setFeaturedPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Redirect to posts page with search query
            window.location.href = `/posts?search=${encodeURIComponent(searchTerm)}`;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Welcome to <span className="text-white/70">PenPortal</span>
                </h1>
                <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    Discover amazing stories, share your thoughts, and connect with our community of writers and readers.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative rounded-full backdrop-blur-md bg-white/20 border border-white/30 hover:bg-white/30 transition-all shadow-lg">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search posts, authors, or topics..."
                                className="w-full py-4 pl-6 pr-20 rounded-full bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#625080] text-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#625080] cursor-pointer text-white rounded-full p-3 transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Featured Posts Section */}
            <div className="mb-16">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-white">Featured Posts</h2>
                    <Link
                        to="/posts"
                        className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/30 hover:border-white/50 flex items-center gap-2"
                    >
                        View All Posts
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : featuredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                            <p className="text-gray-300 mb-6">Be the first to share your thoughts!</p>
                            <Link
                                to="/create"
                                className="inline-block px-6 py-3 bg-[#625080] text-white font-medium rounded-lg transition-all transform hover:scale-105"
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
                                id={post._id} // Added id prop for navigation
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

            {/* Call to Action Section */}
            {/* <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Share Your Story?</h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our community of writers and start publishing your thoughts today. It's free and easy to get started.
        </p>
        <Link 
          to="/create" 
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Create Your First Post
        </Link>
      </div> */}
        </div>
    );
};

export default Home;