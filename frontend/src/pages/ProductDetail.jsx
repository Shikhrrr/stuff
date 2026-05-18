import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getRelatedProducts, formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";
import SafeImage from "../components/ui/SafeImage";
import ProductCard from "../components/product/ProductCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-5xl">👟</p>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Product Not Found</h1>
        <p className="text-[#6B6B6B] text-sm">This shoe has walked away.</p>
        <Link to="/" className="text-[#E8879A] font-medium hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
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
            {!product.inStock && <Badge variant="gray">Out of Stock</Badge>}
          </div>

          {/* Name & rating */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1C1C1C] leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} viewBox="0 0 16 16" className={`w-4 h-4 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor">
                    <path d="M7.657 2.036a.4.4 0 0 1 .686 0l1.657 2.9 3.217.606a.4.4 0 0 1 .21.67L11.2 8.425l.477 3.242a.4.4 0 0 1-.573.41L8 10.605l-3.104 1.472a.4.4 0 0 1-.573-.41l.477-3.242L2.573 6.212a.4.4 0 0 1 .21-.67l3.217-.606 1.657-2.9Z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[#6B6B6B]">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#1C1C1C]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-[#BCBCBC] line-through">{formatPrice(product.originalPrice)}</span>
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
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1"
            >
              {added ? (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
                  </svg>
                  Added to Cart!
                </span>
              ) : !product.inStock ? (
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
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 pt-3 border-t border-[#F0E0E5]">
            {[
              { icon: "🚚", text: "Free delivery over ₹2000" },
              { icon: "↩️", text: "Easy 7-day returns" },
              { icon: "✅", text: "Authentic products" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
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
  );
}
