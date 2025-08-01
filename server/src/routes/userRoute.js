import express from "express"
import { loginUser, registerUser, updateUserProfile, forgotPassword, resetPassword, verifyResetToken } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/profile", protect, updateUserProfile);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

export default router;