// SafeImage — never shows broken images, shows a fallback placeholder instead
export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  ...props
}) {
  const handleError = (e) => {
    e.currentTarget.style.display = "none";
    const fallback = e.currentTarget.nextElementSibling;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <span className="relative block w-full h-full">
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
      {/* Fallback shown only if image fails */}
      <span
        className={`hidden absolute inset-0 items-center justify-center bg-[#FDF5F7] text-[#E8879A] ${fallbackClassName}`}
        aria-label={alt}
        role="img"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 opacity-50"
        >
          <path d="M6.5 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v.5" />
          <path d="M21 19H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l4 4v12a2 2 0 0 1-2 2z" />
          <circle cx="12.5" cy="11" r="2.5" />
          <path d="m7 21 5-5 5 5" />
        </svg>
        <span className="sr-only">{alt}</span>
      </span>
    </span>
  );
}
