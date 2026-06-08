"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "15,000+", label: "Policies Issued" },
  { value: "98%",     label: "Claim Approval Rate" },
  { value: "24hrs",   label: "Average Claim Processing" },
  { value: "50+",     label: "Insurance Products" },
];

export default function StatsSection() {
  return (
    <section className="bg-white dark:bg-transparent border-b border-gray-100 dark:border-gray-800 relative z-20 -mt-10 md:-mt-16 bg-transparent pb-16">
      <div className="container-custom">
        <div className="glass-card bg-white dark:bg-primary-900/80 p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] dark:border-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x divide-gray-100/0 md:divide-gray-100 dark:md:divide-gray-700">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="px-4"
              >
                <p className="text-3xl md:text-5xl font-display font-bold text-primary-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}