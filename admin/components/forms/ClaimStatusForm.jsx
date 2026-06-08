"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ClaimStatusForm({ claim, onSubmit, loading }) {
  const [status,     setStatus]     = useState(claim.status);
  const [reviewNote, setReviewNote] = useState(claim.reviewNote || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, reviewNote });
  };

  const statusColors = {
    pending:  "border-yellow-400 bg-yellow-50  text-yellow-700",
    approved: "border-green-400  bg-green-50   text-green-700",
    rejected: "border-red-400    bg-red-50     text-red-700",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className="label">Update Status</label>
        <div className="grid grid-cols-3 gap-3">
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s} type="button"
              onClick={() => setStatus(s)}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 capitalize transition-all
                ${status === s
                  ? statusColors[s]
                  : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                }`}
            >
              {s === "pending"  && "⏳ "}
              {s === "approved" && "✅ "}
              {s === "rejected" && "❌ "}
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="label">Review Note</label>
        <textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          rows={3}
          placeholder="Add a note for this review decision..."
          className="input-field resize-none"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full justify-center py-3">
        {loading ? "Updating..." : "Update Claim Status"}
      </Button>
    </form>
  );
}