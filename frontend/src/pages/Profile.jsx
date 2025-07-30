import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Use theme context
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize form and fetch posts
  useEffect(() => {
    if (user && token) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
      fetchUserPosts();
    }
  }, [user, token]);

  const fetchUserPosts = async () => {
    if (!token) {
      setPostsLoading(false);
      return;
    }

    try {
      setPostsLoading(true);
      setError("");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/api/blog/posts/user`, config);

      if (response.data.status === true) {
        setUserPosts(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch your posts");
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
      if (err.response) {
        setError(`Server Error: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError("Network error or server not responding.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleteLoading(true);

    try {
      const response = await axios.delete(`${BASE_URL}/api/blog/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setMessage("Post deleted successfully");
        setUserPosts(userPosts.filter((post) => post._id !== postId));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(response.data.error || "Failed to delete post");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.response?.data?.error || "Failed to delete post");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditPost = (post) => {
    navigate(`/edit/${post._id}`);
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(`${BASE_URL}/api/auth/profile`, profileForm, config);

      if (response.data.status === true) {
        setMessage("Profile updated successfully!");
        const updatedUser = {
          ...user,
          name: response.data.data.name,
          email: response.data.data.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage"));
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Profile
        </h1>
        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div
            className={`${
              isDarkMode
                ? "bg-white/10 backdrop-blur-md border border-white/20"
                : "bg-white/10 shadow-md border border-black/20"
            } rounded-2xl p-6 transition-all duration-300`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Profile Information
            </h2>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
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
                className={`mb-4 p-3 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-red-500/20 border border-red-500/30 text-red-200"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                    ${
                      isDarkMode
                        ? "bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]"
                        : "bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                    ${
                      isDarkMode
                        ? "bg-black/20 border-white/30 text-white placeholder-gray-400 focus:ring-[#625080]"
                        : "bg-white/20 border-black/20 text-black placeholder-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 font-medium rounded-lg transition-colors
                  ${
                    isDarkMode
                      ? "bg-[#625080] disabled:bg-gray-500 text-white hover:bg-[#7a649e]"
                      : "bg-indigo-600 disabled:bg-gray-400 text-white hover:bg-indigo-700"
                  }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>

            <div
              className={`mt-6 pt-4 border-t ${
                isDarkMode ? "border-white/20" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-medium mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Account Details
              </h3>
              <div
                className={`space-y-2 text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                <p>
                  <span className="font-medium">Role:</span> {user.role}
                </p>
                {/* Optional: Member since */}
                {/* <p>
                  <span className="font-medium">Member since:</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* User Posts Section */}
        <div className="lg:col-span-2">
          <div
            className={`${
              isDarkMode
                ? "bg-white/10 backdrop-blur-md border border-white/20"
                : "bg-white/10 shadow-md border border-black/20"
            } rounded-2xl p-6 transition-all duration-300`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                My Posts
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-[#625080] text-white"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                {userPosts.length} posts
              </span>
            </div>

            {postsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                    isDarkMode ? "border-[#625080]" : "border-indigo-600"
                  }`}
                ></div>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                >
                  You haven't created any posts yet.
                </p>
                <Link
                  to="/create"
                  className={`mt-4 inline-block px-4 py-2 font-medium rounded-lg transition-colors
                    ${
                      isDarkMode
                        ? "bg-[#625080] hover:bg-[#7a649e] text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className={`${
                      isDarkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white/5 border-black/20 hover:bg-white/20"
                    } rounded-xl p-4 border transition-all`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-bold ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {post.title}
                        </h3>
                        <p
                          className={`text-sm mt-1 line-clamp-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {post.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex space-x-3 ml-4">
                        <Link
                          to={`/posts/${post._id}`}
                          className={`text-sm font-medium hover:underline ${
                            isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-indigo-600 hover:text-indigo-800"
                          }`}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEditPost(post)}
                          className={`text-sm font-medium hover:underline ${
                            isDarkMode ? "text-yellow-400 hover:text-yellow-300" : "text-indigo-600 hover:text-indigo-800"
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deleteLoading}
                          className={`text-sm font-medium hover:underline ${
                            isDarkMode
                              ? "text-red-400 hover:text-red-300"
                              : "text-red-600 hover:text-red-800"
                          }`}
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded-full ${
                              isDarkMode
                                ? "bg-[#625080] text-white"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dates */}
                    <div
                      className={`flex justify-between text-xs mt-3 ${
                        isDarkMode ? "text-gray-500" : "text-gray-500"
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;