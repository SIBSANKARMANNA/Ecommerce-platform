import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole, logout } from "../services/authService";
import "./Layout.css"; // Use same styles for consistency

const Layout = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        if (role) {
            setUserRole(role);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        logout();
        setUserRole(null);
        setIsLoggedIn(false);
        window.location.href = "/"; // Redirect to login page
    };

    return (
        <>
            <header className="header">
                <nav className="nav">
                    <ul>
                        {userRole === "admin" && (
                            <>
                                <li><Link to="/admin">Admin Dashboard</Link></li>
                                <li><Link to="/orders/admin">Manage Orders</Link></li>
                                <li><Link to="/products/add">Add Products</Link></li>
                                {/* <li><Link to="/cart">Cart</Link></li> */}
                            </>
                        )}
                        <li><Link to="/products">Products</Link></li>
                        
                        {isLoggedIn ? (
                            <>
                                <li><Link to="/cart">Cart</Link></li>
                                <li><Link to="/orders/user">My Orders</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                                
                            </>
                        ) : (
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <div className="content-container">{children}</div>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} My E-Commerce. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Layout;
