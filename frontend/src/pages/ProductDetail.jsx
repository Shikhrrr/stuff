import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import SafeImage from "../components/ui/SafeImage";
import ProductCard from "../components/product/ProductCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

// Simple local formatPrice fallback
const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [prodData, relatedData] = await Promise.all([
          apiClient(`/api/products/${id}/`),
          apiClient(`/api/products/${id}/related/`)
        ]);
        setProduct(prodData);
        setRelated(relatedData);
        // Reset selections when product changes
        setActiveImage(0);
        setSelectedSize(null);
        setQuantity(1);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg-subtle flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8879A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen grid-bg-subtle flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-5xl">👟</p>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Product Not Found</h1>
        <p className="text-[#6B6B6B] text-sm">This shoe has walked away.</p>
        <Link to="/" className="text-[#E8879A] font-medium hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = () => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent(window.location.pathname)); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login?redirect=' + encodeURIComponent(window.location.pathname)); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen grid-bg-subtle">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#E8879A] transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/${product.category}`} className="hover:text-[#E8879A] transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#1C1C1C] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#FDF5F7] border border-[#F0E0E5]">
            <SafeImage
              src={product.gallery[activeImage]}
              alt={`${product.name} — view ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {product.gallery.length > 1 && (
            <div className="flex gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === activeImage ? "border-[#E8879A]" : "border-[#F0E0E5] hover:border-[#F5C6D0]"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <SafeImage src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.includes("trending") && <Badge variant="amber">Trending</Badge>}
            {product.tags.includes("new") && <Badge variant="blue">New Arrival</Badge>}
            {product.tags.includes("bestseller") && <Badge variant="pink">Bestseller</Badge>}
            {!product.in_stock && <Badge variant="gray">Out of Stock</Badge>}
          </div>

          {/* Name */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1C] leading-tight mb-2">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#1C1C1C]">{formatPrice(product.price)}</span>
            {product.original_price && (
              <>
                <span className="text-lg text-[#BCBCBC] line-through">{formatPrice(product.original_price)}</span>
                {discount && <Badge variant="pink">{discount}% off</Badge>}
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B6B6B] leading-relaxed border-t border-[#F0E0E5] pt-5">
            {product.description}
          </p>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#1C1C1C]">Select Size</p>
              <span className="text-xs text-[#E8879A] cursor-pointer hover:underline">Size Guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`min-w-[44px] h-10 px-3 text-sm font-medium rounded-xl border transition-all
                    ${selectedSize === size
                      ? "bg-[#E8879A] text-white border-[#E8879A]"
                      : "bg-white text-[#1C1C1C] border-[#E0D0D5] hover:border-[#E8879A]"
                    }`}
                  aria-pressed={selectedSize === size}
                  aria-label={`Size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-xs text-red-500 mt-2">Please select a size before adding to cart.</p>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3 pt-2">
            {/* Qty control */}
            <div className="flex items-center border border-[#E0D0D5] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center text-[#6B6B6B] hover:bg-[#FDF5F7] transition-colors text-lg font-medium"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-[#1C1C1C]" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center text-[#6B6B6B] hover:bg-[#FDF5F7] transition-colors text-lg font-medium"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="flex-1"
            >
              {added ? (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
                  </svg>
                  Added to Cart!
                </span>
              ) : !product.in_stock ? (
                "Out of Stock"
              ) : (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  Add to Cart
                </span>
              )}
            </Button>
            {product.in_stock && (
              <Button
                variant="primary"
                size="md"
                onClick={handleBuyNow}
                className="flex-1"
              >
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                  </svg>
                  Buy Now
                </span>
              </Button>
            )}
          </div>


        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-[#1C1C1C] mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </section>
      )}
    </div>
    </div>
  );
}
