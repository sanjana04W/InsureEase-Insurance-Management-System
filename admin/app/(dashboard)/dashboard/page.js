"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard       from "@/components/ui/StatsCard";
import StatusBadge     from "@/components/ui/StatusBadge";
import Link            from "next/link";
import { Users, FileText, ClipboardList, DollarSign, Activity, AlertCircle, MessageSquare, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#2563eb","#059669","#d97706","#dc2626","#7c3aed"];

export default function DashboardPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (!d || !d.success) {
          setError(d?.message || "Failed to load dashboard data");
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Network error: could not reach the server");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 h-32 animate-pulse border border-gray-100" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-10 max-w-md">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Unavailable</h2>
            <p className="text-sm text-gray-500 mb-6">{error || "Could not load dashboard data."}</p>
            <button
              onClick={() => { setError(null); setLoading(true); fetch("/api/dashboard").then(r=>r.json()).then(d=>{ if(!d||!d.success){setError(d?.message||"Failed to load dashboard data");}else{setData(d);} setLoading(false); }).catch(()=>{ setError("Network error"); setLoading(false); }); }}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentClaims, recentCustomers, claimsByType, monthlyPayments } = data;

  const barData = monthlyPayments.map((m) => ({
    month: MONTHS[m._id - 1],
    revenue: m.total,
    payments: m.count,
  }));

  const pieData = claimsByType.map((c) => ({
    name: c._id, value: c.count,
  }));

  return (
    <DashboardLayout>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Customers"
          value={stats.customers.total}
          icon={Users}
          color="blue"
          sub={`${stats.customers.active} active`}
        />
        <StatsCard
          title="Active Policies"
          value={stats.policies.active}
          icon={FileText}
          color="green"
          sub={`${stats.policies.total} total`}
        />
        <StatsCard
          title="Pending Claims"
          value={stats.claims.pending}
          icon={ClipboardList}
          color="yellow"
          sub={`${stats.claims.total} total claims`}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          sub={`${stats.payments.paid} paid payments`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Approved Claims", value: stats.claims.approved, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: Activity },
          { label: "Rejected Claims", value: stats.claims.rejected, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", icon: AlertCircle },
          { label: "Total Payments",  value: stats.payments.total,  color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/20", icon: DollarSign },
          { label: "Unread Messages", value: stats.unreadMessages,  color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: MessageSquare },
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.label} 
            className={`rounded-3xl p-6 border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center text-center ${s.bg}`}
          >
            <s.icon size={24} className={`mb-3 ${s.color}`} />
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar chart — Monthly Revenue */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
              Monthly Revenue Overview
            </h2>
            <select className="text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Last 6 months</option>
              <option>This Year</option>
            </select>
          </div>
          {barData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-700/30 rounded-2xl">
              <BarChart3 size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No payment data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart — Claims by type */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700"
        >
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-8">
            Claims Distribution
          </h2>
          {pieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-700/30 rounded-2xl">
              <PieChartIcon size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No claim data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Recent Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Claims */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Recent Claims</h2>
            <Link href="/claims" className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-wider bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentClaims.length === 0 ? (
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-2xl py-8 text-center text-gray-400 text-sm">No claims yet</div>
            ) : recentClaims.map((claim) => (
              <div key={claim._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-700 transition-colors">{claim.customerName}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mr-2">{claim.claimType}</span>
                    ${Number(claim.claimAmount).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Customers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Recent Customers</h2>
            <Link href="/customers" className="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-wider bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentCustomers.length === 0 ? (
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-2xl py-8 text-center text-gray-400 text-sm">No customers yet</div>
            ) : recentCustomers.map((customer) => (
              <div key={customer._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-display font-bold flex items-center justify-center shadow-sm">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-700 transition-colors">{customer.name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{customer.email}</p>
                  </div>
                </div>
                <StatusBadge status={customer.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}