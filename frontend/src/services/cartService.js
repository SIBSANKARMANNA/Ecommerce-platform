import axios from "axios";

const API_URL = "http://localhost:5000/api/cart";

export const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    // console.log('token from cart Service',token);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.post(`${API_URL}`, { productId, quantity }, config);
    return data;
};

export const getCart = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const { data } = await axios.get(API_URL, config);
    return data;
};

export const removeFromCart = async (cartItemId) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    await axios.delete(`${API_URL}/${cartItemId}`, config);
};
