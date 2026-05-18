import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulated network
    const ok = login(form.email, form.password);
    setLoading(false);
    if (ok) navigate("/");
    else setErrors({ password: "Invalid credentials. Try any email + 6+ char password." });
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-64px)] grid-bg-subtle flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#F0E0E5] p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FDE8EE] mb-4">
              <svg viewBox="0 0 32 32" fill="#E8879A" className="w-7 h-7">
                <path d="M28 18c0 0-2-2-6-2c-1.5 0-3 .4-4.5 1L14 18c-2 .8-4 1-6 .5L4 18c-1-.3-2 .3-2 1.5V22c0 1 .8 2 2 2h24c1 0 2-.8 2-2v-2c0-1-.8-2-2-2z" opacity="0.3"/>
                <path d="M6 18.5c1.5.3 3.2.2 5-.4l3.5-1.3c1.2-.5 2.5-.8 3.5-.8c2.8 0 4.8 1 5.5 1.5H28c1.2 0 2 .8 2 2V22c0 1.2-.8 2-2 2H4c-1.2 0-2-.8-2-2v-2.5c0-.8.7-1.3 1.5-1.2L6 18.5z"/>
                <path d="M10 18l1-6h2l2 4 2-2h3l1 4H10z" fill="#E8879A"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Welcome Back</h1>
            <p className="text-sm text-[#6B6B6B] mt-1">Sign in to your ShikharShoes account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email Address"
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#6B6B6B]">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#E8879A]"
                  id="remember-me"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[#E8879A] cursor-pointer hover:underline">Forgot password?</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#E8879A] font-medium hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
