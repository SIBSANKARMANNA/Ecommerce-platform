import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Admin adds a new product
 * @access  Admin only
 */
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image,
            createdBy: req.user._id
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/products
 * @desc    Get all products (Users & Admins)
 * @access  Public
 */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product details by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Admin updates a product
 * @access  Admin only
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.image = image || product.image;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Admin deletes a product
 * @access  Admin only
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.deleteOne();
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
