"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge     from "@/components/ui/StatusBadge";
import ConfirmModal    from "@/components/ui/ConfirmModal";
import Link            from "next/link";
import { Edit3 }       from "lucide-react";

export default function ViewCustomerPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((d) => { setCustomer(d.customer); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    router.push("/customers");
  };

  if (loading) return (
    <DashboardLayout>
      <div className="card animate-pulse h-48 max-w-2xl mx-auto" />
    </DashboardLayout>
  );

  if (!customer) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Customer not found.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600">← Back</button>
            <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
          </div>
          <div className="flex gap-2">
            <Link href={`/customers/${id}/edit`} className="btn-secondary flex items-center gap-2">
              <Edit3 size={16} /> Edit
            </Link>
            <button onClick={() => setDeleteModalOpen(true)} className="btn-danger">Delete</button>
          </div>
        </div>

        <div className="card">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 text-2xl font-bold flex items-center justify-center">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-400">{customer.email}</p>
              <div className="mt-1"><StatusBadge status={customer.status} /></div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Phone",         value: customer.phone || "—" },
              { label: "Date of Birth", value: customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : "—" },
              { label: "Address",       value: customer.address || "—" },
              { label: "Member Since",  value: new Date(customer.createdAt).toLocaleDateString() },
              { label: "Last Updated",  value: new Date(customer.updatedAt).toLocaleDateString() },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Customer" 
        message="Are you sure you want to delete this customer? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}