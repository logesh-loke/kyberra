import React, { useState, useEffect } from "react";
import { X, Sparkles, Users, Calendar, IndianRupee } from "lucide-react";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function PlanPopupModal({ onClose, selectedPlan, refetchPlanData }) {
  const [form, setForm] = useState({
    planName: "",
    duration: "1month",
    userLimit: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const planRequest = (payload) =>
    axiosInstance.put("/require/planings", payload);

  const {
    data: planData,
    mutate: mutatePlanData,
    error: planError,
  } = useMutation({
    queryKey: ["planData"],
    mutationFn: planRequest,
  });

  useEffect(() => {
    if (planData || planError) {
      if (planData) {
        const message = planData?.data?.message;
        if (message === "Success") {
          toast.success("Plan updated successfully");
          refetchPlanData?.();
          onClose();
        }
      }

      if (planError) {
        const msg = planError?.response?.data?.message;
        if (msg === "Internal Server Error") {
           Swal.fire({
         icon: "error",
         title: "Server Error",
         text: "We encountered an unexpected system issue while processing your request. Our technical team has been notified. Please try again in a few moments.",
         allowOutsideClick: false,
         showConfirmButton: true,
         confirmButtonText: "Understood",
         confirmButtonColor: "#6C72F3",
         backdrop: true,
       });
        }
      }
    }
  }, [planData, planError]);

  const durationOptions = [
    ...Array.from({ length: 11 }, (_, i) => {
      const n = i + 1;
      return { label: `${n} month${n > 1 ? "s" : ""}`, value: `${n}month` };
    }),
    { label: "1 year", value: "1year" },
    { label: "2 years", value: "2year" },
    { label: "3 years", value: "3year" },
  ];

  // 🔹 Prefill form when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      setForm({
        planName: selectedPlan.plan_name || "",
        duration: selectedPlan.duration || "1month",
        userLimit:
          selectedPlan.user_limit !== null &&
          selectedPlan.user_limit !== undefined
            ? String(selectedPlan.user_limit)
            : "",
        price:
          selectedPlan.price !== null && selectedPlan.price !== undefined
            ? String(selectedPlan.price)
            : "",
      });
      setErrors({});
    }
  }, [selectedPlan]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.planName.trim()) {
      newErrors.planName = "Plan name is required";
    }

    if (!form.userLimit || parseInt(form.userLimit) < 1) {
      newErrors.userLimit = "Valid user limit is required";
    }

    if (!form.price || parseFloat(form.price) < 0) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: selectedPlan?.id,
      plan_name: form.planName.trim(),
      duration: form.duration,
      user_limit: Number(form.userLimit),
      price: form.price,
      description: selectedPlan?.description || "",
    };
    mutatePlanData(payload);
    // console.log("Updated plan payload:", payload);
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative w-full max-w-md lg:max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#676CE7]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Membership Plan
                </h2>
                <p className="text-gray-500 text-sm">
                  Configure your subscription plan details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name *
            </label>
            <input
              type="text"
              value={form.planName}
              readOnly // 🔒 not editable
              className={`w-full px-3 py-2.5 rounded-lg border outline-none transition-colors placeholder-gray-400 bg-gray-100 cursor-not-allowed ${
                errors.planName
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-gray-300"
              }`}
            />
            {errors.planName && (
              <p className="mt-1 text-xs text-red-600">{errors.planName}</p>
            )}
          </div>

          {/* Duration & User Limit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Duration
              </label>
              <select
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 outline-none bg-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
              >
                {durationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Limit */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                User Limit *
              </label>
              <input
                type="number"
                value={form.userLimit}
                onChange={(e) => handleChange("userLimit", e.target.value)}
                placeholder="Enter number of users"
                min="1"
                className={`w-full px-3 py-2.5 rounded-lg border outline-none transition-colors placeholder-gray-400 ${
                  errors.userLimit
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.userLimit && (
                <p className="mt-1 text-xs text-red-600">{errors.userLimit}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-gray-500" />
              Price *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </div>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border outline-none transition-colors placeholder-gray-400 ${
                  errors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#676CE7] font-medium text-white hover:bg-[#676CE7] transition-colors focus:ring-2 focus:ring-[#676CE7] focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
