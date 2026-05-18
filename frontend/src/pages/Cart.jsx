import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import SafeImage from "../components/ui/SafeImage";
import Button from "../components/ui/Button";

function CartItem({ item, onUpdateQty, onRemove }) {
  const { product, size, quantity, key } = item;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="flex gap-4 py-5 border-b border-[#F0E0E5] last:border-b-0 animate-fade-in">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-[#F0E0E5] bg-[#FDF5F7]">
        <SafeImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/product/${product.id}`} className="text-sm font-semibold text-[#1C1C1C] hover:text-[#E8879A] transition-colors line-clamp-2">
              {product.name}
            </Link>
            <p className="text-xs text-[#6B6B6B] mt-0.5 capitalize">{product.category} · Size {size}</p>
          </div>
          <button
            onClick={() => onRemove(key)}
            className="text-[#BCBCBC] hover:text-red-400 transition-colors flex-shrink-0 p-1"
            aria-label={`Remove ${product.name} from cart`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Qty control */}
          <div className="flex items-center border border-[#E0D0D5] rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdateQty(key, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:bg-[#FDF5F7] transition-colors font-medium"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
            <button
              onClick={() => onUpdateQty(key, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:bg-[#FDF5F7] transition-colors font-medium"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-bold text-[#1C1C1C]">{formatPrice(product.price * quantity)}</p>
            {discount && (
              <p className="text-xs text-[#E8879A]">{discount}% off</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const finalTotal = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] grid-bg-subtle flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-6xl mb-2">🛍️</div>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Your cart is empty</h1>
        <p className="text-sm text-[#6B6B6B] max-w-xs">
          Looks like you haven't added anything yet. Start browsing our collection!
        </p>
        <Link
          to="/"
          className="mt-2 bg-[#E8879A] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-[#D4687C] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid-bg-subtle min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-[#1C1C1C] mb-8">
          My Cart
          <span className="ml-3 text-lg font-normal text-[#6B6B6B]">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#F0E0E5] px-5">
              {items.map((item) => (
                <CartItem
                  key={item.key}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Link to="/" className="text-sm text-[#6B6B6B] hover:text-[#E8879A] transition-colors flex items-center gap-1">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#F0E0E5] p-5 sticky top-24">
              <h2 className="text-base font-semibold text-[#1C1C1C] mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-[#1C1C1C]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-[#1C1C1C]"}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#6B6B6B] bg-[#FDF5F7] rounded-xl p-3">
                    Add {formatPrice(2000 - cartTotal)} more for free delivery!
                  </p>
                )}
                <div className="h-px bg-[#F0E0E5] my-1" />
                <div className="flex justify-between font-bold text-[#1C1C1C] text-base">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Coupon placeholder */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 text-sm border border-[#E0D0D5] rounded-xl outline-none focus:border-[#E8879A] bg-white"
                  aria-label="Coupon code"
                />
                <button className="px-4 py-2 text-sm font-medium text-[#E8879A] border border-[#E8879A] rounded-xl hover:bg-[#FDE8EE] transition-colors">
                  Apply
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>

              {/* Trust */}
              <div className="mt-4 flex flex-col gap-1.5 text-xs text-[#6B6B6B]">
                <span className="flex items-center gap-2"><span>🔒</span> Secure checkout</span>
                <span className="flex items-center gap-2"><span>↩️</span> Easy 7-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
