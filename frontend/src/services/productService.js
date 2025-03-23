import api from "../utils/api";

export const fetchProducts = async () => {
    try {
        const { data } = await api.get("/products");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch products");
    }
};

export const fetchProductById = async (id) => {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Product not found");
    }
};

export const createProduct = async (productData) => {
    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await api.post("/products", productData,config);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create product");
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('product data',productData);
        const { data } = await api.put(`/products/${id}`, productData,config);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update product");
    }
};

export const deleteProduct = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.delete(`/products/${id}`,config);
        return { message: "Product deleted successfully" };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete product");
    }
};
