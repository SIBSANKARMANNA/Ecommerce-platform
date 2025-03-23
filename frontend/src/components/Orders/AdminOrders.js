import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import "./AdminOrders.css";
import Layout from "../../pages/Layout";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders(
                orders.map((order) =>
                    order._id === orderId ? { ...order, status } : order
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
            <div className="orders">
                <h2>All Orders</h2>
                {error && <p className="error">{error}</p>}
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="order-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                {/* <h3>Order ID: {order._id}</h3> */}
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Total Items:</strong> {order.items.length}</p>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Shipped">Shipped</option>
                                    {/* <option value="Delivered">Delivered</option> */}
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <div className="order-items-grid">
                                    {order.items.map((item) => (
                                        <div key={item.product._id} className="order-item">
                                            <img src={item.product.image} alt={item.product.name} />
                                            <p><strong>{item.product.name}</strong></p>
                                            <p>Price: ${item.product.price}</p>
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminOrders;
