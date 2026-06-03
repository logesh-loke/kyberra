import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import TableSkeleton from "src/components/loaders/TableSkeliton";
import NoDataFound from "src/components/nodata/NoData";

const MemberShipPlanHistory = () => {
  const navigate = useNavigate();

  const planRequest = () => axiosInstance.get("/require/subscription");

  const { data: planData, isPending: isLoading } = useQuery({
    queryKey: ["planData"],
    queryFn: planRequest,
  });

 
  const plans = planData?.data?.data || planData?.data?.data || planData?.data || [];

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "-";
    const value = Number(price);
    if (Number.isNaN(value)) return price;
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getPlanLabel = (plan) =>
    plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase() : "-";

  return (
    <div className="bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
        text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300"></div>

            <p className="text-sm text-slate-500">
              Overview of active subscription plans associated with your company domains.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-[calc(100vh-101px)] overflow-y-auto">
      
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
             <TableSkeleton rows={10} columns={8} />
            ) : !plans.length ? (
              <NoDataFound
              title="No Membership Plans Found"
              subtitle="You don't have any active subscription plans."
              className="h-[calc(100vh-110px)] overflow-hidden"
            />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3 text-right">User Limit</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {plans.map((plan, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Company */}
                      <td className="px-4 py-3 align-middle">
                        <div>
                          <p className="font-medium text-slate-800">
                            {plan.company_name || "-"}
                          </p>
                          {plan.email_id && (
                            <p className="text-[11px] text-slate-500">
                              {plan.email_id}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                          {plan.domain || "-"}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-semibold text-purple-500">
                          {getPlanLabel(plan.plan_name)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3 align-middle text-slate-700">
                        {plan.duration || "-"}
                      </td>

                      {/* User Limit */}
                      <td className="px-4 py-3 align-middle text-right text-slate-700">
                        {plan.user_limit ?? "-"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 align-middle text-right text-slate-800">
                        {formatPrice(plan.price)}
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-3 align-middle text-slate-600">
                        {formatDate(plan.start_date)}
                      </td>

                      {/* End Date */}
                      <td className="px-4 py-3 align-middle text-slate-600">
                        {formatDate(plan.end_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberShipPlanHistory;
