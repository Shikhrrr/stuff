import { Link } from "react-router-dom";
import { getTrendingProducts } from "../../data/products";
import { formatPrice } from "../../data/products";
import SafeImage from "../ui/SafeImage";

export default function TrendingStrip() {
  const trending = getTrendingProducts();
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
        <div className="flex animate-scroll-left gap-4 pl-4">
          {doubled.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-44 sm:w-52 group"
              aria-label={`${product.name} — ${formatPrice(product.price)}`}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FDF5F7] border border-[#F0E0E5] group-hover:border-[#F5C6D0] transition-all mb-2.5">
                <SafeImage
                  src={product.image}
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
