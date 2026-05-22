import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import StoreLocation from "./pages/StoreLocation";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-8xl font-bold text-[#F5C6D0]">404</p>
      <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Page Not Found</h1>
      <p className="text-sm text-[#6B6B6B]">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-2 bg-[#E8879A] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-[#D4687C] transition-colors">
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Control Panel Routes (Custom Admin Dashboard) */}
            <Route path="/control-panel" element={<ProtectedRoute requireAdmin={true} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>

            {/* Main Storefront Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="product/:id" element={<ProductDetail />} />
              
              <Route path="women" element={<CategoryPage />} />
              <Route path="men" element={<CategoryPage />} />
              <Route path="kids" element={<CategoryPage />} />
              
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
              </Route>
              
              <Route path="location" element={<StoreLocation />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
