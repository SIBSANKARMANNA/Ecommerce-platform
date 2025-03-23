import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: false }, // URL for product image
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Admin who added the product
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
