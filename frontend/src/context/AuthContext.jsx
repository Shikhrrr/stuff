import { createContext, useContext, useState, useEffect } from "react";
import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userData = await apiClient('/api/auth/me/');
      setUser(userData);
      const ordersData = await apiClient('/api/orders/');
      setOrders(ordersData);
    } catch (err) {
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getAuthToken()) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiClient('/api/auth/login/', {
        body: { email, password }
      });
      if (data.access) {
        setAuthToken(data.access);
        await fetchUserData();
        // Return the latest user state from a fresh API call to avoid stale closure
        const userData = await apiClient('/api/auth/me/');
        return userData;
      }
      return null;
    } catch (err) {
      console.error("Login error", err);
      return null;
    }
  };

  const signup = async (data) => {
    try {
      await apiClient('/api/auth/register/', {
        body: {
          email: data.email,
          password: data.password,
          full_name: data.fullName,
          phone: data.phone || '',
          address: data.address || ''
        }
      });
      return await login(data.email, data.password);
    } catch (err) {
      console.error("Signup error", err);
      return false;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setOrders([]);
  };

  const refreshOrders = async () => {
    try {
      const ordersData = await apiClient('/api/orders/');
      setOrders(ordersData);
    } catch (err) {
      console.error("Failed to refresh orders", err);
    }
  };

  const updateProfile = async (updates) => {
    try {
      // Map frontend fields to backend if needed
      const backendUpdates = {
        full_name: updates.fullName || user.full_name,
        phone: updates.phone !== undefined ? updates.phone : user.phone,
        address: updates.address !== undefined ? updates.address : user.address,
      };
      const updatedUser = await apiClient('/api/auth/me/', {
        method: 'PATCH',
        body: backendUpdates
      });
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error("Update profile error", err);
      return false;
    }
  };

  const isAdmin = user?.is_staff || user?.is_superuser;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, refreshOrders, orders, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

