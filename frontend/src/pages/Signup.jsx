import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const fields = [
  { id: "fullName",        label: "Full Name",         type: "text",     placeholder: "Priya Sharma",          autocomplete: "name" },
  { id: "phone",           label: "Phone Number",      type: "tel",      placeholder: "+91 98765 43210",        autocomplete: "tel" },
  { id: "email",           label: "Email Address",     type: "email",    placeholder: "you@example.com",        autocomplete: "email" },
  { id: "address",         label: "Full Address",      type: "text",     placeholder: "Street, City, State, PIN", autocomplete: "street-address" },
  { id: "password",        label: "Password",          type: "password", placeholder: "Min 6 characters",        autocomplete: "new-password" },
  { id: "confirmPassword", label: "Confirm Password",  type: "password", placeholder: "Repeat your password",    autocomplete: "new-password" },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", address: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const ok = signup(form);
    setLoading(false);
    if (ok) navigate("/");
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid-bg-subtle flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-[#F0E0E5] p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FDE8EE] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E8879A" className="w-7 h-7">
                <path d="M6.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM3.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM19.75 7.5a.75.75 0 0 0-1.5 0v2.25H16a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H22a.75.75 0 0 0 0-1.5h-2.25V7.5Z"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#1C1C1C]">Create Account</h1>
            <p className="text-sm text-[#6B6B6B] mt-1">Join ShikharShoes — it's free!</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.slice(0, 2).map((f) => (
                <Input
                  key={f.id}
                  id={`signup-${f.id}`}
                  label={f.label}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  error={errors[f.id]}
                  autoComplete={f.autocomplete}
                  required
                />
              ))}
            </div>
            {fields.slice(2, 4).map((f) => (
              <Input
                key={f.id}
                id={`signup-${f.id}`}
                label={f.label}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.id]}
                onChange={set(f.id)}
                error={errors[f.id]}
                autoComplete={f.autocomplete}
                required
              />
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.slice(4).map((f) => (
                <Input
                  key={f.id}
                  id={`signup-${f.id}`}
                  label={f.label}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.id]}
                  onChange={set(f.id)}
                  error={errors[f.id]}
                  autoComplete={f.autocomplete}
                  required
                />
              ))}
            </div>

            <p className="text-xs text-[#6B6B6B] mt-1">
              By creating an account, you agree to our{" "}
              <span className="text-[#E8879A] cursor-pointer hover:underline">Terms of Service</span>{" "}
              and{" "}
              <span className="text-[#E8879A] cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#E8879A] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
