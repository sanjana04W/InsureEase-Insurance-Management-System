"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge     from "@/components/ui/StatusBadge";
import Table           from "@/components/ui/Table";
import StatsCard       from "@/components/ui/StatsCard";
import ConfirmModal    from "@/components/ui/ConfirmModal";
import Link            from "next/link";
import { motion }      from "framer-motion";
import { Users, UserPlus, UserCheck, UserX, Search, Eye, Edit3, Trash2 } from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [meta,      setMeta]      = useState({ total: 0, active: 0, inactive: 0 });
  const [search,    setSearch]    = useState("");
  const [status,    setStatus]    = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    const res  = await fetch(`/api/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setMeta(data.meta || {});
    setLoading(false);
  }, [search, status]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleDelete = async (id) => {
    setDeleting(id);
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    setDeleting(null);
    setCustomers(prev => prev.filter(c => c._id !== id));
  };

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <StatsCard title="Total Customers" value={meta.total || 0} icon={Users} color="blue" />
        <StatsCard title="Active" value={meta.active || 0} icon={UserCheck} color="green" />
        <StatsCard title="Inactive" value={meta.inactive || 0} icon={UserX} color="red" />
      </motion.div>

      {/* Header row */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="section-title">All Customers</h2>
          <p className="section-subtitle">Manage your customer base</p>
        </div>
        <Link href="/customers/add" className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Add Customer
        </Link>
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
            type="text" placeholder="Search name, email, phone..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
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
          headers={["Name", "Email", "Phone", "Date of Birth", "Status", "Joined", "Actions"]}
          empty="No customers found."
        >
          {customers.map((c, index) => (
            <motion.tr 
              key={c._id} 
              className="table-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td className="table-td">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{c.name}</span>
                </div>
              </td>
              <td className="table-td text-gray-500">{c.email}</td>
              <td className="table-td text-gray-500">{c.phone || "—"}</td>
              <td className="table-td text-gray-500">
                {c.dateOfBirth ? new Date(c.dateOfBirth).toLocaleDateString() : "—"}
              </td>
              <td className="table-td"><StatusBadge status={c.status} /></td>
              <td className="table-td text-gray-400 text-xs">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="table-td">
                <div className="flex gap-2">
                  <Link href={`/customers/${c._id}`}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center" title="View">
                    <Eye size={16} />
                  </Link>
                  <Link href={`/customers/${c._id}/edit`}
                    className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors flex items-center" title="Edit">
                    <Edit3 size={16} />
                  </Link>
                  <button onClick={() => setDeleteId(c._id)}
                    disabled={deleting === c._id}
                    className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-40" title="Delete">
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
        title="Delete Customer" 
        message="Are you sure you want to delete this customer? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}