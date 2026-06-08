"use client";

import { useEffect, useState }  from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout          from "@/components/layout/DashboardLayout";
import StatusBadge              from "@/components/ui/StatusBadge";
import ClaimStatusForm          from "@/components/forms/ClaimStatusForm";
import ConfirmModal             from "@/components/ui/ConfirmModal";

export default function ReviewClaimPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [claim,   setClaim]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/claims/${id}`)
      .then((r) => r.json())
      .then((d) => { setClaim(d.claim); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async ({ status, reviewNote }) => {
    setSaving(true);
    setSuccess(false);
    try {
      const res  = await fetch(`/api/claims/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status, reviewNote }),
      });
      const data = await res.json();
      if (res.ok) {
        setClaim(data.claim);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/claims/${id}`, { method: "DELETE" });
    router.push("/claims");
  };

  if (loading) return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="lg:col-span-2 card animate-pulse h-64" />
        <div className="card animate-pulse h-64" />
      </div>
    </DashboardLayout>
  );

  if (!claim) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Claim not found.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600">← Back</button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Review Claim</h2>
              <p className="text-sm text-gray-400">
                Submitted {new Date(claim.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button onClick={() => setDeleteModalOpen(true)} className="btn-danger">Delete</button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">
            ✅ Claim status updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Claim details — left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Customer info */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
                <StatusBadge status={claim.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Full Name",     value: claim.customerName },
                  { label: "Email",         value: claim.email },
                  { label: "Phone",         value: claim.phone || "—" },
                  { label: "Policy Number", value: claim.policyNumber },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim details */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Claim Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                {[
                  { label: "Claim Type",     value: claim.claimType },
                  { label: "Claim Amount",   value: `$${Number(claim.claimAmount).toLocaleString()}` },
                  { label: "Incident Date",  value: new Date(claim.incidentDate).toLocaleDateString() },
                  { label: "Date Submitted", value: new Date(claim.createdAt).toLocaleDateString() },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{claim.description}</p>
              </div>
            </div>

            {/* Review note (if exists) */}
            {claim.reviewNote && (
              <div className="card border-l-4 border-primary-400">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  Admin Review Note
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{claim.reviewNote}</p>
              </div>
            )}
          </div>

          {/* Status update — right sidebar */}
          <div>
            <div className="card sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-1">Update Decision</h3>
              <p className="text-xs text-gray-400 mb-5">
                Current status: <StatusBadge status={claim.status} />
              </p>
              <ClaimStatusForm
                claim={claim}
                onSubmit={handleStatusUpdate}
                loading={saving}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Claim" 
        message="Are you sure you want to delete this claim? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}