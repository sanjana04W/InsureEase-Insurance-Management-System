"use client";

import { motion } from "framer-motion";

const map = {
  active:   { className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  inactive: { className: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  pending:  { className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  approved: { className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  rejected: { className: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  paid:     { className: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  failed:   { className: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  read:     { className: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  unread:   { className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

const fallback = { className: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" };

export default function StatusBadge({ status }) {
  const config = map[status] || fallback;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border shadow-sm ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </motion.span>
  );
}