import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createProduct } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import Layout from "../../pages/Layout";
import './AddProduct.css';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""
    });
    // console.log('add-product-user',user);
    const [error, setError] = useState("");

    if (!user || user.role !== "admin") {
        return <p>Access denied. Only admins can add products.</p>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(formData);
            navigate("/products");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
        <div className="add-product">
            <h2>Add Product</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock" onChange={handleChange} required />
                <input type="text" name="image" placeholder="Image URL" onChange={handleChange} />
                <button type="submit">Add Product</button>
            </form>
        </div>
        </Layout>
    );
};

export default AddProduct;
