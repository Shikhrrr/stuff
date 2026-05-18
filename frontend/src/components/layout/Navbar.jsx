import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/women", label: "Women" },
  { to: "/men", label: "Men" },
  { to: "/kids", label: "Kids" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setProfileOpen(false); // close dropdown on any scroll
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const activeClass = "text-[#E8879A] font-semibold";
  const inactiveClass = "text-[#1C1C1C] hover:text-[#E8879A]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[#F0E0E5]" : "bg-[#FAF8F5]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="Shikhar Shoes — Home"
          >
            <span className="text-[#E8879A]">
              <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
                <path d="M28 18c0 0-2-2-6-2c-1.5 0-3 .4-4.5 1L14 18c-2 .8-4 1-6 .5L4 18c-1-.3-2 .3-2 1.5V22c0 1 .8 2 2 2h24c1 0 2-.8 2-2v-2c0-1-.8-2-2-2z" opacity="0.3"/>
                <path d="M6 18.5c1.5.3 3.2.2 5-.4l3.5-1.3c1.2-.5 2.5-.8 3.5-.8c2.8 0 4.8 1 5.5 1.5H28c1.2 0 2 .8 2 2V22c0 1.2-.8 2-2 2H4c-1.2 0-2-.8-2-2v-2.5c0-.8.7-1.3 1.5-1.2L6 18.5z"/>
                <path d="M10 18l1-6h2l2 4 2-2h3l1 4H10z" fill="#E8879A"/>
              </svg>
            </span>
            <span className="font-display font-bold text-xl text-[#1C1C1C] tracking-tight">
              Shikhar<span className="text-[#E8879A]">Shoes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-150 ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Store Location */}
            <NavLink
              to="/location"
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 ${
                  isActive ? "text-[#E8879A]" : "text-[#6B6B6B] hover:text-[#E8879A]"
                }`
              }
              aria-label="Store Location"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.313-.066l.003-.001.016-.007.052-.023A10.14 10.14 0 0012 17.538c.205-.221.404-.457.595-.7C14.066 14.95 16 11.89 16 8c0-3.314-2.686-6-6-6S4 4.686 4 8c0 3.89 1.934 6.95 3.405 8.838.191.243.39.479.595.7a10.144 10.144 0 001.673 1.357l.052.023.016.007zm.31-8.933a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </NavLink>

            {/* Orders */}
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 ${
                  isActive ? "text-[#E8879A]" : "text-[#6B6B6B] hover:text-[#E8879A]"
                }`
              }
              aria-label="My Orders"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative text-sm font-medium px-3 py-1.5 rounded-full transition-colors duration-150 ${
                  isActive ? "text-[#E8879A]" : "text-[#6B6B6B] hover:text-[#E8879A]"
                }`
              }
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8879A] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px] px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-[#FDF5F7] border border-[#F5C6D0] text-sm font-medium text-[#1C1C1C] hover:border-[#E8879A] transition-all"
                  aria-label="User menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E8879A] text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName?.split(" ")[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 text-[#6B6B6B] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}>
                    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                  </svg>
                </button>
                <div className={`absolute right-0 top-full mt-2 w-44 bg-white border border-[#F0E0E5] rounded-2xl overflow-hidden transition-all duration-200 ${
                  profileOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-1 pointer-events-none"
                }`}>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1C1C1C] hover:bg-[#FDF5F7] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8879A]"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"/></svg>
                    My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1C1C1C] hover:bg-[#FDF5F7] transition-colors border-t border-[#F0E0E5]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8879A]"><path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Z"/></svg>
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-[#F0E0E5] w-full text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd"/><path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.08a.75.75 0 1 0-1.092-1.022l-2.5 2.575a.75.75 0 0 0 0 1.046l2.5 2.575a.75.75 0 1 0 1.09-1.022L8.704 10.75h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd"/></svg>
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-[#6B6B6B] hover:text-[#E8879A] transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium bg-[#E8879A] text-white px-5 py-2 rounded-full hover:bg-[#D4687C] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <NavLink
              to="/cart"
              className="relative p-2 text-[#1C1C1C]"
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#E8879A] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 text-[#1C1C1C] rounded-lg hover:bg-[#FDF5F7] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden menu-slide-down border-t border-[#F0E0E5] pb-4 bg-[#FAF8F5]">
            <div className="flex flex-col py-2 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
                      isActive
                        ? "bg-[#FDE8EE] text-[#E8879A]"
                        : "text-[#1C1C1C] hover:bg-[#FDF5F7]"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
                    isActive ? "bg-[#FDE8EE] text-[#E8879A]" : "text-[#1C1C1C] hover:bg-[#FDF5F7]"
                  }`
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/location"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
                    isActive ? "bg-[#FDE8EE] text-[#E8879A]" : "text-[#1C1C1C] hover:bg-[#FDF5F7]"
                  }`
                }
              >
                Store Location
              </NavLink>
              <div className="h-px bg-[#F0E0E5] mx-4 my-2" />
              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg mx-2 text-[#1C1C1C] hover:bg-[#FDF5F7] transition-colors flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E8879A] text-white flex items-center justify-center text-xs font-bold">
                      {user.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                    {user.fullName}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg mx-2 text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mx-2 mt-1">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-center rounded-full border border-[#F0E0E5] text-[#1C1C1C] hover:border-[#E8879A] transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-center rounded-full bg-[#E8879A] text-white hover:bg-[#D4687C] transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
