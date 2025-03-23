import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProductList from "./components/Products/ProductList";
import ProductDetail from "./components/Products/ProductDetail";
import AddProduct from "./components/Products/AddProduct";
import EditProduct from "./components/Products/EditProduct";
import Cart from "./components/Cart/Cart";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import UserOrders from "./components/Orders/UserOrders";
import AdminOrders from "./components/Orders/AdminOrders";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Home from "./pages/Home";
// import Header from './pages/Header';
import Footer from './pages/Footer';
// import userService  from '.././src/services/userService';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path='/' element={<Header/>}/> */}
                    <Route path='/footer' element={<Footer/>}/>
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/orders/user" element={<UserOrders />} />
                    <Route path="/orders/admin" element={<AdminOrders />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    {/* <Route path='users' element={<userService/>}/> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
