"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ClipboardList, ChevronRight, Calendar, DollarSign, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function ClaimStatusPage() {
  const [query,   setQuery]   = useState("");
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/claims?email=${encodeURIComponent(query)}`);
      const data = await res.json();
      setClaims(data.claims || []);
    } catch { setClaims([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950">
      <section className="bg-primary-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[120%] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-40" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <ClipboardList size={14} className="text-accent-light" />
            <span className="tracking-wide uppercase">Claim Tracking</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold mb-4"
          >
            Check Claim Status
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Enter your email address to track the real-time status of your submitted claims.
          </motion.p>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSearch} className="bg-white dark:bg-primary-900 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800 mb-10">
              <h2 className="text-xl font-display font-bold text-primary-900 dark:text-white mb-6">Search Your Claims</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your registered email address"
                    required 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-primary-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-primary-900 dark:text-white transition-all" />
                </div>
                <Button type="submit" disabled={loading} className="py-4 px-8 md:w-auto w-full justify-center text-base font-semibold rounded-xl bg-primary-900 hover:bg-primary-800">
                  {loading ? "Searching..." : "Track Claims"}
                </Button>
              </div>
            </form>
          </motion.div>

          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {claims.length === 0 ? (
                  <div className="bg-white dark:bg-primary-900 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList size={32} className="text-gray-300" />
                  </div>
                  <p className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">No claims found</p>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">We couldn't find any claims associated with that email address. Please verify your email or submit a new claim.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <h3 className="font-display font-bold text-xl text-primary-900 dark:text-white">Your Claims</h3>
                    <span className="bg-primary-50 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full">{claims.length} Found</span>
                  </div>
                  <AnimatePresence>
                    {claims.map((claim, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={claim._id} 
                        className="bg-white dark:bg-primary-900 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-800 text-primary-600 flex items-center justify-center shrink-0">
                              <ClipboardList size={24} />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-lg text-primary-900 dark:text-white mb-1">{claim.claimType} Insurance Claim</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Policy <span className="text-primary-600">#{claim.policyNumber}</span>
                              </p>
                            </div>
                          </div>
                          <div className="self-start">
                            <Badge status={claim.status} label={claim.status} className="px-4 py-1.5 text-xs shadow-sm" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-primary-800 flex items-center justify-center text-gray-400">
                              <DollarSign size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Claim Amount</p>
                              <p className="font-bold text-gray-900 dark:text-white text-base">
                                ${Number(claim.claimAmount).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-primary-800 flex items-center justify-center text-gray-400">
                              <Calendar size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Incident Date</p>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">
                                {new Date(claim.incidentDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-primary-800 flex items-center justify-center text-gray-400">
                              <Clock size={16} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Submitted On</p>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">
                                {new Date(claim.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}