"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm]     = useState({ name: "", email: "", type: "General Inquiry", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", type: "General Inquiry", subject: "", message: "" });
    } catch { setStatus("error"); }
    finally { setLoading(false); }
  };

  const info = [
    { icon: Mail, label: "Email",   value: "info@insureease.com" },
    { icon: Phone, label: "Phone",   value: "+1 (800) 123-4567" },
    { icon: Clock, label: "Hours",   value: "Mon–Fri, 9am – 6pm EST" },
    { icon: MapPin, label: "Address", value: "123 Insurance Blvd, New York, NY" },
  ];

  return (
    <div className="pt-24 bg-gray-50 dark:bg-primary-950 min-h-screen">
      <section className="bg-primary-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -left-[10%] w-[80%] h-[150%] rounded-[100%] bg-gradient-to-b from-primary-800/40 to-transparent rotate-12 blur-3xl opacity-50" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Have a question? We're here to help and would love to hear from you.
          </motion.p>
        </div>
      </section>

      <section className="py-24 -mt-16 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

            {/* Contact info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-primary-900 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-2xl font-display font-bold text-primary-900 dark:text-white mb-6">Contact Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                Our support team is available Monday through Friday.
                We aim to respond to all inquiries within 24 hours.
              </p>
              <div className="space-y-6">
                {info.map((item, idx) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-800 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-700 group-hover:text-white transition-colors duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-white dark:bg-primary-900 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
            >
              <h2 className="text-2xl font-display font-bold text-primary-900 dark:text-white mb-8">Send us a Message</h2>
              
              {status === "success" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 mb-8 text-center"
                >
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold text-lg">Message sent successfully!</p>
                  <p className="text-sm mt-1 text-emerald-600">We'll get back to you within 24 hours.</p>
                </motion.div>
              )}
              
              {status === "error" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8 flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">Something went wrong. Please try again.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <Input label="Your Name"  name="name"    value={form.name}    onChange={handleChange} required />
                  <Input label="Email Address"      name="email"   value={form.email}   onChange={handleChange} type="email" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                  <div className="mb-4">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Policy Question">Policy Question</option>
                      <option value="Claim Support">Claim Support</option>
                      <option value="Billing Issue">Billing Issue</option>
                    </select>
                  </div>
                  <Input label="Subject" name="subject" value={form.subject} onChange={handleChange} required />
                </div>
                <div className="mt-4 mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    rows={6} required placeholder="How can we help you?"
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white resize-none" />
                </div>
                <Button type="submit" disabled={loading} className="w-full justify-center py-4 text-base font-semibold rounded-xl bg-primary-900 hover:bg-primary-800 dark:bg-primary-800 dark:hover:bg-primary-700">
                  {loading ? "Sending Message..." : (
                    <>
                      Send Message
                      <Send size={18} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}