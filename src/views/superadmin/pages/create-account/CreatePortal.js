import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "src/api/Api";
import SmallSpinner from "src/components/loaders/SmallSpinner";

const CreatePortal = ({ onClose }) => {
  const [form, setForm] = useState({
    plan_id: "",
    email: "",
  });

  const planRequest = () => axiosInstance.get("/require/get-planings");

  const {
    data: planResponse,
    isLoading: isPlanLoading,
    isError: isPlanError,
  } = useQuery({
    queryKey: ["plan"],
    queryFn: planRequest,
  });

  const plans = planResponse?.data?.data || [];

  const { mutate: sendInvite, isPending: isSending } = useMutation({
    mutationFn: (payload) =>
      axiosInstance.post("/require/portal-genarate", payload),
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      onClose?.();
    },
    onError: () => {
      toast.error("Failed to send invite. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.plan_id || !form.email) return;
    sendInvite(form);
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">
              Create Mailbox Portal
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email ID (gmail)
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Subscription Plan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subscription Plan
              </label>
              <select
                name="plan_id"
                value={form.plan_id}
                onChange={handleChange}
                disabled={isPlanLoading}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subscription Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.plan_name}
                  </option>
                ))}
              </select>

              {isPlanError && (
                <p className="text-sm text-red-500 mt-1">
                  Failed to load plans
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSending || !form.plan_id || !form.email}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? (
                <p className="flex items-center gap-2">
                  <span>
                    <SmallSpinner />{" "}
                  </span>
                  <span> Sending...</span>
                </p>
              ) : (
                "Send Invite"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePortal;
