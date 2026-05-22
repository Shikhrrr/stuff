import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { apiClient } from "../api/client";
import HeroCarousel from "../components/home/HeroCarousel";
import TrendingStrip from "../components/home/TrendingStrip";
import CategoryStrip from "../components/home/CategoryStrip";
import ProductCard from "../components/product/ProductCard";
import { MAP_EMBED_SRC, STORE_ADDRESS } from "../constants/storeLocation";

const categories = [
  {
    id: "women",
    label: "Women's Shoes",
    description: "From ballet flats to bold heels",
  },
  {
    id: "men",
    label: "Men's Shoes",
    description: "Classic craftsmanship, modern fit",
  },
  {
    id: "kids",
    label: "Kids' Shoes",
    description: "Built for little adventurers",
  },
];

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await apiClient(`/products/?search=${encodeURIComponent(query)}`);
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#E8879A]" />
      </div>
    );
  }

  return (
    <div className="grid-bg-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
            Search results for "{query}"
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{results.length} product{results.length !== 1 ? 's' : ''} found</p>
        </div>

        {results.length > 0 ? (
          <>
            {/* First two rows of results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {results.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {results.length > 8 && (
              <div className="text-center mt-8">
                <Link
                  to={`/women?search=${encodeURIComponent(query)}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#E8879A] hover:underline underline-offset-2"
                >
                  View all {results.length} results →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#FDE8EE] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[#E8879A]" />
            </div>
            <p className="text-[#6B6B6B] text-sm mb-6">No products found matching your search.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#E8879A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#D4687C] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Link>
          </div>
        )}

        {/* Back to Homepage link */}
        <div className="text-center mt-10 pt-8 border-t border-[#F0E0E5]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B6B6B] hover:text-[#E8879A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  if (query) {
    return <SearchResults query={query} />;
  }

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      {/* Category tiles quick-nav */}
      <section className="grid-bg-subtle py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-6">
            Explore Categories
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                to: "/women",
                label: "Women",
                desc: "Shop the season's must-haves",
                image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80",
              },
              {
                to: "/men",
                label: "Men",
                desc: "Classic & contemporary styles",
                image: "https://images.unsplash.com/photo-1605408499391-6368c628ef42?auto=format&fit=crop&w=800&q=80",
              },
              {
                to: "/kids",
                label: "Kids",
                desc: "Fun, durable footwear",
                image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
              },
            ].map(({ to, label, desc, image }) => (
              <Link
                key={to}
                to={to}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[2/3] block"
                aria-label={`Shop ${label}'s shoes`}
              >
                <img
                  src={image}
                  alt={`${label}'s shoes`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="font-display font-bold text-white text-lg sm:text-2xl leading-tight">
                    {label}
                  </p>
                  <p className="text-white/75 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    {desc}
                  </p>
                  <span className="mt-2 hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    Shop now
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5">
                      <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending scroll */}
      <TrendingStrip />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-[#F0E0E5]" />
      </div>

      {/* Category strips */}
      <div className="grid-bg-subtle">
        {categories.map((cat, i) => (
          <div key={cat.id}>
            <CategoryStrip
              category={cat.id}
              label={cat.label}
              description={cat.description}
            />
            {i < categories.length - 1 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-[#F0E0E5]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Store promo banner */}
      <section className="py-14 bg-[#E8879A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 text-sm font-medium uppercase tracking-[0.2em] mb-3">Visit Us</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Come Visit Our Store
          </h2>
          <p className="text-white/80 text-base mb-6 max-w-lg mx-auto">
            {STORE_ADDRESS}
          </p>

          <div className="max-w-3xl mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-white">
            <div className="aspect-[16/9] sm:aspect-[2/1] w-full">
              <iframe
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shikhar Shoes store location on Google Maps"
                aria-label="Map showing Shikhar Shoes at Purana Shivali Road, Kalyanpur, Kanpur"
                className="w-full h-full min-h-[220px] sm:min-h-[280px]"
              />
            </div>
          </div>

          <Link
            to="/location"
            className="inline-flex items-center gap-2 bg-white text-[#E8879A] font-semibold px-8 py-3.5 rounded-full hover:bg-[#FDE8EE] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.313-.066l.003-.001.016-.007.052-.023A10.14 10.14 0 0 0 12 17.538c.205-.221.404-.457.595-.7C14.066 14.95 16 11.89 16 8c0-3.314-2.686-6-6-6S4 4.686 4 8c0 3.89 1.934 6.95 3.405 8.838.191.243.39.479.595.7a10.144 10.144 0 0 0 1.673 1.357l.052.023.016.007Zm.31-8.933a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd"/>
            </svg>
            Get Directions
          </Link>
        </div>
      </section>
    </div>
  );
}
