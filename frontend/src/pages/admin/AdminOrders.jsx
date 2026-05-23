import { useState, useEffect, useMemo } from 'react';
import { Search, Eye, EyeOff, Loader2, ChevronDown } from 'lucide-react';
import { apiClient } from '../../api/client';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-emerald-100 text-emerald-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'shipped': return 'bg-purple-100 text-purple-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/api/orders/');
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient(`/api/orders/${orderId}/`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert('Error updating order status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(o =>
      o.id?.toLowerCase().includes(q) ||
      o.user_email?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8879A]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#1C1C1C]">Orders</h1>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#BCBCBC] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-xl bg-white border border-[#F0E0E5] text-xs md:text-sm text-[#1C1C1C] placeholder:text-[#BCBCBC] focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-[#F5C6D0]/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#F5C6D0]/30 text-[10px] md:text-xs uppercase tracking-wider text-[#6B6B6B]">
                <th className="p-3 md:p-4 font-medium">Order</th>
                <th className="p-3 md:p-4 font-medium hidden sm:table-cell">Date</th>
                <th className="p-3 md:p-4 font-medium hidden md:table-cell">Customer</th>
                <th className="p-3 md:p-4 font-medium">Total</th>
                <th className="p-3 md:p-4 font-medium">Status</th>
                <th className="p-3 md:p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5C6D0]/30">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 md:p-4 text-xs md:text-sm font-medium text-[#1C1C1C] whitespace-nowrap">#{order.id}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-[#6B6B6B] hidden sm:table-cell whitespace-nowrap">
                    {order.date ? new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    }) : '-'}
                  </td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-[#6B6B6B] hidden md:table-cell truncate max-w-[120px]">{order.user_email || '-'}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-[#1C1C1C] font-medium whitespace-nowrap">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="p-3 md:p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`appearance-none px-2 md:px-3 py-1 md:py-1.5 pr-6 md:pr-8 rounded-full text-[10px] md:text-xs font-medium capitalize border-0 cursor-pointer outline-none focus:ring-2 focus:ring-[#E8879A]/40 ${getStatusColor(order.status || 'Pending')}`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-2.5 h-2.5 md:w-3 md:h-3 pointer-events-none absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-1.5 md:p-2 text-[#6B6B6B] hover:text-[#E8879A] hover:bg-[#E8879A]/10 rounded-lg transition-colors"
                      >
                        {expandedId === order.id ? (
                          <EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 md:p-8 text-center text-[#6B6B6B] text-sm">
                    {searchQuery ? `No orders matching "${searchQuery}".` : 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Order Detail */}
      {expandedId && (
        <div className="bg-white border border-[#F5C6D0]/30 rounded-3xl overflow-hidden shadow-sm">
          {(() => {
            const order = orders.find(o => o.id === expandedId);
            if (!order) return null;
            return (
              <div className="p-6">
                <h3 className="text-base font-bold text-[#1C1C1C] mb-4">
                  Order #{order.id} — Items
                </h3>
                <div className="space-y-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                        {item.product_image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.product_name}</p>
                          <p className="text-xs text-[#6B6B6B]">Size {item.size} · Qty {item.qty}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1C1C1C]">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6B6B6B]">No items found for this order.</p>
                  )}
                </div>
                {order.shipping_address && (
                  <div className="mt-4 pt-4 border-t border-[#F5C6D0]/30">
                    <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Shipping Address</p>
                    <p className="text-sm text-[#1C1C1C] mt-1">{order.shipping_address}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
