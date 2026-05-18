// Badge component for tags/status labels
const variantMap = {
  pink: "bg-[#FDE8EE] text-[#C44A6A] border border-[#F5C6D0]",
  green: "bg-green-50 text-green-700 border border-green-200",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  gray: "bg-gray-100 text-gray-600 border border-gray-200",
  red: "bg-red-50 text-red-600 border border-red-200",
};

export default function Badge({ children, variant = "pink", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantMap[variant] || variantMap.pink}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
