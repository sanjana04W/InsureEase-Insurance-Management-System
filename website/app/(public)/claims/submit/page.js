"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ClaimSubmitPage() {
  const [form, setForm] = useState({
    customerName: "", email: "", phone: "",
    policyNumber: "", claimType: "", incidentDate: "",
    description: "", claimAmount: "",
  });
  const [status,  setStatus]  = useState(null); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("success"); setForm({
        customerName: "", email: "", phone: "",
        policyNumber: "", claimType: "", incidentDate: "",
        description: "", claimAmount: "",
      }); }
      else setStatus("error");
    } catch { setStatus("error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950">
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
            <FileText size={14} className="text-accent-light" />
            <span className="tracking-wide uppercase">Claims Center</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold mb-4"
          >
            File a Claim
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Submit your insurance claim securely and we'll process it within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom max-w-3xl">
          <AnimatePresence>
            {status === "success" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl p-8 mb-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <p className="font-display font-bold text-2xl mb-2">Claim Submitted Successfully!</p>
                <p className="text-emerald-700">
                  We've received your claim and will review it shortly. You'll receive an email confirmation with your claim tracking number.
                </p>
              </motion.div>
            )}
            
            {status === "error" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-8 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
              >
                <AlertCircle size={24} className="text-red-500" />
                <p className="font-medium">Something went wrong. Please try submitting again.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-primary-900 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800"
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-display font-bold text-primary-900 dark:text-white mb-2">Claim Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Please provide the details of your claim.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                <Input label="Full Name"     name="customerName"  value={form.customerName}  onChange={handleChange} required />
                <Input label="Email Address" name="email"         value={form.email}         onChange={handleChange} type="email" required />
                <Input label="Phone Number"  name="phone"         value={form.phone}         onChange={handleChange} />
                <Input label="Policy Number" name="policyNumber"  value={form.policyNumber}  onChange={handleChange} required />
              </div>

              <div className="mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-display font-bold text-primary-900 dark:text-white mb-2">Incident Details</h2>
                <p className="text-sm text-gray-500">Provide accurate information about what happened.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type <span className="text-red-500">*</span></label>
                  <select name="claimType" value={form.claimType}
                    onChange={handleChange} required 
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Health">Health</option>
                    <option value="Auto">Auto</option>
                    <option value="Home">Home</option>
                    <option value="Travel">Travel</option>
                    <option value="Life">Life</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date <span className="text-red-500">*</span></label>
                  <input type="date" name="incidentDate" value={form.incidentDate}
                    onChange={handleChange} required 
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Input label="Estimated Claim Amount ($)" name="claimAmount" value={form.claimAmount}
                  onChange={handleChange} type="number" required />
              </div>

              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={5} required placeholder="Please describe the incident in detail, including exactly what happened, when, and where."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white resize-none" />
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center py-4 text-base font-semibold rounded-xl bg-primary-900 hover:bg-primary-800 dark:bg-primary-800 dark:hover:bg-primary-700 flex items-center gap-2">
                {loading ? "Submitting Claim..." : (
                  <>
                    Submit Claim
                    <UploadCloud size={18} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}