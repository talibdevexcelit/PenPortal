import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Using axios for better error handling
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
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

  // Initialize form with user data
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
    // Add a check for token to prevent calls without authentication
    if (!token) {
      console.log("No token available, skipping post fetch.");
      setPostsLoading(false);
      return;
    }

    try {
      setPostsLoading(true);
      setError("");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is sent
        },
      };

      // Use the dedicated endpoint for user's posts
      const response = await axios.get(
        `${BASE_URL}/api/blog/posts/user`,
        config
      );

      if (response.data.status === true) {
        // The backend now correctly filters posts, so just set them
        setUserPosts(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch your posts");
      }
    } catch (err) {
      console.error("Error fetching user posts:", err); // More specific logging
      if (err.response) {
        // Server responded with error status
        setError(
          `Server Error: ${err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error or server not responding. Please try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setPostsLoading(false);
    }
  };

  // Update the useEffect dependency array to include token
  useEffect(() => {
    if (user && token) {
      // Ensure both user context and token are available
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
      });
      fetchUserPosts();
    }
    // If only `user` is the dependency and `token` becomes available later
    // (e.g., after AuthProvider finishes its check), this effect won't re-run.
    // Including `token` ensures it runs when both are ready.
  }, [user, token]); // Add token as a dependency

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/blog/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setMessage("Post deleted successfully");
        // Remove the deleted post from the state
        setUserPosts(userPosts.filter((post) => post._id !== postId));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(response.data.error || "Failed to delete post");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error.response?.data?.error || "Failed to delete post");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditPost = (post) => {
    // Redirect to edit page using React Router navigation
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

      const response = await axios.put(
        `${BASE_URL}/api/auth/profile`,
        profileForm,
        config
      );

      if (response.data.status === true) {
        setMessage("Profile updated successfully!");
        // Update user in context
        const updatedUser = {
          ...user,
          name: response.data.data.name,
          email: response.data.data.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage")); // Trigger storage event to update context
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to update profile");
      } else {
        setError("Network error. Please try again.");
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              Profile Information
            </h2>

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-200 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#625080]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-[#625080] disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/20">
              <h3 className="text-lg font-medium text-white mb-2">
                Account Details
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="font-medium">Role:</span> {user.role}
                </p>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Posts</h2>
              <span className="bg-[#625080] text-white px-3 py-1 rounded-full text-sm">
                {userPosts.length} posts
              </span>
            </div>

            {postsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#625080]"></div>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300">
                  You haven't created any posts yet.
                </p>
                <a
                  href="/create"
                  className="mt-4 inline-block px-4 py-2 bg-[#625080] text-white font-medium rounded-lg transition-colors"
                >
                  Create Your First Post
                </a>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {post.title}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                          {post.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/posts/${post._id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm flex-shrink-0"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm flex-shrink-0"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deleteLoading}
                          className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
                        >
                          {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags &&
                        post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-[#625080] text-white rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                      <span>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.updatedAt && post.updatedAt !== post.createdAt && (
                        <span>
                          Updated:{" "}
                          {new Date(post.updatedAt).toLocaleDateString()}
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
