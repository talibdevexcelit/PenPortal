import Post from "../models/Post.js";

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Posts retrieved successfully",
      data: posts,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve posts",
      data: null,
      error: { message: error.message },
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: true,
      message: "User posts retrieved successfully",
      data: posts,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve user posts",
      data: null,
      error: { message: error.message },
    });
  }
};

// Get Single Post
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
        data: null,
        error: { message: "Post not found" },
      });
    }
    res.status(200).json({
      status: true,
      message: "Post retrieved successfully",
      data: post,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve post",
      data: null,
      error: { message: error.message },
    });
  }
};

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const post = new Post({
      title,
      content,
      author,
      tags: tags || [],
      user: req.user._id, // Add the authenticated user's ID to the post
    });
    const savedPost = await post.save();
    res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: savedPost,
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to create post",
      data: null,
      error: { message: error.message },
    });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    // First find the post to check ownership
    const existingPost = await Post.findById(req.params.id);

    if (!existingPost) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
        data: null,
        error: { message: "Post not found" },
      });
    }

    // Check if the authenticated user is the owner of the post
    if (existingPost.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to update this post",
        data: null,
        error: { message: "Not authorized" },
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        tags: tags || [],
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
        data: null,
        error: { message: "Post not found" },
      });
    }
    res.status(200).json({
      status: true,
      message: "Post updated successfully",
      data: post,
      error: null,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to update post",
      data: null,
      error: { message: error.message },
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    // First find the post to check ownership
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
        data: null,
        error: { message: "Post not found" },
      });
    }

    // Check if the authenticated user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to delete this post",
        data: null,
        error: { message: "Not authorized" },
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: "Post deleted successfully",
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete post",
      data: null,
      error: { message: error.message },
    });
  }
};

// Get All Posts for Admin (Admin only)
export const getAllPostsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Not authorized as an admin",
        data: null,
        error: { message: "Admin access required" },
      });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email role");
    res.status(200).json({
      status: true,
      message: "All posts retrieved successfully",
      data: posts,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to retrieve posts",
      data: null,
      error: { message: error.message },
    });
  }
};

// Delete Post by Admin (Admin only)
export const deletePostAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Not authorized as an admin",
        data: null,
        error: { message: "Admin access required" },
      });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post not found",
        data: null,
        error: { message: "Post not found" },
      });
    }

    res.status(200).json({
      status: true,
      message: "Post deleted successfully by admin",
      data: { id: req.params.id },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to delete post",
      data: null,
      error: { message: error.message },
    });
  }
};
