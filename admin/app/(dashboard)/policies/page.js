"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge     from "@/components/ui/StatusBadge";
import StatsCard       from "@/components/ui/StatsCard";
import Table           from "@/components/ui/Table";
import { motion }      from "framer-motion";
import { FileText, FilePlus, Search, Eye, Edit3, Trash2 } from "lucide-react";

const categories = ["all", "Health", "Auto", "Home", "Travel", "Life"];

export default function PoliciesPage() {
  const router = useRouter();
  const [policies,  setPolicies]  = useState([]);
  const [meta,      setMeta]      = useState({ total: 0, active: 0, inactive: 0 });
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("all");
  const [status,    setStatus]    = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)            params.set("search",   search);
    if (status !== "all")  params.set("status",   status);
    if (category !== "all") params.set("category", category);
    const res  = await fetch(`/api/policies?${params}`);
    const data = await res.json();
    setPolicies(data.policies || []);
    setMeta(data.meta || {});
    setLoading(false);
  }, [search, status, category]);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this policy? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/policies/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchPolicies();
  };

  return (
    <DashboardLayout>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <StatsCard title="Total Policies" value={meta.total || 0} icon={FileText} color="blue" />
        <StatsCard title="Active" value={meta.active || 0} sub="Currently active" icon={FileText} color="green" />
        <StatsCard title="Inactive" value={meta.inactive || 0} icon={FileText} color="red" />
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="section-title">All Policies</h2>
          <p className="section-subtitle">Manage available insurance plans</p>
        </div>
        <button onClick={() => router.push("/policies/add")} className="btn-primary">
          <FilePlus size={18} /> Add Policy
        </button>
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
            type="text" placeholder="Search title or description..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="input-field w-36">
          {categories.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="input-field w-36">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
          headers={["Title", "Category", "Coverage", "Premium/mo", "Duration", "Status", "Actions"]}
          empty="No policies found."
        >
          {policies.map((p, index) => (
            <motion.tr 
              key={p._id} 
              className="table-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td className="table-td">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{p.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5 max-w-xs truncate">{p.description}</p>
              </td>
              <td className="table-td">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {p.category}
                </span>
              </td>
              <td className="table-td font-semibold text-gray-700 dark:text-gray-300">
                ${p.coverageAmount?.toLocaleString()}
              </td>
              <td className="table-td font-bold text-primary-600">
                ${p.premium}
              </td>
              <td className="table-td text-gray-500 dark:text-gray-400 font-medium">{p.duration} mo</td>
              <td className="table-td"><StatusBadge status={p.status} /></td>
              <td className="table-td">
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/policies/${p._id}`)}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => router.push(`/policies/${p._id}/edit`)}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors" title="Edit">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    disabled={deleting === p._id}
                    className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-40" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </Table>
      )}
    </DashboardLayout>
  );
}