import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

export const addReview = async (productId, rating, comment) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.post(API_URL, { productId, rating, comment }, config);
    return data;
};

export const getReviews = async (productId) => {
    const { data } = await axios.get(`${API_URL}/${productId}`);
    // console.log('get reviews',data);
    return data;
};

export const editReview = async (reviewId, rating, comment) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.put(`${API_URL}/${reviewId}`, { rating, comment }, config);
    return data;
};

export const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.delete(`${API_URL}/${reviewId}`, config);
    console.log('deleteReview',data);
    return data;
};
