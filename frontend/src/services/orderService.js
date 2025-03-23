import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const placeOrder = async (cartItems) => {
    console.log('cartItems',cartItems);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.post(API_URL, { cartItems }, config);
    return data;
};

export const getUserOrders = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.get(`${API_URL}`, config);
    return data;
};

export const getAllOrders = async () => {
    const token = localStorage.getItem("token");
    // console.log('admin token',token);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.get(`${API_URL}/admin`, config);
    // console.log('all orders',data);
    return data;
};

export const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.put(`${API_URL}/${orderId}`, { status }, config);
    return data;
};
