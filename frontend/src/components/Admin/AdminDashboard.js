import { useEffect, useState } from "react";
import { fetchProducts } from "../../services/productService";
import { getAllUsers } from "../../services/userService";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import './AdminDashboard.css';
import Layout from "../../pages/Layout";

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadData = async () => {
            try {
                
                const productData = await fetchProducts();
                const userData = await getAllUsers();
                const orderData = await getAllOrders();
                setProducts(productData);
                setUsers(userData);
                setOrders(orderData);
                
            } catch (err) {
                setError("Error loading admin data.");
            }
        };
        loadData();
    }, [token]);

   

    // const handleDeleteUser = async (userId) => {
    //     try {
    //         await deleteUser(userId);
    //         setUsers(users.filter((user) => user._id !== userId));
    //     } catch (err) {
    //         setError("Error deleting user.");
    //     }
    // };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders(
                orders.map((order) =>
                    order._id === orderId ? { ...order, status } : order
                )
            );
        } catch (err) {
            setError("Error updating order status.");
        }
    };

    

    return (
         <Layout>
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {error && <p className="error">{error}</p>}

            <div className="section">
                <h3>Products</h3>
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>Name:-{product.name} - Price:-${product.price} - Stock:-{product.stock}</li>
                    ))}
                </ul>
            </div>

            <div className="section">
                <h3>Orders</h3>
                <ul >
                    {orders.map((order) => (
                        <li key={order._id}>
                            {order.user.name} - {order.status}
                            <button onClick={() => handleUpdateOrderStatus(order._id, "Shipped")}>Shipped</button>
                            <button onClick={() => handleUpdateOrderStatus(order._id, "Approved")}>Approved</button>
                            <button onClick={() => handleUpdateOrderStatus(order._id, "Cancelled")}>Cancel</button>
                        </li>
                    ))}
                </ul>
            </div>

             <div className="section">
                <h3>Users</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user._id}>Name:
                            {user.name}-------------------------------------------------Email:({user.email})
                            
                        </li>
                    ))}
                </ul>
            </div> 

            
        </div>
         </Layout>
    );
};

export default AdminDashboard;


