import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, DollarSign, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, orders] = await Promise.all([
          apiClient('/api/products/'),
          apiClient('/api/orders/')
        ]);
        
        const activeOrders = orders.filter(o => o.status !== 'Cancelled');
        const totalRevenue = activeOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        
        setStats({
          products: products.length || 0,
          orders: orders.length || 0,
          revenue: totalRevenue
        });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8879A]" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-[#E8879A]' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1C1C1C]">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-[#6B6B6B] mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#F5C6D0]/30 shadow-sm flex items-center gap-3 md:gap-4">
              <div className={`p-3 md:p-4 rounded-full bg-gray-50 ${stat.color}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-[#6B6B6B]">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-[#1C1C1C] mt-0.5 md:mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#F5C6D0]/30 shadow-sm">
        <h2 className="text-base md:text-lg font-bold text-[#1C1C1C] mb-3 md:mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center h-48 text-[#6B6B6B]">
          More detailed analytics coming soon.
        </div>
      </div>
    </div>
  );
}
