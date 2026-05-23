import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ArrowLeft, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/control-panel', icon: LayoutDashboard },
    { name: 'Products', path: '/control-panel/products', icon: Package },
    { name: 'Orders', path: '/control-panel/orders', icon: ShoppingBag },
  ];

  const sidebarContent = ({ collapsed, onClose }) => (
    <>
      <div className="p-6 border-b border-[#F5C6D0]/30 flex items-center justify-between">
        {collapsed ? (
          <span className="font-display text-xl font-bold text-[#E8879A] mx-auto">A</span>
        ) : (
          <>
            <span className="font-display text-2xl font-bold tracking-tight text-[#1C1C1C]">
              Admin
              <span className="text-[#E8879A]">Panel</span>
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/control-panel'}
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#E8879A]/10 text-[#E8879A] font-medium'
                    : 'text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#1C1C1C]'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#F5C6D0]/30 space-y-1">
        <Link
          to="/"
          onClick={() => onClose?.()}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#E8879A] transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to Homepage' : undefined}
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          {!collapsed && 'Back to Homepage'}
        </Link>
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-[#6B6B6B] hover:bg-[#FDFBF7] hover:text-[#1C1C1C] transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#F5C6D0]/30 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent({ collapsed: false, onClose: () => setSidebarOpen(false) })}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white border-r border-[#F5C6D0]/30
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        {sidebarContent({ collapsed: sidebarCollapsed })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 bg-[#FDFBF7] border-b border-[#F5C6D0]/30 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display text-lg font-bold tracking-tight text-[#1C1C1C]">
              Admin<span className="text-[#E8879A]">Panel</span>
            </span>
            <div className="w-9" />
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Desktop collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-30 w-6 h-6 items-center justify-center rounded-full bg-white border border-[#F5C6D0]/30 shadow-sm text-[#6B6B6B] hover:text-[#1C1C1C] hover:shadow-md transition-all duration-300"
        style={{
          left: sidebarCollapsed ? '4rem' : '16rem',
          marginLeft: '-0.75rem',
        }}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );
}
