import { useState, useEffect, useContext } from "react";
import { fetchProducts, deleteProduct } from "../../services/productService";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./ProductList.css";
import Layout from "../../pages/Layout";

const ProductList = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter((product) => product._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <Layout>
            <div className="product-list">
                <h2>Products</h2>
                {error && <p className="error">{error}</p>}
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <Link to={`/products/${product._id}`}>
                                <h3>{product.name}</h3>
                                <img src={product.image} alt={product.name} className="product-image" />
                               
                            </Link>
                            <p className="product-description">{product.description}</p>
                            <p className="product-price">Price: ${product.price}</p>

                            {user && user.role === "admin" && (
                                <div className="product-actions">
                                    <Link to={`/products/edit/${product._id}`}>
                                        <button className="edit-btn">Edit</button>
                                    </Link>
                                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductList;
