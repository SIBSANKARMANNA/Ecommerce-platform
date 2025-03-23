import { createContext, useState, useEffect } from "react";
import axios from "../utils/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const { data} = await axios.post("/auth/login", { email, password });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            // console.log('authContext user data',data);
            // console.log('token during login',data.token);
            localStorage.setItem('token',data.token);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    // Register function
    const register = async (name, email, password, role) => {
        try {
            const { data } = await axios.post("/auth/register", { name, email, password, role });
            setUser(data);
            // localStorage.setItem("user", JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
