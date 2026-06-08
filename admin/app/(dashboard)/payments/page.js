"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import StatsCard from "@/components/ui/StatsCard";
import Table from "@/components/ui/Table";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { motion } from "framer-motion";
import { DollarSign, Clock, CreditCard, XCircle, Search, Eye, Trash2 } from "lucide-react";

const policyTypes = ["all", "Health", "Auto", "Home", "Travel", "Life"];

export default function PaymentsPage() {
  const router = useRouter();
  const [payments,  setPayments]  = useState([]);
  const [meta,      setMeta]      = useState({});
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("all");
  const [type,      setType]      = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)           params.set("search",     search);
    if (status !== "all") params.set("status",     status);
    if (type   !== "all") params.set("policyType", type);
    const res  = await fetch(`/api/payments?${params}`);
    const data = await res.json();
    setPayments(data.payments || []);
    setMeta(data.meta || {});
    setLoading(false);
  }, [search, status, type]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleDelete = async (id) => {
    setDeleting(id);
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    setDeleting(null);
    setDeleteId(null);
    setPayments(prev => prev.filter(p => p._id !== id));
  };

  return (
    <DashboardLayout>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatsCard
          title="Total Revenue"
          value={`$${(meta.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign} color="green"
          sub={`${meta.paid || 0} paid payments`}
        />
        <StatsCard
          title="Pending Amount"
          value={`$${(meta.pendingAmount || 0).toLocaleString()}`}
          icon={Clock} color="yellow"
          sub={`${meta.pending || 0} pending`}
        />
        <StatsCard
          title="Total Records"
          value={meta.total || 0}
          icon={CreditCard} color="blue"
        />
        <StatsCard
          title="Failed Payments"
          value={meta.failed || 0}
          icon={XCircle} color="red"
        />
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="section-title">All Payments</h2>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="filter-group"
      >
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search name or policy number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field w-36"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field w-36"
        >
          {policyTypes.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All Types" : t}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3 mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : (
        <Table
          headers={[
            "Customer", "Policy No.", "Type", "Amount",
            "Method", "Payment Date", "Status", "Actions",
          ]}
          empty="No payment records found."
        >
          {payments.map((p, index) => (
            <motion.tr 
              key={p._id} 
              className="table-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td className="table-td">
                <p className="font-semibold text-gray-900">{p.customerName}</p>
              </td>
              <td className="table-td font-mono text-xs text-gray-500">
                {p.policyNumber}
              </td>
              <td className="table-td">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {p.policyType}
                </span>
              </td>
              <td className="table-td font-bold text-gray-800">
                ${Number(p.amount).toLocaleString()}
              </td>
              <td className="table-td text-gray-500">{p.paymentMethod}</td>
              <td className="table-td text-gray-500">
                {new Date(p.paymentDate).toLocaleDateString()}
              </td>
              <td className="table-td">
                <StatusBadge status={p.status} />
              </td>
              <td className="table-td">
                <div className="flex gap-2">
                  <Link
                    href={`/payments/${p._id}`}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center" title="View"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => setDeleteId(p._id)}
                    disabled={deleting === p._id}
                    className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-40 flex items-center" title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </Table>
      )}

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={() => deleteId && handleDelete(deleteId)} 
        title="Delete Payment" 
        message="Are you sure you want to delete this payment record? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}