import express from "express";
import {
  createPost,
  deletePost,
  deletePostAdmin,
  getAllPosts,
  getAllPostsAdmin,
  getSinglePost,
  getUserPosts,
  updatePost,
  getSearchSuggestions,
} from "../controllers/postController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Blog API endpoints - RESTful pattern
router.get("/post/suggestions", getSearchSuggestions); // Search suggestions endpoint
router.get("/post/search", getAllPosts); // Search endpoint using the same controller
router.get("/post/:id", getSinglePost);
router.get("/post", getAllPosts);

// Protected routes - only authenticated users can access
router.post("/post", protect, createPost);
router.put("/post/:id", protect, updatePost);
router.delete("/post/:id", protect, deletePost);

router.get("/posts/admin/all", protect, admin, getAllPostsAdmin);
router.delete("/posts/admin/:id", protect, admin, deletePostAdmin);
router.get("/posts/user", protect, getUserPosts);

export default router;
