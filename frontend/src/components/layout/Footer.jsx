import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#F0E0E5] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Shikhar Shoes Home">
              <span className="text-[#E8879A]">
                <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7">
                  <path d="M28 18c0 0-2-2-6-2c-1.5 0-3 .4-4.5 1L14 18c-2 .8-4 1-6 .5L4 18c-1-.3-2 .3-2 1.5V22c0 1 .8 2 2 2h24c1 0 2-.8 2-2v-2c0-1-.8-2-2-2z" opacity="0.3"/>
                  <path d="M6 18.5c1.5.3 3.2.2 5-.4l3.5-1.3c1.2-.5 2.5-.8 3.5-.8c2.8 0 4.8 1 5.5 1.5H28c1.2 0 2 .8 2 2V22c0 1.2-.8 2-2 2H4c-1.2 0-2-.8-2-2v-2.5c0-.8.7-1.3 1.5-1.2L6 18.5z"/>
                  <path d="M10 18l1-6h2l2 4 2-2h3l1 4H10z" fill="#E8879A"/>
                </svg>
              </span>
              <span className="font-display font-bold text-xl text-[#1C1C1C]">
                Shikhar<span className="text-[#E8879A]">Shoes</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-5">
              Premium footwear for the whole family. Step into style, comfort, and quality.
            </p>
            {/* Social placeholders */}
            <div className="flex items-center gap-3">
              {["instagram", "facebook", "twitter"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FDF5F7] border border-[#F0E0E5] flex items-center justify-center text-[#6B6B6B] hover:border-[#E8879A] hover:text-[#E8879A] transition-all"
                  aria-label={`Visit us on ${social}`}
                >
                  {social === "instagram" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  )}
                  {social === "facebook" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {social === "twitter" && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1C1C] mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/women", label: "Women's Shoes" },
                { to: "/men", label: "Men's Shoes" },
                { to: "/kids", label: "Kids' Shoes" },
                { to: "/cart", label: "My Cart" },
                { to: "/orders", label: "My Orders" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-[#6B6B6B] hover:text-[#E8879A] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1C1C] mb-4">Help</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Size Guide" },
                { label: "Shipping & Returns" },
                { label: "FAQ" },
                { to: "/location", label: "Store Location" },
                { label: "Contact Us" },
              ].map(({ to, label }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="text-sm text-[#6B6B6B] hover:text-[#E8879A] transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <span className="text-sm text-[#6B6B6B] cursor-default">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1C1C] mb-4">Find Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#6B6B6B]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 text-[#E8879A] flex-shrink-0">
                  <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.313-.066l.003-.001.016-.007.052-.023A10.14 10.14 0 0 0 12 17.538c.205-.221.404-.457.595-.7C14.066 14.95 16 11.89 16 8c0-3.314-2.686-6-6-6S4 4.686 4 8c0 3.89 1.934 6.95 3.405 8.838.191.243.39.479.595.7a10.144 10.144 0 0 0 1.673 1.357l.052.023.016.007Zm.31-8.933a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd"/>
                </svg>
                <span>337/A2, Purana Shivali Road<br/>Kalyanpur, Kanpur<br/>Uttar Pradesh 208017</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#6B6B6B]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8879A] flex-shrink-0">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd"/>
                </svg>
                <a href="tel:+919651969763" className="hover:text-[#E8879A] transition-colors">+91 96519 69763</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#6B6B6B]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8879A] flex-shrink-0">
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"/>
                  <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"/>
                </svg>
                <a href="mailto:dhirendrakanaujia@gmail.com" className="hover:text-[#E8879A] transition-colors">dhirendrakanaujia@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[#6B6B6B]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#E8879A] flex-shrink-0">
                  <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd"/>
                </svg>
                <span>Mon–Sun: 10am – 9:30pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#F0E0E5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B6B6B]">
            © {year} ShikharShoes. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
            <span className="cursor-default hover:text-[#E8879A] transition-colors">Privacy Policy</span>
            <span className="cursor-default hover:text-[#E8879A] transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
