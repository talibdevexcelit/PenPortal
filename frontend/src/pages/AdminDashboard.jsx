import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useAuth();
  const { isDarkMode } = useTheme(); // Use current theme
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'posts'
  const [loading, setLoading] = useState({ users: true, posts: true });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState({ user: null, post: null });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      setError("");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/api/admin/all-users`,
        config
      );
      if (response.data.status === true) {
        setUsers(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Fetch all posts for admin
  const fetchPosts = async () => {
    try {
      setLoading((prev) => ({ ...prev, posts: true }));
      setError("");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${BASE_URL}/api/blog/posts/admin/all`,
        config
      );
      if (response.data.status === true) {
        setPosts(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch posts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This will also delete all their posts."
      )
    ) {
      return;
    }
    try {
      setDeletingId((prev) => ({ ...prev, user: id }));
      setError("");
      setMessage("");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${BASE_URL}/api/admin/delete-user/${id}`,
        config
      );
      if (response.data.status === true) {
        setMessage("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
        fetchPosts(); // Refresh posts
      } else {
        setError(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to delete user");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setDeletingId((prev) => ({ ...prev, user: null }));
    }
  };

  // Delete post by admin
  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      setDeletingId((prev) => ({ ...prev, post: id }));
      setError("");
      setMessage("");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${BASE_URL}/api/blog/posts/admin/${id}`,
        config
      );
      if (response.data.status === true) {
        setMessage("Post deleted successfully");
        setPosts(posts.filter((post) => post._id !== id));
      } else {
        setError(response.data.message || "Failed to delete post");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to delete post");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setDeletingId((prev) => ({ ...prev, post: null }));
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchPosts();
    } else {
      setLoading({ users: false, posts: false });
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Admin Dashboard
        </h1>
        <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}>
          Manage your application resources
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Manage Posts */}
        <div
          className={`${
            isDarkMode
              ? "bg-black/70 backdrop-blur-md border border-white/20"
              : "bg-white/70 shadow-md border border-gray-200"
          } rounded-2xl p-6 transition-all duration-300`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-[#3b2958]" : "bg-indigo-100"
              }`}
            >
              <svg
                className={`h-6 w-6 ${
                  isDarkMode ? "text-[#beb2d1]" : "text-indigo-600"
                }`}
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
            </div>
            <div className="ml-4">
              <h3
                className={`text-lg font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Manage Posts
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Create, edit, and delete posts
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("posts")}
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium
              ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
              }`}
          >
            Manage Posts
          </button>
        </div>

        {/* Manage Users */}
        <div
          className={`${
            isDarkMode
              ? "bg-black/70 backdrop-blur-md border border-white/20"
              : "bg-white/70 shadow-md border border-gray-200"
          } rounded-2xl p-6 transition-all duration-300`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-green-500/20" : "bg-green-100"
              }`}
            >
              <svg
                className={`h-6 w-6 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3
                className={`text-lg font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Manage Users
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                View and manage user accounts
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("users")}
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium
              ${
                isDarkMode
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-indigo-100 hover:bg-indigo-200 text-indigo-800"
              }`}
          >
            Manage Users
          </button>
        </div>

        {/* Settings (Coming Soon) */}
        <div
          className={`${
            isDarkMode
              ? "bg-black/70 backdrop-blur-md border border-white/20"
              : "bg-white/70 shadow-md border border-gray-200"
          } rounded-2xl p-6 transition-all duration-300`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
              }`}
            >
              <svg
                className={`h-6 w-6 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3
                className={`text-lg font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Settings
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Application configuration
              </p>
            </div>
          </div>
          <button
            className={`mt-4 w-full py-2 rounded-lg transition-colors text-sm font-medium
              ${
                isDarkMode
                  ? "bg-white/20 text-white cursor-not-allowed"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        className={`flex border-b mb-6 ${
          isDarkMode ? "border-white/20" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => setActiveTab("users")}
          className={`py-2 px-4 font-medium text-sm rounded-t-lg transition-colors
            ${
              activeTab === "users"
                ? isDarkMode
                  ? "text-white border-b-2 border-[#625080] bg-white/10"
                  : "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-700 hover:text-gray-800 hover:bg-gray-100"
            }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-2 px-4 font-medium text-sm rounded-t-lg transition-colors
            ${
              activeTab === "posts"
                ? isDarkMode
                  ? "text-white border-b-2 border-[#625080] bg-white/10"
                  : "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : isDarkMode
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-700 hover:text-gray-800 hover:bg-gray-100"
            }`}
        >
          Posts ({posts.length})
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm ${
            isDarkMode
              ? "bg-green-500/20 border border-green-500/30 text-green-200"
              : "bg-green-50 border border-green-200 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm ${
            isDarkMode
              ? "bg-red-500/20 border border-red-500/30 text-red-200"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {error}
        </div>
      )}

      {/* Users Management Section */}
      {activeTab === "users" && (
        <div
          className={`${
            isDarkMode
              ? "bg-black/70 backdrop-blur-md border border-white/20"
              : "bg-white/70 shadow-md border border-gray-200"
          } rounded-2xl p-6 transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              User Management
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {users.length} users
            </span>
          </div>

          {loading.users ? (
            <div className="flex justify-center items-center h-64">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  isDarkMode ? "border-[#625080]" : "border-indigo-600"
                }`}
              ></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      User
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Email
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Role
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Joined
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDarkMode ? "divide-white/20" : "divide-gray-200"
                  }`}
                >
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className={`${
                        isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full ${
                              isDarkMode
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-blue-100 text-blue-600"
                            } flex items-center justify-center font-medium`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div
                              className={`text-sm font-medium ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? isDarkMode
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-purple-100 text-purple-800"
                              : isDarkMode
                              ? "bg-green-500/20 text-green-300"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deletingId.user === user._id}
                          className={`text-sm ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300 disabled:opacity-50"
                              : "text-red-600 hover:text-red-800 disabled:opacity-50"
                          }`}
                        >
                          {deletingId.user === user._id ? (
                            <svg
                              className="animate-spin h-5 w-5 mx-auto"
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
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Posts Management Section */}
      {activeTab === "posts" && (
        <div
          className={`${
            isDarkMode
              ? "bg-black/70 backdrop-blur-md border border-white/20"
              : "bg-white/70 shadow-md border border-gray-200"
          } rounded-2xl p-6 transition-all duration-300`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Post Management
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {posts.length} posts
            </span>
          </div>

          {loading.posts ? (
            <div className="flex justify-center items-center h-64">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  isDarkMode ? "border-[#625080]" : "border-indigo-600"
                }`}
              ></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                No posts found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Post
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Author
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Tags
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Created
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`${
                    isDarkMode ? "divide-white/20" : "divide-gray-200"
                  }`}
                >
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className={`${
                        isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {post.title}
                        </div>
                        <div
                          className={`text-sm mt-1 line-clamp-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {post.content.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {post.user?.name || post.author}
                        </div>
                        <div
                          className={`text-xs ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {post.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags &&
                            post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  isDarkMode
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          {post.tags && post.tags.length > 3 && (
                            <span
                              className={`px-2 py-1 text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            to={`/posts/${post._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-indigo-600 hover:text-indigo-800"
                            }`}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            disabled={deletingId.post === post._id}
                            className={`${
                              isDarkMode
                                ? "text-red-400 hover:text-red-300 disabled:opacity-50"
                                : "text-red-600 hover:text-red-800 disabled:opacity-50"
                            }`}
                          >
                            {deletingId.post === post._id ? (
                              <svg
                                className="animate-spin h-5 w-5 mx-auto"
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
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
