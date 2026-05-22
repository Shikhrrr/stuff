import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../../api/client";
import SafeImage from "../ui/SafeImage";
import { apiClient } from "../../api/client";

// Simple local formatPrice fallback since we are deleting products.js soon
const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

export default function TrendingStrip() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await apiClient('/products/trending/');
        setTrending(data);
      } catch (err) {
        console.error("Failed to fetch trending products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-[#FAF8F5] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </section>
    );
  }

  // Duplicate for seamless infinite loop
  const doubled = [...trending, ...trending];

  return (
    <section className="py-12 overflow-hidden bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#E8879A] uppercase tracking-widest mb-1">Live Now</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
            Trending This Week
          </h2>
        </div>
        <Link
          to="/women"
          className="text-sm font-medium text-[#E8879A] hover:underline underline-offset-2"
        >
          View All →
        </Link>
      </div>

      {/* Infinite scroll track */}
      <div className="relative flex overflow-hidden">
        <div className="flex animate-scroll-left gap-4 pl-4 hover:[animation-play-state:paused]">
          {doubled.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-44 sm:w-52 group"
              aria-label={`${product.name} — ${formatPrice(product.price)}`}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FDF5F7] border border-[#F0E0E5] group-hover:border-[#F5C6D0] transition-all mb-2.5">
                <SafeImage
                  src={resolveImageUrl(product.primary_image_url)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] truncate px-0.5">{product.name}</p>
              <p className="text-sm font-bold text-[#E8879A] px-0.5">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
