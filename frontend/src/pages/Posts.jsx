import React, { useState, useEffect } from 'react';
import TiltedCard from '../components/TitledCard';


const Posts = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/blog/post`);
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
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">All Posts</h1>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#625080]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">All Posts</h1>
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                        <p className="text-red-200">{error}</p>
                        <button
                            onClick={fetchPosts}
                            className="mt-4 px-4 py-2 bg-[#625080] text-white rounded-lg transition-colors"
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
                <h1 className="text-3xl font-bold text-white mb-4">All Posts</h1>
                <p className="text-gray-300">Discover amazing content from our community</p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                        <p className="text-gray-300 mb-6">Be the first to share your thoughts!</p>
                        <a
                            href="/create"
                            className="inline-block px-6 py-3 bg-[#625080] text-white font-medium rounded-lg transition-all transform hover:scale-105"
                        >
                            Create Your First Post
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <TiltedCard
                            key={post._id}
                            id={post._id} // Add this prop
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