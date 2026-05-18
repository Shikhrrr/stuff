// Reusable Button component
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8879A] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

  const variants = {
    primary:
      "bg-[#E8879A] text-white hover:bg-[#D4687C] active:scale-[0.98]",
    secondary:
      "bg-[#FDF5F7] text-[#E8879A] border border-[#F5C6D0] hover:bg-[#F5C6D0] active:scale-[0.98]",
    outline:
      "bg-transparent text-[#1C1C1C] border border-[#E0D0D5] hover:border-[#E8879A] hover:text-[#E8879A] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#6B6B6B] hover:text-[#E8879A] hover:bg-[#FDF5F7] active:scale-[0.98]",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2",
    xl: "px-10 py-4 text-base gap-2",
    icon: "w-9 h-9 p-0",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
