import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    About <span className="text-[#625080]">PenPortal</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    A modern blogging platform built with the MERN stack, designed for writers and readers alike.
                </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Story Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
                    <div className="space-y-4 text-gray-300">
                        <p>
                            PenPortal was created as a learning project to demonstrate full-stack web development
                            using the MERN (MongoDB, Express, React, Node.js) stack. What started as a simple
                            CRUD application has evolved into a fully-featured blogging platform.
                        </p>
                        <p>
                            Our mission is to provide a clean, intuitive platform where writers can share their
                            thoughts and readers can discover amazing content. We believe in the power of
                            storytelling and aim to make publishing accessible to everyone.
                        </p>
                        <p>
                            Built with modern web technologies and design principles, PenPortal showcases best
                            practices in full-stack development while maintaining a focus on user experience
                            and performance.
                        </p>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#625080] flex items-center justify-center mr-3 mt-0.5">
                                <svg className="h-4 w-4 text-[#625080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300">Create, read, update, and delete blog posts</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#625080] flex items-center justify-center mr-3 mt-0.5">
                                <svg className="h-4 w-4 text-[#625080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300">Tag-based content organization</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#625080] flex items-center justify-center mr-3 mt-0.5">
                                <svg className="h-4 w-4 text-[#625080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300">Responsive design for all devices</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#625080] flex items-center justify-center mr-3 mt-0.5">
                                <svg className="h-4 w-4 text-[#625080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300">Modern glassmorphism UI design</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#625080] flex items-center justify-center mr-3 mt-0.5">
                                <svg className="h-4 w-4 text-[#625080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300">Fast and secure backend API</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Team/Technology Section */}
            <div className="bg-gradient-to-r from-[#625080] to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-16">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Built With</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="bg-white/10 rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                            <span className="text-2xl">🍃</span>
                        </div>
                        <h3 className="text-white font-medium">MongoDB</h3>
                        <p className="text-gray-400 text-sm">Database</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-white font-medium">Express.js</h3>
                        <p className="text-gray-400 text-sm">Backend</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                            <span className="text-2xl">⚛️</span>
                        </div>
                        <h3 className="text-white font-medium">React</h3>
                        <p className="text-gray-400 text-sm">Frontend</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                            <span className="text-2xl">🟢</span>
                        </div>
                        <h3 className="text-white font-medium">Node.js</h3>
                        <p className="text-gray-400 text-sm">Runtime</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Blogging?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join our community today and start sharing your stories with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/create"
                        className="px-6 py-3 bg-[#625080] text-white font-medium rounded-lg transition-all transform hover:scale-105"
                    >
                        Create Your First Post
                    </Link>
                    <Link
                        to="/posts"
                        className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all border border-white/30"
                    >
                        Browse Posts
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;