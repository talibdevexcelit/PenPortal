import express from "express"
import { loginUser, registerUser, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.put("/profile", protect, updateUserProfile);

export default router;