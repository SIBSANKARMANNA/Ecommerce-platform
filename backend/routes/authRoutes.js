import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../config/jwt.js";

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        // await User.deleteMany({});
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            token: generateToken(user._id, user.role) 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
