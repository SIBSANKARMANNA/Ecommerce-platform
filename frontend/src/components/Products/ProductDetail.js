
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { AuthContext } from "../../context/AuthContext";
import ReviewSection from "../Reviews/ReviewSection";
import Layout from "../../pages/Layout";
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                setError("Error fetching product details.");
            }
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setMessage("You must be logged in to add items to the cart.");
            return;
        }
        try {
            await addToCart(id, quantity);
            setMessage("Item added to cart successfully!");
        } catch (err) {
            setMessage("Failed to add item to cart.");
        }
    };

    if (error) return <p className="error">{error}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <Layout>
        <div className="product-detail">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={handleAddToCart}>Add to Cart</button>
            {message && <p className="message">{message}</p>}

            {/* ✅ Integrated Review Section */}
            <ReviewSection productId={id} userId={user ? user._id : null} />
        </div>
        </Layout>
    );
};

export default ProductDetail;
