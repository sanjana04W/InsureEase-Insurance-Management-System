"use client";

import { useState }    from "react";
import { useRouter }   from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PolicyForm      from "@/components/forms/PolicyForm";

export default function AddPolicyPage() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (form) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/policies", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/policies");
      } else {
        setError(data.message || "Failed to create policy");
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
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600">← Back</button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Policy</h2>
            <p className="text-sm text-gray-400">Fill in the policy details below</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="card">
          <PolicyForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
}