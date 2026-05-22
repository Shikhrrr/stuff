import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { apiClient } from "../api/client";
import { getCategoryBanner } from "../constants/categoryBanners";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function CategoryPage() {
  const { category: paramCategory } = useParams();
  const { pathname } = useLocation();
  const categoryId = paramCategory || pathname.replace(/^\//, "").split("/")[0] || "women";

  const [meta, setMeta] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [sort, setSort] = useState("default");
  const [tagFilter, setTagFilter] = useState("all");

  const tags = ["all", "trending", "new", "bestseller"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          apiClient(`/categories/${categoryId}/`),
          apiClient(`/products/?category=${categoryId}`)
        ]);
        setMeta(catData);
        setAllProducts(prodData);
      } catch (err) {
        console.error("Error fetching category data", err);
        setMeta({ label: "Shoes", description: "" });
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const filtered = allProducts
    .filter((p) => tagFilter === "all" || p.tags.includes(tagFilter))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  if (loading) {
    return (
      <div className="grid-bg-subtle min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8879A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const banner = getCategoryBanner(categoryId);

  return (
    <div className="grid-bg-subtle min-h-screen">
      {/* Category hero banner */}
      <div className="relative overflow-hidden border-b border-[#F0E0E5]">
        <img
          src={banner.src}
          alt={banner.alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: banner.objectPosition }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/97 via-[#FAF8F5]/88 to-transparent sm:via-[#FAF8F5]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-[220px] sm:min-h-[260px] flex flex-col justify-end">
          <nav className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#E8879A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#1C1C1C] font-medium">{meta.label}</span>
          </nav>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1C]">{meta.label}</h1>
              <p className="text-sm sm:text-base text-[#6B6B6B] mt-2">{meta.description}</p>
            </div>
            <span className="hidden sm:inline-flex text-sm text-[#6B6B6B] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#F0E0E5] whitespace-nowrap">
              {allProducts.length} products
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl border border-[#F0E0E5]">
          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all capitalize ${
                  tagFilter === tag
                    ? "bg-[#E8879A] text-white border-[#E8879A]"
                    : "bg-white text-[#6B6B6B] border-[#E0D0D5] hover:border-[#E8879A] hover:text-[#E8879A]"
                }`}
                aria-pressed={tagFilter === tag}
              >
                {tag === "all" ? "All" : tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#6B6B6B] whitespace-nowrap">Sort by:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-[#E0D0D5] rounded-xl px-3 py-1.5 bg-white text-[#1C1C1C] outline-none focus:border-[#E8879A] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-[#6B6B6B] text-sm">No products match this filter.</p>
            <button
              onClick={() => setTagFilter("all")}
              className="mt-4 text-sm text-[#E8879A] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
