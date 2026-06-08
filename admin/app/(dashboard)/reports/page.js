"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, AreaChart, Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, FileText, 
  ClipboardList, CreditCard, PieChart as PieChartIcon, 
  BarChart3, Activity, CheckCircle
} from "lucide-react";

const COLORS = ["#2563eb","#16a34a","#d97706","#dc2626","#7c3aed","#0891b2"];

// ── Small summary card ────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color = "text-gray-900", icon: Icon }) {
  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        {Icon && <Icon size={64} className={color} />}
      </div>
      {Icon && <Icon size={24} className={`mb-3 ${color}`} />}
      <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1 tracking-wide">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>}
    </motion.div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden"
    >
      <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
      {children}
    </motion.div>
  );
}

// ── Empty chart placeholder ───────────────────────────────────────────────────
function EmptyChart() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-52 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700"
    >
      <BarChart3 size={32} className="mb-2 opacity-50" />
      <span className="text-sm font-medium">No data available yet</span>
    </motion.div>
  );
}

export default function ReportsPage() {
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("overview"); // overview | claims | payments | policies

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => { setReport(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl h-32 animate-pulse border border-gray-100 dark:border-slate-700" />
        ))}
      </div>
    </DashboardLayout>
  );

  const { summary, claimsByType, claimsByStatus, paymentsByMethod,
          paymentsByType, policiesByCategory, monthly } = report;

  // Format for recharts
  const claimsTypeData     = claimsByType.map((c) => ({ name: c._id, Claims: c.count, Amount: c.totalAmount }));
  const claimsStatusData   = claimsByStatus.map((c) => ({ name: c._id, value: c.count }));
  const paymentMethodData  = paymentsByMethod.map((p) => ({ name: p._id, Count: p.count, Revenue: p.total }));
  const paymentTypeData    = paymentsByType.map((p) => ({ name: p._id, Revenue: p.total }));
  const policyCatData      = policiesByCategory.map((p) => ({
    name: p._id, Policies: p.count, "Avg Premium": Math.round(p.avgPremium),
  }));

  const tabs = ["overview", "claims", "payments", "policies"];

  return (
    <DashboardLayout>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">Reports & Analytics</h2>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comprehensive overview of system performance</p>
      </motion.div>

      {/* Tab bar */}
      <div className="tab-bar mb-8">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
              tab === t ? "tab-active" : "tab-inactive"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── OVERVIEW TAB ───────────────────────────────────────── */}
          {tab === "overview" && (
            <div className="space-y-8">
              {/* KPI grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard label="Total Revenue"     value={`$${summary.totalRevenue.toLocaleString()}`}      color="text-green-600" icon={DollarSign} />
                <SummaryCard label="Pending Revenue"   value={`$${summary.pendingRevenue.toLocaleString()}`}    color="text-yellow-600" icon={TrendingUp} />
                <SummaryCard label="Total Claimed"     value={`$${summary.totalClaimAmount.toLocaleString()}`}  color="text-red-500" icon={TrendingDown} />
                <SummaryCard label="Approval Rate"     value={`${summary.claimApprovalRate}%`}                  color="text-primary-600" icon={Activity} />
                <SummaryCard label="Total Customers"   value={summary.totalCustomers}   sub={`${summary.activeCustomers} active`} icon={Users} color="text-indigo-600" />
                <SummaryCard label="Total Policies"    value={summary.totalPolicies}    sub={`${summary.activePolicies} active`} icon={FileText} color="text-teal-600" />
                <SummaryCard label="Total Claims"      value={summary.totalClaims}      sub={`${summary.pendingClaims} pending`} icon={ClipboardList} color="text-orange-600" />
                <SummaryCard label="Total Payments"    value={summary.totalPayments}    sub={`${summary.paidPayments} paid`} icon={CreditCard} color="text-blue-600" />
              </div>

              {/* Monthly Revenue — area chart */}
              <Section title="Monthly Revenue (Last 12 months)">
                {monthly.revenue.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthly.revenue}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} 
                      />
                      <Area type="monotone" dataKey="total" stroke="#2563eb"
                        strokeWidth={3} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Section>

              {/* Monthly customers + claims side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Section title="New Customers per Month">
                  {monthly.customers.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={monthly.customers} barSize={36}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Customers" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Section>

                <Section title="Claims Submitted per Month">
                  {monthly.claims.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={monthly.claims}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="count" stroke="#dc2626"
                          strokeWidth={3} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} name="Claims" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Section>
              </div>
            </div>
          )}

          {/* ── CLAIMS TAB ─────────────────────────────────────────── */}
          {tab === "claims" && (
            <div className="space-y-8">
              {/* Claims summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard label="Total Claims"    value={summary.totalClaims} icon={ClipboardList} color="text-blue-600" />
                <SummaryCard label="Pending"         value={summary.pendingClaims}  color="text-yellow-600" icon={Activity} />
                <SummaryCard label="Approved"        value={summary.approvedClaims} color="text-green-600" icon={TrendingUp} />
                <SummaryCard label="Rejected"        value={summary.rejectedClaims} color="text-red-500" icon={TrendingDown} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Claims by type — bar */}
                <Section title="Claims Count by Type">
                  {claimsTypeData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={claimsTypeData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="Claims" fill="#2563eb" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Section>

                {/* Claims status — pie */}
                <Section title="Claims by Status">
                  {claimsStatusData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={claimsStatusData} cx="50%" cy="50%"
                          innerRadius={70} outerRadius={110}
                          paddingAngle={4} dataKey="value" stroke="none">
                          {claimsStatusData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" iconSize={12} wrapperStyle={{ color: '#64748b', fontSize: '12px', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Section>
              </div>

              {/* Claim amount by type */}
              <Section title="Total Claimed Amount by Type ($)">
                {claimsTypeData.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={claimsTypeData} barSize={48}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(v) => [`$${v.toLocaleString()}`, "Amount"]} 
                      />
                      <Bar dataKey="Amount" fill="#dc2626" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Section>

              {/* Breakdown table */}
              <Section title="Claims Breakdown by Type">
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="table-th">Type</th>
                        <th className="table-th">Count</th>
                        <th className="table-th">Total Claimed</th>
                        <th className="table-th">Avg per Claim</th>
                        <th className="table-th">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {claimsByType.map((c) => (
                        <tr key={c._id} className="table-row">
                          <td className="table-td font-semibold text-gray-900 dark:text-gray-100">{c._id}</td>
                          <td className="table-td font-medium dark:text-gray-300">{c.count}</td>
                          <td className="table-td font-semibold text-gray-800 dark:text-gray-200">${c.totalAmount.toLocaleString()}</td>
                          <td className="table-td text-gray-600 dark:text-gray-400">
                            ${Math.round(c.totalAmount / c.count).toLocaleString()}
                          </td>
                          <td className="table-td">
                            <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {summary.totalClaims > 0
                                ? Math.round((c.count / summary.totalClaims) * 100)
                                : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {/* ── PAYMENTS TAB ───────────────────────────────────────── */}
          {tab === "payments" && (
            <div className="space-y-8">
              {/* Payment summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard label="Total Revenue"   value={`$${summary.totalRevenue.toLocaleString()}`}    color="text-green-600" icon={DollarSign} />
                <SummaryCard label="Pending Amount"  value={`$${summary.pendingRevenue.toLocaleString()}`}  color="text-yellow-600" icon={TrendingUp} />
                <SummaryCard label="Paid Payments"   value={summary.paidPayments} color="text-blue-600" icon={CheckCircle} />
                <SummaryCard label="Total Payments"  value={summary.totalPayments} color="text-indigo-600" icon={CreditCard} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue by payment method */}
                <Section title="Revenue by Payment Method">
                  {paymentMethodData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={paymentMethodData} layout="vertical" barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} 
                        />
                        <Bar dataKey="Revenue" fill="#16a34a" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Section>

                {/* Revenue by policy type — pie */}
                <Section title="Revenue by Policy Type">
                  {paymentTypeData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={paymentTypeData} cx="50%" cy="50%"
                          outerRadius={105} paddingAngle={4} dataKey="Revenue" stroke="none">
                          {paymentTypeData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} 
                        />
                        <Legend iconType="circle" iconSize={12} wrapperStyle={{ color: '#64748b', fontSize: '12px', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Section>
              </div>

              {/* Revenue breakdown table */}
              <Section title="Revenue Breakdown by Policy Type">
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="table-th">Policy Type</th>
                        <th className="table-th">Payments</th>
                        <th className="table-th">Total Revenue</th>
                        <th className="table-th">Avg per Payment</th>
                        <th className="table-th">% of Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paymentsByType.map((p) => (
                        <tr key={p._id} className="table-row">
                          <td className="table-td font-semibold text-gray-900 dark:text-gray-100">{p._id}</td>
                          <td className="table-td font-medium dark:text-gray-300">{p.count}</td>
                          <td className="table-td font-bold text-green-600 dark:text-green-400">
                            ${p.total.toLocaleString()}
                          </td>
                          <td className="table-td text-gray-600 dark:text-gray-400">
                            ${Math.round(p.total / p.count).toLocaleString()}
                          </td>
                          <td className="table-td">
                            <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {summary.totalRevenue > 0
                                ? Math.round((p.total / summary.totalRevenue) * 100)
                                : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}

          {/* ── POLICIES TAB ───────────────────────────────────────── */}
          {tab === "policies" && (
            <div className="space-y-8">
              {/* Policy summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard label="Total Policies"  value={summary.totalPolicies} icon={FileText} color="text-indigo-600" />
                <SummaryCard label="Active Policies" value={summary.activePolicies}  color="text-green-600" icon={CheckCircle} />
                <SummaryCard label="Inactive"
                  value={summary.totalPolicies - summary.activePolicies}
                  color="text-gray-400" icon={PieChartIcon} />
                <SummaryCard label="Categories"      value={policiesByCategory.length} icon={BarChart3} color="text-blue-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Policies by category — bar */}
                <Section title="Policies by Category">
                  {policyCatData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={policyCatData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="Policies" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Section>

                {/* Avg premium by category */}
                <Section title="Average Monthly Premium by Category ($)">
                  {policyCatData.length === 0 ? <EmptyChart /> : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={policyCatData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(v) => [`$${v}`, "Avg Premium"]} 
                        />
                        <Bar dataKey="Avg Premium" fill="#0891b2" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Section>
              </div>

              {/* Policy category table */}
              <Section title="Policy Breakdown by Category">
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="table-th">Category</th>
                        <th className="table-th">Total Policies</th>
                        <th className="table-th">Avg Premium/mo</th>
                        <th className="table-th">Est. Monthly Revenue</th>
                        <th className="table-th">% of Portfolio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {policiesByCategory.map((p) => (
                        <tr key={p._id} className="table-row">
                          <td className="table-td font-semibold text-gray-900 dark:text-gray-100">{p._id}</td>
                          <td className="table-td font-medium dark:text-gray-300">{p.count}</td>
                          <td className="table-td text-gray-600 dark:text-gray-400">${Math.round(p.avgPremium)}</td>
                          <td className="table-td font-bold text-primary-600">
                            ${Math.round(p.avgPremium * p.count).toLocaleString()}
                          </td>
                          <td className="table-td">
                            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {summary.totalPolicies > 0
                                ? Math.round((p.count / summary.totalPolicies) * 100)
                                : 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </DashboardLayout>
  );
}