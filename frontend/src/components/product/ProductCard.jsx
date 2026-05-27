import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";
import SafeImage from "../ui/SafeImage";

// Simple local formatPrice fallback
const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

export default function ProductCard({ product, compact = false }) {
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const inCart = items.some((i) => i.product.id === product.id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login?redirect=' + encodeURIComponent(window.location.pathname)); return; }
    if (!product.in_stock || adding) return;
    const defaultSize = product.sizes?.[0];
    addToCart(product, defaultSize, 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={`
        group relative bg-white rounded-2xl overflow-hidden border border-[#F0E0E5]
        hover:border-[#F5C6D0] transition-all duration-300 hover:-translate-y-0.5
        flex flex-col
      `}
      aria-label={`${product.name} — ${formatPrice(product.price)}`}
    >
      {/* Image area */}
      <div className={`relative overflow-hidden bg-[#FDF5F7] ${compact ? "aspect-[3/3.5]" : "aspect-[3/3.5]"}`}>
        <SafeImage
          src={product.image || product.primary_image_url}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discount && discount > 0 && (
            <Badge variant="pink">{discount}% off</Badge>
          )}
          {product.tags.includes("new") && (
            <Badge variant="blue">New</Badge>
          )}
          {product.tags.includes("trending") && (
            <Badge variant="amber">Trending</Badge>
          )}
          {!product.in_stock && (
            <Badge variant="gray">Out of Stock</Badge>
          )}
        </div>

        {/* Quick Add button — appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.in_stock || adding}
            className="w-full bg-[#E8879A] text-white py-2.5 text-xs font-semibold tracking-wide disabled:bg-[#D4687C] disabled:cursor-not-allowed transition-colors hover:bg-[#D4687C]"
            aria-label={`Quick add ${product.name} to cart`}
          >
            {adding ? "Added ✓" : !product.in_stock ? "Out of Stock" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] font-medium text-[#E8879A] uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-[#1C1C1C] leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className={`w-3 h-3 ${star <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
              >
                <path d="M7.657 2.036a.4.4 0 0 1 .686 0l1.657 2.9 3.217.606a.4.4 0 0 1 .21.67L11.2 8.425l.477 3.242a.4.4 0 0 1-.573.41L8 10.605l-3.104 1.472a.4.4 0 0 1-.573-.41l.477-3.242L2.573 6.212a.4.4 0 0 1 .21-.67l3.217-.606 1.657-2.9Z"/>
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-[#6B6B6B]">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-bold text-[#1C1C1C]">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-xs text-[#BCBCBC] line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>

        {/* Cart indicator */}
        {inCart && (
          <p className="text-[10px] text-[#E8879A] font-medium mt-0.5">In cart</p>
        )}
      </div>
    </Link>
  );
}
