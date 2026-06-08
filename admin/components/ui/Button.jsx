"use client";

import { motion } from "framer-motion";

export default function Button({
  children, variant = "primary", type = "button",
  disabled = false, onClick, className = "", icon: Icon,
}) {
  const variants = {
    primary:   "bg-primary-900 hover:bg-primary-800 text-white shadow-md hover:shadow-lg hover:shadow-primary-900/20",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow",
    danger:    "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg hover:shadow-red-600/20",
    success:   "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:shadow-emerald-600/20",
    ghost:     "bg-transparent hover:bg-gray-100 text-gray-600",
    accent:    "bg-accent hover:bg-accent-dark text-white shadow-md hover:shadow-lg hover:shadow-accent/30",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2
        ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}