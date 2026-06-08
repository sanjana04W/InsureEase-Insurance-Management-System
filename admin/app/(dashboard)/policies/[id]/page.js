"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge     from "@/components/ui/StatusBadge";

export default function ViewPolicyPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [policy,  setPolicy]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/policies/${id}`)
      .then((r) => r.json())
      .then((d) => { setPolicy(d.policy); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this policy? This cannot be undone.")) return;
    await fetch(`/api/policies/${id}`, { method: "DELETE" });
    router.push("/policies");
  };

  if (loading) return (
    <DashboardLayout>
      <div className="card animate-pulse h-48 max-w-2xl mx-auto" />
    </DashboardLayout>
  );

  if (!policy) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Policy not found.</div>
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
            <h2 className="text-lg font-bold text-gray-900">Policy Details</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push(`/policies/${id}/edit`)}
              className="btn-secondary">Edit</button>
            <button onClick={handleDelete} className="btn-danger">Delete</button>
          </div>
        </div>

        <div className="card mb-5">
          {/* Title row */}
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{policy.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {policy.category}
                </span>
                <StatusBadge status={policy.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">${policy.premium}</p>
              <p className="text-xs text-gray-400">per month</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{policy.description}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Coverage Amount", value: `$${policy.coverageAmount?.toLocaleString()}` },
              { label: "Duration",        value: `${policy.duration} months` },
              { label: "Annual Premium",  value: `$${(policy.premium * 12).toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className="font-bold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timestamps */}
        <div className="card">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Created</p>
              <p className="font-medium text-gray-700">
                {new Date(policy.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="font-medium text-gray-700">
                {new Date(policy.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}