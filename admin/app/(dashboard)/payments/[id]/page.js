"use client";

import { useEffect, useState }  from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 }               from "lucide-react";
import DashboardLayout          from "@/components/layout/DashboardLayout";
import StatusBadge              from "@/components/ui/StatusBadge";
import ConfirmModal             from "@/components/ui/ConfirmModal";

const statusOptions = ["paid", "pending", "failed"];

const statusStyles = {
  paid:    "border-green-400  bg-green-50   text-green-700",
  pending: "border-yellow-400 bg-yellow-50  text-yellow-700",
  failed:  "border-red-400    bg-red-50     text-red-700",
};

export default function ViewPaymentPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState("");
  const [success, setSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/payments/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setPayment(d.payment);
        setStatus(d.payment?.status || "pending");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res  = await fetch(`/api/payments/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setPayment(data.payment);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    router.push("/payments");
  };

  if (loading) return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="card animate-pulse h-64" />
      </div>
    </DashboardLayout>
  );

  if (!payment) return (
    <DashboardLayout>
      <div className="text-center py-20 text-gray-400">Payment not found.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
              <p className="text-sm text-gray-400">
                Recorded {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button onClick={() => setDeleteModalOpen(true)} className="btn-danger flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">
            ✅ Payment status updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Details — left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Amount hero card */}
            <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <p className="text-blue-200 text-sm mb-1">Payment Amount</p>
              <p className="text-5xl font-bold mb-3">
                ${Number(payment.amount).toLocaleString()}
              </p>
              <div className="flex items-center gap-3">
                <StatusBadge status={payment.status} />
                <span className="text-blue-200 text-sm">{payment.paymentMethod}</span>
              </div>
            </div>

            {/* Info grid */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Customer Name",  value: payment.customerName },
                  { label: "Policy Number",  value: payment.policyNumber },
                  { label: "Policy Type",    value: payment.policyType },
                  { label: "Payment Method", value: payment.paymentMethod },
                  {
                    label: "Payment Date",
                    value: new Date(payment.paymentDate).toLocaleDateString(),
                  },
                  {
                    label: "Recorded On",
                    value: new Date(payment.createdAt).toLocaleDateString(),
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status update — right */}
          <div>
            <div className="card sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-1">Update Status</h3>
              <p className="text-xs text-gray-400 mb-5">
                Current: <StatusBadge status={payment.status} />
              </p>

              <div className="space-y-2 mb-5">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold border-2 capitalize transition-all
                      ${status === s
                        ? statusStyles[s]
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                      }`}
                  >
                    {s === "paid"    && "✅ "}
                    {s === "pending" && "⏳ "}
                    {s === "failed"  && "❌ "}
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={saving || status === payment.status}
                className="w-full btn-primary justify-center py-3 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Status"}
              </button>

              {status === payment.status && (
                <p className="text-xs text-center text-gray-400 mt-2">
                  Select a different status to update
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Payment" 
        message="Are you sure you want to delete this payment record? This action cannot be undone." 
      />
    </DashboardLayout>
  );
}