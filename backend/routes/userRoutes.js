import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Admin only
 */
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password field
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
