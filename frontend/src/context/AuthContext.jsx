import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Mock user data for demonstration
const MOCK_USER = {
  id: "u1",
  fullName: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91 98765 43210",
  address: "42 Rose Garden Colony, Kalyanpur, Kanpur - 208017, Uttar Pradesh",
  joinedDate: "January 2024",
};

const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    date: "15 Mar 2024",
    status: "Delivered",
    total: 3798,
    items: [
      { name: "Blush Ballet Flats", size: 37, qty: 1, price: 1299, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80" },
      { name: "Dusty Pink Sneakers", size: 38, qty: 1, price: 1999, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=80" },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "28 Apr 2024",
    status: "Shipped",
    total: 2499,
    items: [
      { name: "Rose Ankle Boots", size: 38, qty: 1, price: 2499, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&q=80" },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "10 May 2024",
    status: "Processing",
    total: 1599,
    items: [
      { name: "Ivory Slip-On Loafers", size: 37, qty: 1, price: 1599, image: "https://images.unsplash.com/photo-1593757147298-e064ed1419e5?w=200&q=80" },
    ],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("shikhar_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("shikhar_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shikhar_user");
    }
  }, [user]);

  const login = (email, password) => {
    // Mock auth — accept any credentials
    if (!email || !password) return false;
    setUser({ ...MOCK_USER, email });
    return true;
  };

  const signup = (data) => {
    // Mock signup — accept any valid data
    if (!data.email || !data.password) return false;
    setUser({
      ...MOCK_USER,
      fullName: data.fullName || MOCK_USER.fullName,
      email: data.email,
      phone: data.phone || MOCK_USER.phone,
      address: data.address || MOCK_USER.address,
    });
    return true;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, orders: MOCK_ORDERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
