"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Car, Home, Plane, ArrowRight } from "lucide-react";

const policies = [
  {
    icon: HeartPulse,
    title: "Health Insurance",
    description: "Comprehensive medical coverage for individuals and families including hospitalization, outpatient care, and specialist visits.",
    coverage: "Up to $500,000",
    premium: "From $49/mo",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Car,
    title: "Auto Insurance",
    description: "Full vehicle protection covering accidents, theft, third-party liability, and roadside assistance.",
    coverage: "Up to $100,000",
    premium: "From $29/mo",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Home,
    title: "Home Insurance",
    description: "Protect your home and belongings against fire, theft, natural disasters, and unexpected damage.",
    coverage: "Up to $1,000,000",
    premium: "From $39/mo",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Plane,
    title: "Travel Insurance",
    description: "Peace of mind while traveling with coverage for trip cancellations, medical emergencies, and lost luggage.",
    coverage: "Up to $250,000",
    premium: "From $15/trip",
    color: "from-amber-500 to-orange-500",
  },
];

export default function PolicyHighlights() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-primary-950 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-50" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-900 dark:text-white mb-4"
          >
            Our Premium Products
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Tailored coverage plans designed to protect every aspect of your life with uncompromising quality.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {policies.map((policy, idx) => (
            <motion.div 
              key={policy.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-primary-900 rounded-2xl p-8 shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 transition-all duration-300 group flex flex-col relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none from-primary-500 to-transparent" />
              
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${policy.color} text-white shadow-lg`}>
                <policy.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-xl text-primary-900 dark:text-white mb-3">{policy.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{policy.description}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Coverage</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{policy.coverage}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Premium</span>
                  <span className="font-bold text-primary-600">{policy.premium}</span>
                </div>
                <Link href="/policies"
                  className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-primary-900 dark:text-white bg-gray-50 dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 py-3 rounded-xl transition-colors group-hover:text-primary-600 dark:group-hover:text-accent-light">
                  View Details
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/policies" className="btn-primary">
            View All Policies
          </Link>
        </motion.div>
      </div>
    </section>
  );
}