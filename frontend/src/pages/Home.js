import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import Home-specific styles
import '../pages/Layout';
import Layout from "../pages/Layout";

const Home = () => {
    return (
        <Layout>
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to Our E-Commerce Store</h1>
                <p>Discover amazing products at unbeatable prices!</p>
                <Link to="/products" className="shop-btn">Shop Now</Link>
            </section>
            
        </div>
        </Layout>
    );
};

export default Home;

