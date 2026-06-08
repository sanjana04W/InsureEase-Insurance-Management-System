"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-primary-950 text-white overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-primary-800/40 to-transparent blur-3xl opacity-50" />
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs md:text-sm font-medium px-5 py-2 rounded-full mb-8 shadow-sm"
          >
            <Shield size={16} className="text-accent-light" />
            <span className="tracking-wide">Trusted by 10,000+ Customers</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-8 font-display"
          >
            Protect What <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">Matters Most</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Comprehensive insurance solutions with transparent policies,
            fast claim processing, and dedicated support — all in one premium platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/policies" className="btn-accent w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Explore Policies
              <ArrowRight size={18} />
            </Link>
            <Link href="/claims/submit" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium py-3 px-8 rounded-lg border border-white/20 transition-all duration-300 backdrop-blur-sm text-center">
              File a Claim
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[120px] fill-[#f8fafc] dark:fill-primary-950"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C320,120 420,0 720,60 C1020,120 1120,0 1440,60 L1440,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}