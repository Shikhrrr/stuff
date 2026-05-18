// Reusable Input component
export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#1C1C1C]"
        >
          {label}
          {required && <span className="text-[#E8879A] ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-2.5 text-sm rounded-xl border
          bg-white text-[#1C1C1C] placeholder:text-[#BCBCBC]
          border-[#F0E0E5] focus:border-[#E8879A] focus:ring-2 focus:ring-[#F5C6D0]
          outline-none transition-all duration-200
          ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}
          ${inputClassName}
        `}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
