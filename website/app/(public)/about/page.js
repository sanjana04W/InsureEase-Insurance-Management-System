"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartHandshake, Globe } from "lucide-react";

const values = [
  { icon: ShieldCheck, title: "Trust & Transparency", description: "We believe in clear, honest communication with no hidden terms or surprise fees." },
  { icon: Zap, title: "Fast Claim Processing", description: "Our streamlined process ensures claims are reviewed and resolved within 24 hours." },
  { icon: HeartHandshake, title: "Customer First", description: "Every decision we make is centered around providing the best experience for our customers." },
  { icon: Globe, title: "Nationwide Coverage", description: "Operating across all regions with localized support teams ready to assist you." },
];

const team = [
  { name: "Sarah Johnson",   role: "CEO & Founder",         initials: "SJ" },
  { name: "Michael Chen",    role: "Head of Claims",         initials: "MC" },
  { name: "Priya Sharma",    role: "Customer Success Lead",  initials: "PS" },
  { name: "David Williams",  role: "Technology Director",    initials: "DW" },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="bg-primary-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -right-[10%] w-[80%] h-[150%] rounded-[100%] bg-gradient-to-b from-primary-800/40 to-transparent rotate-12 blur-3xl opacity-50" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            About <span className="text-accent-light">InsureEase</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            We're on a mission to make insurance simple, transparent, and accessible for everyone.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white dark:bg-primary-950 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 dark:text-white mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-accent rounded-full mb-8" />
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-light text-lg">
                InsureEase was founded in 2018 with a simple idea — insurance should be
                easy to understand and even easier to manage. We saw how complex and
                frustrating the traditional insurance industry was for everyday customers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-light text-lg">
                Today, we manage over 15,000 active policies and have processed more than
                8,000 claims — with a 98% approval rate that we're incredibly proud of.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-lg">
                Our platform is built on technology that puts the customer in control,
                with real-time claim tracking, transparent pricing, and 24/7 support.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { label: "Founded",         value: "2018" },
                { label: "Active Policies", value: "15,000+" },
                { label: "Claims Paid",     value: "$48M+" },
                { label: "Team Members",    value: "120+" },
              ].map((item, idx) => (
                <div key={item.label} className="bg-primary-50 dark:bg-primary-900 p-8 rounded-2xl text-center shadow-sm hover:shadow-md dark:shadow-none transition-shadow">
                  <p className="text-4xl font-display font-bold text-primary-900 dark:text-white mb-2">{item.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 dark:bg-primary-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">What drives every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <motion.div 
                key={v.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-primary-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-lg dark:shadow-none transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-800 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary-100 dark:group-hover:bg-primary-700 transition-all duration-300">
                  <v.icon size={32} className="text-primary-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary-900 dark:text-white mb-4">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white dark:bg-primary-950">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 dark:text-white mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The visionary people behind InsureEase.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-primary-50 dark:bg-primary-900 rounded-3xl p-8 text-center shadow-sm dark:shadow-none border border-primary-100 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-900 text-white font-display font-bold text-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {member.initials}
                  </div>
                  <p className="font-display font-bold text-xl text-primary-900 dark:text-white mb-1">{member.name}</p>
                  <p className="text-sm text-accent-dark font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}