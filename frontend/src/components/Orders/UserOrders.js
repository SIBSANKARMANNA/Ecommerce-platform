

import { useState, useEffect } from "react";
import { getUserOrders } from "../../services/orderService";
import "./UserOrders.css";
import Layout from "../../pages/Layout";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getUserOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadOrders();
    }, []);

    return (
        <Layout>
            <div className="orders">
                <h2>My Orders</h2>
                {error && <p className="error">{error}</p>}
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li key={order._id} className="order-card">
                                {/* <h3>Order ID: {order._id}</h3> */}
                                <p>Status: {order.status}</p>
                                <p>Total Items: {order.items.length}</p>

                                <div className="order-items">
                                    {order.items.map((item) => (
                                        <div key={item.product._id} className="order-item">
                                            <img src={item.product.image} alt={item.product.name} className="order-image" />
                                            <div className="item-details">
                                                <p className="product-name">{item.product.name}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: ${item.product.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

export default UserOrders;
