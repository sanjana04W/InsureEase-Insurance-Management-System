export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:  "bg-primary-600 hover:bg-primary-700 text-white",
    secondary:"bg-white border border-primary-600 text-primary-600 hover:bg-primary-50",
    danger:   "bg-red-600 hover:bg-red-700 text-white",
    ghost:    "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
}