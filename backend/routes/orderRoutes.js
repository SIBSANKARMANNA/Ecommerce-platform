import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Checkout & place order
 * @access  User only
 */
router.post("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

        const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalAmount
        });

        await order.save();
        await Cart.deleteOne({ user: req.user._id });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// router.post("/", protect, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
//         if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

//         const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

//         const order = new Order({
//             user: req.user._id,
//             items: cart.items,
//             totalAmount
//         });

//         await order.save();
//         await Cart.deleteOne({ user: req.user._id });

//         // Get user email
//         const user = await User.findById(req.user._id);
//         console.log('user-information',user);
//         if (user && user.email) {
//             await sendOrderConfirmationEmail(user.email,user.password, order);
//         }

//         res.status(201).json(order);
//     } catch (error) {
//         console.error("Order Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// /**
//  * Function to send order confirmation email
//  */
// const sendOrderConfirmationEmail = async (userEmail,userPassword, order) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: "userEmail", // Change this to your email
//             pass: "userPassword"  // Use an app password instead of your email password
//         }
//     });

//     const orderItemsHTML = order.items.map(item => 
//         `<li>${item.product.name} - ${item.quantity} x $${item.product.price}</li>`
//     ).join("");

//     const mailOptions = {
//         from: "userEmail",
//         to: userEmail,
//         subject: "Order Confirmation",
//         html: `
//             <h2>Thank you for your order!</h2>
//             <p>Your order has been placed successfully.</p>
//             <h3>Order Details:</h3>
//             <ul>${orderItemsHTML}</ul>
//             <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
//             <p>We will notify you once your order is shipped.</p>
//         `
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log("Order confirmation email sent to:", userEmail);
//     } catch (error) {
//         console.error("Email Sending Error:", error);
//     }
// };

/**
 * @route   GET /api/orders
 * @desc    Get user order history
 * @access  User only
 */
router.get("/", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/orders/admin
 * @desc    Get all orders (Admin)
 * @access  Admin only
 */

router.get("/admin", protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: "user",
            select: "name email"  // Admin can only see name & email, not password or other details
        }).populate("items.product");
        // console.log('orders-data-check',orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
/**
 * @route   PUT /api/orders/:id
 * @desc    Admin updates order status
 * @access  Admin only
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = req.body.status || order.status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



// // Email Configuration
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "your-email@gmail.com",  // Replace with your email
//         pass: "your-email-password"    // Replace with your app password
//     }
// });

// /**
//  * @route   PUT /api/orders/:id
//  * @desc    Admin updates order status & sends email notification
//  * @access  Admin only
//  */
// router.put("/:id", protect, adminOnly, async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id);
//         if (!order) return res.status(404).json({ message: "Order not found" });

//         // Update order status
//         order.status = req.body.status || order.status;
//         await order.save();

//         // Send Email Notification
//         const mailOptions = {
//             from: "your-email@gmail.com",
//             to: "manna.sibsankar8@gmail.com",  // Admin email
//             subject: `Order #${order._id} Status Updated`,
//             text: `The status of order ${order._id} has been updated to: ${order.status}`
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error("Email Error:", error);
//             } else {
//                 console.log("Email sent:", info.response);
//             }
//         });

//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.delete("/delete-all", protect, adminOnly, async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: "All orders deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



export default router;
