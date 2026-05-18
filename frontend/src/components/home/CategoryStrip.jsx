import { Link } from "react-router-dom";
import { getProductsByCategory } from "../../data/products";
import ProductCard from "../product/ProductCard";

export default function CategoryStrip({ category, label, description }) {
  const products = getProductsByCategory(category).slice(0, 8);
  const categoryPath = `/${category}`;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#E8879A] uppercase tracking-widest mb-1">
              {category}
            </p>
            <Link
              to={categoryPath}
              className="group inline-flex items-center gap-2"
              aria-label={`Browse all ${label}`}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1C1C] group-hover:text-[#E8879A] transition-colors">
                {label}
              </h2>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-[#E8879A] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd"/>
              </svg>
            </Link>
            {description && (
              <p className="text-sm text-[#6B6B6B] mt-1">{description}</p>
            )}
          </div>
          <Link
            to={categoryPath}
            className="text-sm font-medium text-[#E8879A] hover:underline underline-offset-2 whitespace-nowrap"
          >
            View More →
          </Link>
        </div>

        {/* Horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="scroll-strip -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-4 sm:gap-5">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="w-48 sm:w-auto flex-shrink-0 sm:flex-shrink">
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
