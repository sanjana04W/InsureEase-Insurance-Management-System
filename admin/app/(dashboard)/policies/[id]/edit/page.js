"use client";

import { useEffect, useState }  from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout          from "@/components/layout/DashboardLayout";
import PolicyForm               from "@/components/forms/PolicyForm";

export default function EditPolicyPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [policy,   setPolicy]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetch(`/api/policies/${id}`)
      .then((r) => r.json())
      .then((d) => { setPolicy(d.policy); setFetching(false); })
      .catch(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/policies/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/policies/${id}`);
      } else {
        setError(data.message || "Failed to update policy");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="card animate-pulse h-48 max-w-2xl mx-auto" />
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600">← Back</button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Policy</h2>
            <p className="text-sm text-gray-400">{policy?.title}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="card">
          {policy && (
            <PolicyForm
              initial={policy}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}