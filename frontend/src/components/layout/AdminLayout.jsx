import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/control-panel', icon: LayoutDashboard },
    { name: 'Products', path: '/control-panel/products', icon: Package },
    { name: 'Orders', path: '/control-panel/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#F5C6D0]/30 flex flex-col">
        <div className="p-6 border-b border-[#F5C6D0]/30">
          <span className="font-display text-2xl font-bold tracking-tight text-[#1C1C1C]">
            Admin
            <span className="text-[#E8879A]">Panel</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/control-panel'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-[#E8879A]/10 text-[#E8879A] font-medium' 
                      : 'text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#1C1C1C]'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#F5C6D0]/30 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#E8879A] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Homepage
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#1C1C1C] transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
