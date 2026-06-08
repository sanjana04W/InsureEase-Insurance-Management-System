"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Filter, ArrowRight, X } from "lucide-react";
import Badge from "@/components/ui/Badge";

const categories = ["All", "Health", "Auto", "Home", "Travel", "Life"];

export default function PoliciesPage() {
  const [policies, setPolicies]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [category, setCategory]   = useState("All");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api/policies")
      .then((r) => r.json())
      .then((data) => {
        setPolicies(data.policies || []);
        setFiltered(data.policies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = policies;
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (search)             result = result.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [category, search, policies]);

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950">
      {/* Header */}
      <section className="bg-primary-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[150%] rounded-[100%] bg-gradient-to-b from-primary-800/40 to-transparent rotate-12 blur-3xl opacity-50" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <Shield size={14} className="text-accent-light" />
            <span className="tracking-wide uppercase">Premium Coverage</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold mb-4"
          >
            Insurance Policies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Browse our full range of curated coverage plans and find the perfect fit for your lifestyle.
          </motion.p>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom">

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card bg-white dark:bg-primary-900 p-4 md:p-6 mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col md:flex-row gap-4 justify-between items-center"
          >
            <div className="relative w-full md:max-w-md">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-primary-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-primary-900 dark:text-white transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              <div className="hidden md:flex items-center gap-2 mr-2 text-gray-400">
                <Filter size={16} />
                <span className="text-sm font-medium uppercase tracking-wider">Filter:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    category === cat
                      ? "bg-primary-900 dark:bg-primary-800 text-white shadow-md"
                      : "bg-gray-100 dark:bg-primary-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-primary-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-primary-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4" />
                  <div className="h-4 bg-gray-100 rounded-lg w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded-lg w-5/6 mb-8" />
                  <div className="h-10 bg-gray-50 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white dark:bg-primary-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-300" />
              </div>
              <p className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No policies found</p>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">We couldn't find any policies matching your current filters. Try adjusting your search criteria.</p>
              <button 
                onClick={() => {setSearch(""); setCategory("All");}}
                className="mt-6 text-primary-600 font-semibold hover:text-primary-700"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filtered.map((policy, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                    key={policy._id} 
                    className="bg-white dark:bg-primary-900 rounded-3xl p-6 hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none from-primary-500 to-transparent" />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <h3 className="font-display font-bold text-gray-900 dark:text-white text-xl">{policy.title}</h3>
                      <Badge status={policy.status} label={policy.status} />
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-6 relative z-10">
                      {policy.description}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-primary-800 rounded-2xl p-5 space-y-3 mb-6 relative z-10 border border-gray-100/50 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</span>
                        <span className="font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-primary-900 px-2 py-1 rounded-md shadow-sm text-xs">{policy.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coverage</span>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          ${policy.coverageAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Premium</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                          ${policy.premium}<span className="text-sm text-gray-400 font-medium">/mo</span>
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/policies/${policy._id}`}
                      className="mt-auto block w-full text-center bg-white dark:bg-primary-900 border-2 border-primary-100 dark:border-gray-700 text-primary-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-800 hover:border-primary-200 dark:hover:border-gray-600 font-semibold py-3 rounded-xl transition-all duration-300 relative z-10 group-hover:text-primary-700 dark:group-hover:text-primary-300 flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}