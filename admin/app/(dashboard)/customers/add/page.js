"use client";

import { useState }    from "react";
import { useRouter }   from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm    from "@/components/forms/CustomerForm";

export default function AddCustomerPage() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (form) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/customers", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/customers");
      } else {
        setError(data.message || "Failed to create customer");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            ← Back
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Customer</h2>
            <p className="text-sm text-gray-400">Fill in the details below</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="card">
          <CustomerForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
}