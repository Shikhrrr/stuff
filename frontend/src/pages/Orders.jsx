import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient, resolveImageUrl } from "../api/client";
import SafeImage from "../components/ui/SafeImage";
import Badge from "../components/ui/Badge";

// Simple local formatPrice fallback
const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

const STATUS_BADGE = {
  Delivered: "green",
  Shipped: "blue",
  Processing: "amber",
  Cancelled: "red",
};

const STATUS_STEPS = {
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
};

function OrderCard({ order, onCancel }) {
  const step = STATUS_STEPS[order.status] || 1;
  const orderDate = new Date(order.created_at || order.date).toLocaleDateString();
  const canCancel = order.status === 'Pending' || order.status === 'Processing';

  return (
    <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-base font-semibold text-[#1C1C1C]">Order #{order.id}</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">Placed on {orderDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={STATUS_BADGE[order.status] || "gray"}>{order.status}</Badge>
          <span className="text-sm font-bold text-[#1C1C1C]">{formatPrice(order.total_amount || order.total)}</span>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="flex items-center gap-0 mb-5">
        {["Processing", "Shipped", "Delivered"].map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = step >= stepNum;
          const isCurrent = step === stepNum;
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-[#E8879A] text-white"
                      : "bg-[#F0E0E5] text-[#BCBCBC]"
                  } ${isCurrent ? "ring-2 ring-[#F5C6D0] ring-offset-1" : ""}`}
                >
                  {isCompleted ? "✓" : stepNum}
                </div>
                <p className={`text-[10px] mt-1 font-medium whitespace-nowrap ${isCompleted ? "text-[#E8879A]" : "text-[#BCBCBC]"}`}>
                  {label}
                </p>
              </div>
              {i < 2 && (
                <div className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${step > stepNum ? "bg-[#E8879A]" : "bg-[#F0E0E5]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-t border-[#F0E0E5] first:border-t-0 first:pt-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#F0E0E5] flex-shrink-0 bg-[#FDF5F7]">
              {/* If using real API data, item may just have product_name, otherwise fallback to item.image */}
              <SafeImage src={resolveImageUrl(item.product_image || item.image || "")} alt={item.product_name || item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.product_name || item.name}</p>
              <p className="text-xs text-[#6B6B6B]">Size {item.size} · Qty {item.quantity || item.qty}</p>
            </div>
            <p className="text-sm font-semibold text-[#1C1C1C] flex-shrink-0">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 mt-4 pt-4 border-t border-[#F0E0E5]">
        {order.status === "Delivered" && (
          <button className="text-xs font-medium text-[#E8879A] border border-[#E8879A] px-4 py-1.5 rounded-full hover:bg-[#FDE8EE] transition-colors">
            Write a Review
          </button>
        )}
        <button className="text-xs font-medium text-[#6B6B6B] border border-[#E0D0D5] px-4 py-1.5 rounded-full hover:border-[#E8879A] hover:text-[#E8879A] transition-colors">
          View Details
        </button>
        {canCancel && (
          <button
            onClick={() => onCancel?.(order.id)}
            className="text-xs font-medium text-red-500 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors ml-auto"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  const { user, orders, refreshOrders } = useAuth();

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await apiClient(`/orders/${orderId}/cancel/`, { method: 'POST' });
      await refreshOrders();
    } catch (err) {
      console.error('Failed to cancel order', err);
      alert(err?.error || 'Failed to cancel order.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">📦</p>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Please log in</h1>
        <p className="text-sm text-[#6B6B6B]">Sign in to view your order history.</p>
        <Link to="/login" className="bg-[#E8879A] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#D4687C] transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid-bg-subtle min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-[#1C1C1C]">
            My Orders
            <span className="ml-3 text-lg font-normal text-[#6B6B6B]">({orders?.length || 0})</span>
          </h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#F0E0E5]">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-[#6B6B6B] text-sm mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="text-[#E8879A] font-medium hover:underline text-sm">Start Shopping →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
