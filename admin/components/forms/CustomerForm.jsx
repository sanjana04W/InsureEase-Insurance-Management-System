"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const emptyForm = {
  name: "", email: "", phone: "",
  address: "", dateOfBirth: "", status: "active",
};

export default function CustomerForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim())  err.name  = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">

        {/* Name */}
        <div className="mb-4">
          <label className="label">Full Name <span className="text-red-500">*</span></label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="John Doe" className="input-field" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="label">Email Address <span className="text-red-500">*</span></label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="john@example.com" className="input-field" />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="label">Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            placeholder="+1 (555) 000-0000" className="input-field" />
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="label">Date of Birth</label>
          <input name="dateOfBirth" type="date" value={form.dateOfBirth}
            onChange={handleChange} className="input-field" />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="input-field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="label">Address</label>
        <textarea name="address" value={form.address} onChange={handleChange}
          rows={2} placeholder="123 Main St, City, State"
          className="input-field resize-none" />
      </div>

      <Button type="submit" disabled={loading} className="w-full justify-center py-3">
        {loading ? "Saving..." : "Save Customer"}
      </Button>
    </form>
  );
}