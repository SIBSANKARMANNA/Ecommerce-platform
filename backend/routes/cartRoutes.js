import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/cart
 * @desc    Add product to cart
 * @access  User only
 */
router.post("/", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/cart
 * @desc    Get user cart
 * @access  User only
 */
router.get("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove product from cart
 * @access  User only
 */
router.delete("/:productId", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
