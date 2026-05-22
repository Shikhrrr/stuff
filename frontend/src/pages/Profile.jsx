import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../api/client";
import SafeImage from "../components/ui/SafeImage";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

// Simple local formatPrice fallback
const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

const STATUS_BADGE = {
  Delivered: "green",
  Shipped: "blue",
  Processing: "amber",
  Cancelled: "red",
};

export default function Profile() {
  const { user, updateProfile, logout, orders } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || "", phone: user?.phone || "", address: user?.address || "" });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">🔐</p>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Please log in</h1>
        <p className="text-sm text-[#6B6B6B]">You need to be logged in to view your profile.</p>
        <div className="flex gap-3">
          <Link to="/login" className="bg-[#E8879A] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#D4687C] transition-colors">
            Login
          </Link>
          <Link to="/signup" className="border border-[#E0D0D5] text-[#1C1C1C] px-6 py-2.5 rounded-full font-medium text-sm hover:border-[#E8879A] transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const safeOrders = orders || [];
  const recentOrders = safeOrders.slice(0, 2);

  return (
    <div className="grid-bg-subtle min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-[#1C1C1C] mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0E0E5] p-6">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F0E0E5]">
              <div className="w-16 h-16 rounded-full bg-[#E8879A] text-white flex items-center justify-center text-2xl font-bold font-display">
                {user.fullName?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1C1C1C]">{user.fullName}</h2>
                <p className="text-sm text-[#6B6B6B]">{user.email}</p>
                <p className="text-xs text-[#BCBCBC] mt-0.5">Member since {user.joinedDate || "recently"}</p>
              </div>
            </div>

            {/* Fields */}
            {editing ? (
              <div className="flex flex-col gap-4">
                <Input id="p-name" label="Full Name" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                <Input id="p-phone" label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="p-address" className="text-sm font-medium text-[#1C1C1C]">Address</label>
                  <textarea
                    id="p-address"
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#F0E0E5] focus:border-[#E8879A] focus:ring-2 focus:ring-[#F5C6D0] outline-none transition-all resize-none bg-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" size="md" onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {[
                  { label: "Full Name", value: user.fullName, icon: "👤" },
                  { label: "Email", value: user.email, icon: "✉️" },
                  { label: "Phone", value: user.phone || "-", icon: "📞" },
                  { label: "Address", value: user.address || "-", icon: "📍" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{icon}</span>
                    <div>
                      <p className="text-xs font-medium text-[#6B6B6B] mb-0.5">{label}</p>
                      <p className="text-sm text-[#1C1C1C]">{value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2 border-t border-[#F0E0E5]">
                  <Button variant="primary" size="md" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="md" onClick={() => { logout(); navigate("/"); }}>
                    Log Out
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Stats sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#F0E0E5] p-5">
              <h3 className="text-sm font-semibold text-[#1C1C1C] mb-4">Account Stats</h3>
              {[
                { label: "Total Orders", value: safeOrders.length },
                { label: "Delivered", value: safeOrders.filter((o) => o.status === "Delivered").length },
                { label: "Processing", value: safeOrders.filter((o) => o.status === "Processing").length },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#F0E0E5] last:border-b-0">
                  <span className="text-xs text-[#6B6B6B]">{label}</span>
                  <span className="text-sm font-bold text-[#E8879A]">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#FDE8EE] rounded-2xl border border-[#F5C6D0] p-5">
              <p className="text-sm font-semibold text-[#C44A6A] mb-1">Free Shipping</p>
              <p className="text-xs text-[#C44A6A]/80">On all orders above ₹2,000</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1C1C1C]">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-[#E8879A] hover:underline">View All →</Link>
          </div>
          <div className="flex flex-col gap-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#F0E0E5] p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1C1C1C]">Order #{order.id}</p>
                    <p className="text-xs text-[#6B6B6B]">{new Date(order.created_at || order.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[order.status] || "gray"}>{order.status}</Badge>
                </div>
                <div className="flex gap-2 mb-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border border-[#F0E0E5] flex-shrink-0">
                      <SafeImage src={resolveImageUrl(item.product_image || item.image || "")} alt={item.product_name || item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 rounded-xl bg-[#FDF5F7] border border-[#F0E0E5] flex items-center justify-center text-xs text-[#6B6B6B] font-medium">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#6B6B6B]">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  <p className="text-sm font-bold text-[#1C1C1C]">{formatPrice(order.total_amount || order.total)}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="bg-white rounded-2xl border border-[#F0E0E5] p-5 text-center text-sm text-[#6B6B6B]">
                No recent orders found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
