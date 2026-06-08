"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Clock, DollarSign, Tag, CheckCircle2, Phone, MessageSquare, Briefcase, Info } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function PolicyDetailPage() {
  const { id }  = useParams();
  const router  = useRouter();
  const [policy,  setPolicy]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/policies/${id}`)
      .then((r) => r.json())
      .then((data) => { setPolicy(data.policy); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading policy details...</p>
      </div>
    </div>
  );
  
  if (!policy) return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950 flex items-center justify-center">
      <div className="bg-white dark:bg-primary-900 rounded-3xl p-12 text-center shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-50 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Info size={32} className="text-gray-400" />
        </div>
        <p className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Policy Not Found
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The policy you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-primary-900 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950">
      {/* Header */}
      <section className="bg-primary-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[120%] rounded-full bg-gradient-to-tl from-accent/20 to-transparent blur-3xl opacity-40" />
        </div>
        <div className="container-custom relative z-10">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 w-fit"
          >
            <ArrowLeft size={16} />
            Back to Policies
          </motion.button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-accent/20 text-accent-light px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-accent/30">
                  <Tag size={12} /> {policy.category}
                </span>
                <Badge status={policy.status} label={policy.status} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight">{policy.title}</h1>
              <p className="text-gray-300 text-lg max-w-2xl font-light">Comprehensive coverage designed to give you peace of mind and protect what matters most.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-primary-900 rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-800 rounded-xl flex items-center justify-center">
                    <Info size={24} className="text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">About This Policy</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">{policy.description}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-primary-900 rounded-3xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-800 rounded-xl flex items-center justify-center">
                    <Shield size={24} className="text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Coverage Details</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Maximum Coverage", value: `$${policy.coverageAmount?.toLocaleString()}`, icon: DollarSign },
                    { label: "Policy Duration",  value: `${policy.duration} months`, icon: Clock },
                    { label: "Category",         value: policy.category, icon: Briefcase },
                    { label: "Current Status",   value: policy.status, icon: Shield },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 dark:bg-primary-800 rounded-2xl p-6 border border-gray-100/50 dark:border-gray-700 flex gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-primary-900 rounded-full flex items-center justify-center shadow-sm dark:shadow-none flex-shrink-0">
                        <item.icon size={18} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg capitalize">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-primary-900 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border-2 border-primary-100 dark:border-gray-800 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-800/50 rounded-bl-full -z-10" />
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Monthly Premium</p>
                <div className="flex items-end gap-2 mb-8">
                  <p className="text-5xl font-display font-bold text-primary-900 dark:text-primary-400">${policy.premium}</p>
                  <p className="text-gray-500 dark:text-gray-400 font-medium pb-2">/ month</p>
                </div>
                
                <Link href="/claims/submit" className="flex items-center justify-center w-full py-4 text-base font-semibold rounded-xl bg-primary-900 text-white hover:bg-primary-800 transition-colors mb-4 shadow-md shadow-primary-900/20">
                  Apply for This Policy
                </Link>
                <Link href="/contact" className="flex items-center justify-center w-full py-4 text-base font-semibold rounded-xl bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors">
                  Ask a Question
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-primary-900 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
              >
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6 text-xl">What's Included</h3>
                <ul className="space-y-4">
                  {[
                    "24/7 Customer Support", 
                    "Online Claim Filing", 
                    "Fast Approval Process",
                    "Flexible Payment Options", 
                    "Dedicated Account Manager"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" /> 
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-accent/10 rounded-3xl p-8 border border-accent/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Phone size={20} className="text-accent-dark" />
                  <h3 className="font-display font-bold text-accent-dark text-lg">Need Help?</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">Our insurance experts are ready to help you find the perfect coverage for your needs.</p>
                <a href="tel:1-800-123-4567" className="font-bold text-accent-dark text-xl hover:underline">1-800-123-4567</a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}