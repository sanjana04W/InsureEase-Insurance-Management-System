"use client";

import { motion } from "framer-motion";
import { Search, FileText, ShieldCheck, HeadphonesIcon } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose a Policy",
    description: "Browse our range of insurance products and select the plan that best fits your needs and budget.",
    icon: Search,
  },
  {
    step: "02",
    title: "Submit Application",
    description: "Fill out a simple application form with your details. Our team reviews and approves quickly.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Get Covered",
    description: "Once approved, your policy is activated immediately and you're fully protected.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "File Claims Easily",
    description: "In case of an incident, submit your claim online and track its status in real time.",
    icon: HeadphonesIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-primary-950 relative">
      <div className="container-custom">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-900 dark:text-white mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Getting covered is simple — four seamless steps to complete peace of mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary-100 dark:from-primary-800 via-primary-300 dark:via-primary-600 to-primary-100 dark:to-primary-800 z-0" />

          {steps.map((s, idx) => (
            <motion.div 
              key={s.step} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative z-10 text-center group"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary-50 dark:bg-primary-800 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white dark:bg-primary-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <s.icon size={32} className="text-primary-600 group-hover:text-accent transition-colors duration-300" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-900 text-white font-bold text-xs flex items-center justify-center shadow-md">
                  {s.step}
                </div>
              </div>
              <h3 className="font-display font-bold text-xl text-primary-900 dark:text-white mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}