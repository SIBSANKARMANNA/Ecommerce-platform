import express from "express";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Add a review to a product
 * @access  User only
 */
router.post("/", protect, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const review = new Review({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/reviews/:productId
 * @desc    Get all reviews for a product
 * @access  Public
 */
router.get("/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Edit user review
 * @access  User only (Owner of review)
 */
router.put("/:id", protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        await review.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete user review
 * @access  User only (Owner of review)
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await review.deleteOne();
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
