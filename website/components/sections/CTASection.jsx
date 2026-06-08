"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-900" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -right-[10%] w-[80%] h-[150%] rounded-[100%] bg-gradient-to-b from-primary-800/40 to-transparent rotate-12 blur-3xl opacity-50" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <div className="container-custom relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto glass-card bg-white/5 border-white/10 p-10 md:p-16 rounded-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
            Ready to Experience <br />
            <span className="text-accent-light">Premium Protection?</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto font-light">
            Join thousands of customers who trust InsureEase for their
            insurance needs. Get a personalized quote today — it's completely free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/policies"
              className="bg-accent hover:bg-accent-light text-primary-950 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              Browse Policies
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors backdrop-blur-md flex items-center justify-center gap-2">
              <PhoneCall size={18} />
              Talk to an Advisor
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}