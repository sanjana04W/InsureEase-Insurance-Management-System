"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge     from "@/components/ui/StatusBadge";
import StatsCard       from "@/components/ui/StatsCard";
import Table           from "@/components/ui/Table";
import ConfirmModal    from "@/components/ui/ConfirmModal";
import Link            from "next/link";
import { motion }      from "framer-motion";
import { ClipboardList, Clock, CheckCircle, DollarSign, Search, Eye, Trash2 } from "lucide-react";

const claimTypes = ["all", "Health", "Auto", "Home", "Travel", "Life"];

export default function ClaimsPage() {
  const router = useRouter();
  const [claims,   setClaims]   = useState([]);
  const [meta,     setMeta]     = useState({});
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("all");
  const [type,     setType]     = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)          params.set("search",    search);
    if (status !== "all") params.set("status",    status);
    if (type   !== "all") params.set("claimType", type);
    const res  = await fetch(`/api/claims?${params}`);
    const data = await res.json();
    setClaims(data.claims || []);
    setMeta(data.meta   || {});
    setLoading(false);
  }, [search, status, type]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const handleDelete = async (id) => {
    setDeleting(id);
    await fetch(`/api/claims/${id}`, { method: "DELETE" });
    setDeleting(null);
    setClaims(prev => prev.filter(c => c._id !== id));
  };

  return (
    <DashboardLayout>

      {/* Stats row */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatsCard title="Total Claims"    value={meta.total    || 0} icon={ClipboardList} color="blue" />
        <StatsCard title="Pending"         value={meta.pending  || 0} icon={Clock} color="yellow" />
        <StatsCard title="Approved"        value={meta.approved || 0} icon={CheckCircle} color="green" />
        <StatsCard title="Total Claimed"
          value={`$${(meta.totalAmount || 0).toLocaleString()}`}
          icon={DollarSign} color="purple" />
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-5"
      >
        <h2 className="section-title">All Claims</h2>
        <span className="badge badge-rejected">{meta.rejected || 0} rejected</span>
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
            type="text" placeholder="Search name, email, policy no..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="input-field w-36">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="input-field w-36">
          {claimTypes.map((t) => (
            <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>
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
          headers={["Customer", "Policy No.", "Type", "Amount", "Incident Date", "Status", "Submitted", "Actions"]}
          empty="No claims found."
        >
          {claims.map((c, index) => (
            <motion.tr 
              key={c._id} 
              className="table-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td className="table-td">
                <p className="font-semibold text-gray-900 dark:text-white">{c.customerName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
              </td>
              <td className="table-td text-gray-500 font-mono text-xs">
                {c.policyNumber}
              </td>
              <td className="table-td">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {c.claimType}
                </span>
              </td>
              <td className="table-td font-bold text-gray-800 dark:text-gray-200">
                ${Number(c.claimAmount).toLocaleString()}
              </td>
              <td className="table-td text-gray-500 font-medium">
                {new Date(c.incidentDate).toLocaleDateString()}
              </td>
              <td className="table-td"><StatusBadge status={c.status} /></td>
              <td className="table-td text-gray-400 text-xs">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="table-td">
                <div className="flex gap-2">
                  <Link href={`/claims/${c._id}`}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center" title="Review">
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => setDeleteId(c._id)}
                    disabled={deleting === c._id}
                    className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-40 flex items-center" title="Delete">
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
        title="Delete Claim" 
        message="Are you sure you want to delete this claim? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}