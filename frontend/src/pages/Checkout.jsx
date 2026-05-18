import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SafeImage from "../components/ui/SafeImage";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "upi", label: "UPI / GPay / PhonePe", icon: "📱" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const total = cartTotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.pincode.trim()) e.pincode = "Required";
    return e;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    clearCart();
  };

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    setErrors((p) => ({ ...p, [f]: undefined }));
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-4xl">
          ✅
        </div>
        <h1 className="font-display text-3xl font-bold text-[#1C1C1C]">Order Placed!</h1>
        <p className="text-sm text-[#6B6B6B] max-w-xs">
          Thank you for your purchase! Your order has been confirmed and will be delivered soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/orders" className="bg-[#E8879A] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-[#D4687C] transition-colors">
            Track My Order
          </Link>
          <Link to="/" className="border border-[#E0D0D5] text-[#1C1C1C] px-8 py-3 rounded-full font-medium text-sm hover:border-[#E8879A] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Your cart is empty</h1>
        <Link to="/" className="text-[#E8879A] font-medium hover:underline">← Back to Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid-bg-subtle min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-[#1C1C1C] mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Shipping + Payment */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Shipping info */}
              <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6">
                <h2 className="text-base font-semibold text-[#1C1C1C] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E8879A] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="co-name" label="Full Name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} required placeholder="Priya Sharma" />
                  <Input id="co-phone" label="Phone Number" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} required placeholder="+91 98765 43210" />
                  <Input id="co-email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} required placeholder="you@example.com" className="sm:col-span-2" />
                  <Input id="co-address" label="Street Address" value={form.address} onChange={set("address")} error={errors.address} required placeholder="House No., Street, Area" className="sm:col-span-2" />
                  <Input id="co-city" label="City" value={form.city} onChange={set("city")} error={errors.city} required placeholder="Kanpur" />
                  <Input id="co-state" label="State" value={form.state} onChange={set("state")} error={errors.state} required placeholder="Uttar Pradesh" />
                  <Input id="co-pin" label="PIN Code" value={form.pincode} onChange={set("pincode")} error={errors.pincode} required placeholder="208017" />
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-[#F0E0E5] p-6">
                <h2 className="text-base font-semibold text-[#1C1C1C] mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E8879A] text-white text-xs flex items-center justify-center font-bold">2</span>
                  Payment Method
                </h2>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map(({ id, label, icon }) => (
                    <label
                      key={id}
                      htmlFor={`pay-${id}`}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === id
                          ? "border-[#E8879A] bg-[#FDE8EE]"
                          : "border-[#E0D0D5] hover:border-[#F5C6D0]"
                      }`}
                    >
                      <input
                        type="radio"
                        id={`pay-${id}`}
                        name="payment"
                        value={id}
                        checked={paymentMethod === id}
                        onChange={() => setPaymentMethod(id)}
                        className="accent-[#E8879A]"
                      />
                      <span className="text-xl">{icon}</span>
                      <span className="text-sm font-medium text-[#1C1C1C]">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Card details placeholder */}
                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 border border-dashed border-[#F5C6D0] rounded-xl bg-[#FDF5F7]">
                    <p className="text-xs text-[#6B6B6B] text-center">
                      🔒 Card details will be collected securely via payment gateway (integration coming soon)
                    </p>
                  </div>
                )}
                {paymentMethod === "upi" && (
                  <div className="mt-4 p-4 border border-dashed border-[#F5C6D0] rounded-xl bg-[#FDF5F7]">
                    <p className="text-xs text-[#6B6B6B] text-center">
                      📱 UPI payment integration coming soon. You'll be redirected to your UPI app.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#F0E0E5] p-5 sticky top-24">
                <h2 className="text-base font-semibold text-[#1C1C1C] mb-4">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-4">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#F0E0E5] flex-shrink-0">
                        <SafeImage src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1C1C1C] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#6B6B6B]">Size {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-[#1C1C1C] flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#F0E0E5] mb-4" />

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal</span><span className="font-medium text-[#1C1C1C]">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-[#1C1C1C]"}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="h-px bg-[#F0E0E5] my-1" />
                  <div className="flex justify-between font-bold text-[#1C1C1C]">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-[#6B6B6B] text-center mt-3">🔒 Secure & encrypted checkout</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
