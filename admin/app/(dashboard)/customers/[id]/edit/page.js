"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerForm    from "@/components/forms/CustomerForm";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.customer?.dateOfBirth) {
          d.customer.dateOfBirth = new Date(d.customer.dateOfBirth)
            .toISOString().split("T")[0];
        }
        setCustomer(d.customer);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/customers/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/customers/${id}`);
      } else {
        setError(data.message || "Failed to update customer");
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
            <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
            <p className="text-sm text-gray-400">{customer?.name}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="card">
          {customer && (
            <CustomerForm
              initial={customer}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}