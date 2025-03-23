import { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../../services/cartService";
import { placeOrder } from "../../services/orderService";
import './Cart.css';
import Layout from "../../pages/Layout";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadCart = async () => {
            const data = await getCart();
            setCartItems(data.items);
        };
        loadCart();
    }, []);

    const handleRemove = async (id) => {
        await removeFromCart(id);
        setCartItems(cartItems.filter((item) => item._id !== id));
    };

    const handlePlaceOrder = async () => {
        try {
            await placeOrder(cartItems);
            setMessage("Order placed successfully!");
            setCartItems([]);
        } catch (err) {
            setMessage("Failed to place order.");
        }
    };

    return (
        <Layout>
            <div className="cart">
                <h2>Shopping Cart</h2>
                {message && <p className="message">{message}</p>}

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <div className="cart-grid">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h3>{item.product.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.product.price}</p>
                                        <button onClick={() => handleRemove(item._id)} className="remove-btn">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Cart;
