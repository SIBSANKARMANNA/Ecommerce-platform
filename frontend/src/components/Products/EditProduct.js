import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../../services/productService";
import { AuthContext } from "../../context/AuthContext";
import Layout from "../../pages/Layout";
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const product = await fetchProductById(id);
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    stock: product.stock,
                    image: product.image
                });
            } catch (err) {
                setError(err.message);
            }
        };
        loadProduct();
    }, [id]);

    if (!user || user.role !== "admin") {
        return <p>Access denied. Only admins can edit products.</p>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, formData);
            navigate("/products");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
        <div className="edit-product">
            <h2>Edit Product</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                <input type="text" name="image" value={formData.image} onChange={handleChange} />
                <button type="submit">Update Product</button>
            </form>
        </div>
          </Layout>
    );
};

export default EditProduct;
