import express from "express";
import { deleteUser, getAllUsers } from "../controllers/adminController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all-users", protect, admin, getAllUsers);
router.delete("/delete-user/:id", protect, admin, deleteUser);


export default router;
