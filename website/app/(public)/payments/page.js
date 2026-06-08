"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Search, History, CheckCircle2, AlertCircle, Lock, Zap, Mail, ChevronRight, DollarSign } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const paymentMethods = ["Credit Card", "Debit Card", "Bank Transfer", "Cash"];
const policyTypes    = ["Health", "Auto", "Home", "Travel", "Life"];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("make"); // "make" | "history"

  // Payment form state
  const [form, setForm] = useState({
    customerName: "", policyNumber: "", policyType: "",
    amount: "", paymentDate: "", paymentMethod: "",
  });
  const [formStatus, setFormStatus]   = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // History search state
  const [searchPolicy, setSearchPolicy]   = useState("");
  const [payments, setPayments]           = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searched, setSearched]           = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch("/api/payments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus("success");
        setForm({
          customerName: "", policyNumber: "", policyType: "",
          amount: "", paymentDate: "", paymentMethod: "",
        });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    } finally {
      setFormLoading(false);
    }
  };

  // Search payment history
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPolicy.trim()) return;
    setHistoryLoading(true);
    setSearched(true);
    try {
      const res  = await fetch(`/api/payments?policyNumber=${encodeURIComponent(searchPolicy)}`);
      const data = await res.json();
      setPayments(data.payments || []);
    } catch {
      setPayments([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-primary-950">
      {/* Header */}
      <section className="bg-primary-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] -left-[10%] w-[60%] h-[120%] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-40" />
        </div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <CreditCard size={14} className="text-accent-light" />
            <span className="tracking-wide uppercase">Payment Center</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold mb-4"
          >
            Policy Payments
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            Securely make a payment or check your billing history by policy number.
          </motion.p>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-20">
        <div className="container-custom max-w-4xl">

          {/* Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex bg-white dark:bg-primary-900 rounded-2xl p-2 mb-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800 mx-auto max-w-2xl relative"
          >
            <div 
              className="absolute bg-primary-900 rounded-xl transition-all duration-300 ease-out"
              style={{
                left: activeTab === "make" ? "8px" : "calc(50% + 4px)",
                width: "calc(50% - 12px)",
                top: "8px",
                bottom: "8px"
              }}
            />
            {[
              { key: "make",    label: "Make a Payment", icon: CreditCard },
              { key: "history", label: "Payment History", icon: History },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all relative z-10 ${
                  activeTab === tab.key
                    ? "text-white dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── TAB: Make a Payment ── */}
            {activeTab === "make" && (
              <motion.div 
                key="make"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {formStatus === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400 rounded-3xl p-8 mb-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none"
                  >
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="font-display font-bold text-2xl mb-2">Payment Successful!</p>
                    <p className="text-emerald-700 dark:text-emerald-300">
                      Your payment record has been saved. Our team will verify and confirm shortly.
                    </p>
                  </motion.div>
                )}
                
                {formStatus === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-8 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
                  >
                    <AlertCircle size={24} className="text-red-500" />
                    <p className="font-medium">Something went wrong. Please try processing your payment again.</p>
                  </motion.div>
                )}

                <div className="bg-white dark:bg-primary-900 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800">
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-display font-bold text-primary-900 dark:text-white mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                      Payment Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                      <Input
                        label="Customer Name"
                        name="customerName"
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                      <Input
                        label="Policy Number"
                        name="policyNumber"
                        value={form.policyNumber}
                        onChange={handleChange}
                        placeholder="e.g. POL-00123"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Policy Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="policyType"
                          value={form.policyType}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                        >
                          <option value="" disabled>Select type</option>
                          {policyTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Payment Amount ($)"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        type="number"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Date <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={form.paymentDate}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Payment Method <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="paymentMethod"
                          value={form.paymentMethod}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 dark:bg-primary-800 focus:bg-white dark:focus:bg-primary-900 dark:text-white appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                        >
                          <option value="" disabled>Select method</option>
                          {paymentMethods.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Summary preview */}
                    {form.amount && form.policyNumber && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-gray-50 dark:bg-primary-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Payment Summary</p>
                        <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mb-3">
                          <span className="flex items-center gap-2"><FileText size={16} className="text-gray-400"/> Policy</span>
                          <span className="font-medium bg-white dark:bg-primary-900 px-2 py-1 rounded shadow-sm dark:shadow-none">{form.policyNumber || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <span className="flex items-center gap-2"><CreditCard size={16} className="text-gray-400"/> Method</span>
                          <span className="font-medium bg-white dark:bg-primary-900 px-2 py-1 rounded shadow-sm dark:shadow-none">{form.paymentMethod || "—"}</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-gray-900 dark:text-white font-semibold">Total Amount</span>
                          <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">${Number(form.amount || 0).toLocaleString()}</span>
                        </div>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="w-full justify-center py-4 text-base font-semibold rounded-xl bg-primary-900 hover:bg-primary-800 flex items-center gap-2"
                    >
                      {formLoading ? "Processing Payment..." : (
                        <>
                          Submit Secure Payment
                          <Lock size={16} />
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[
                    { icon: Lock, title: "Bank-Grade Security",   desc: "All payments are encrypted using AES-256 and processed securely." },
                    { icon: Zap, title: "Instant Processing",      desc: "Payment records are updated in real-time on your account." },
                    { icon: Mail, title: "Email Receipts", desc: "You'll receive a detailed confirmation receipt via email immediately." },
                  ].map((item, idx) => (
                    <motion.div 
                      key={item.title} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white dark:bg-primary-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none"
                    >
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon size={24} className="text-primary-600" />
                      </div>
                      <p className="font-display font-bold text-gray-900 dark:text-white mb-2">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB: Payment History ── */}
            {activeTab === "history" && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search */}
                <form onSubmit={handleSearch} className="bg-white dark:bg-primary-900 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800 mb-8">
                  <h2 className="text-xl font-display font-bold text-primary-900 dark:text-white mb-6">
                    Search Payment History
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchPolicy}
                        onChange={(e) => setSearchPolicy(e.target.value)}
                        placeholder="Enter your policy number (e.g. POL-00123)"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-primary-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-primary-900 dark:text-white transition-all"
                      />
                    </div>
                    <Button type="submit" disabled={historyLoading} className="py-4 px-8 md:w-auto w-full justify-center text-base font-semibold rounded-xl bg-primary-900 hover:bg-primary-800">
                      {historyLoading ? "Searching..." : "Search Records"}
                    </Button>
                  </div>
                </form>

                {/* Results */}
                {searched && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {payments.length === 0 ? (
                      <div className="bg-white dark:bg-primary-900 rounded-3xl p-12 text-center shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <History size={32} className="text-gray-300" />
                        </div>
                        <p className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                          No payments found
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                          We couldn't find any payment history for this policy number. Please verify and try again.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Summary bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          {[
                            { label: "Total Records",  value: payments.length, icon: History },
                            {
                              label: "Total Paid",
                              value: `$${totalPaid.toLocaleString()}`,
                              icon: DollarSign,
                              highlight: true
                            },
                            {
                              label: "Pending Verification",
                              value: payments.filter((p) => p.status === "pending").length,
                              icon: AlertCircle
                            },
                          ].map((s) => (
                            <div key={s.label} className={`rounded-2xl p-6 text-center border ${s.highlight ? 'bg-primary-900 text-white border-primary-900' : 'bg-white dark:bg-primary-900 text-gray-900 dark:text-white border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-none'}`}>
                              <s.icon size={24} className={`mx-auto mb-3 ${s.highlight ? 'text-accent-light' : 'text-primary-500'}`} />
                              <p className={`text-3xl font-display font-bold mb-1 ${s.highlight ? 'text-white' : 'text-primary-900 dark:text-white'}`}>{s.value}</p>
                              <p className={`text-xs font-semibold uppercase tracking-wider ${s.highlight ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'}`}>{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Payment records */}
                        <div className="space-y-4">
                          {payments.map((payment, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={payment._id} 
                              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                <div>
                                  <p className="font-display font-bold text-lg text-primary-900 dark:text-white mb-1">
                                    {payment.customerName}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    Policy <span className="text-primary-600">#{payment.policyNumber}</span> · <span className="bg-gray-100 dark:bg-primary-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 text-xs">{payment.policyType}</span>
                                  </p>
                                </div>
                                <Badge status={payment.status} label={payment.status} className="px-4 py-1.5 text-xs shadow-sm self-start md:self-auto" />
                              </div>

                              <div className="bg-gray-50 dark:bg-primary-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4 border border-gray-100/50 dark:border-gray-700">
                                <div>
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Amount</p>
                                  <p className="font-bold text-primary-600 dark:text-primary-400 text-base">
                                    ${Number(payment.amount).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Date</p>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Method</p>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                    <CreditCard size={14} className="text-gray-400"/>
                                    {payment.paymentMethod}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Submitted</p>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}