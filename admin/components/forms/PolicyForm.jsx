"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const categories = ["Health", "Auto", "Home", "Travel", "Life"];

const emptyForm = {
  title: "", description: "", category: "",
  coverageAmount: "", premium: "", duration: "",
  status: "active",
};

export default function PolicyForm({ initial = {}, onSubmit, loading }) {
  const [form,   setForm]   = useState({ ...emptyForm, ...initial });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim())              err.title          = "Title is required";
    if (!form.description.trim())        err.description    = "Description is required";
    if (!form.category)                  err.category       = "Category is required";
    if (!form.coverageAmount || Number(form.coverageAmount) <= 0)
      err.coverageAmount = "Valid coverage amount is required";
    if (!form.premium || Number(form.premium) <= 0)
      err.premium = "Valid premium is required";
    if (!form.duration || Number(form.duration) <= 0)
      err.duration = "Valid duration is required";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    onSubmit({
      ...form,
      coverageAmount: Number(form.coverageAmount),
      premium:        Number(form.premium),
      duration:       Number(form.duration),
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Title */}
      <div className="mb-4">
        <label className="label">Policy Title <span className="text-red-500">*</span></label>
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="e.g. Premium Health Plan" className="input-field" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="label">Description <span className="text-red-500">*</span></label>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Describe what this policy covers..."
          className="input-field resize-none" />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">

        {/* Category */}
        <div className="mb-4">
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select name="category" value={form.category} onChange={handleChange}
            className="input-field">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
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

        {/* Coverage Amount */}
        <div className="mb-4">
          <label className="label">Coverage Amount ($) <span className="text-red-500">*</span></label>
          <input name="coverageAmount" type="number" value={form.coverageAmount}
            onChange={handleChange} placeholder="e.g. 100000" className="input-field" />
          {errors.coverageAmount && <p className="text-xs text-red-500 mt-1">{errors.coverageAmount}</p>}
        </div>

        {/* Premium */}
        <div className="mb-4">
          <label className="label">Monthly Premium ($) <span className="text-red-500">*</span></label>
          <input name="premium" type="number" value={form.premium}
            onChange={handleChange} placeholder="e.g. 49" className="input-field" />
          {errors.premium && <p className="text-xs text-red-500 mt-1">{errors.premium}</p>}
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="label">Duration (months) <span className="text-red-500">*</span></label>
          <input name="duration" type="number" value={form.duration}
            onChange={handleChange} placeholder="e.g. 12" className="input-field" />
          {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
        </div>
      </div>

      {/* Live preview */}
      {(form.coverageAmount || form.premium) && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">
            Policy Preview
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div>
              <p className="text-gray-400 text-xs">Coverage</p>
              <p className="font-bold text-gray-800">
                ${Number(form.coverageAmount || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Premium/mo</p>
              <p className="font-bold text-primary-600">${form.premium || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Duration</p>
              <p className="font-bold text-gray-800">{form.duration || 0} mo</p>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full justify-center py-3">
        {loading ? "Saving..." : "Save Policy"}
      </Button>
    </form>
  );
}