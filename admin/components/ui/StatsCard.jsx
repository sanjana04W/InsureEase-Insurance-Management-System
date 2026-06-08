"use client";

import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color = "blue", sub }) {
  const colors = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    green:  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    yellow: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    red:    "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
    purple: "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-800",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700 transition-all flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border ${colors[color]}`}>
        {typeof Icon === 'string' ? <span>{Icon}</span> : <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}