import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "src/api/Api";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import TableSkeleton from "src/components/loaders/TableSkeliton";
import { FiCopy } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import CompanyEditModal from "./components/popup/CompanyEditModal";

const CompanyList = () => { 
  const navigate = useNavigate();
  const QueryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editCompany, setEditCompany] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const companyRequest = () => axiosInstance.get("/require/company");
  const planRequest = () => axiosInstance.get("/require/get-planings");
  const extendPlanRequest = (payload) =>
    axiosInstance.put("/require/update-plan", payload);

  const offlineRequest = (payload) => {
    return axiosInstance.put(`/require/in-active${payload}`);
  };
  const onlineRequest = (payload) =>
    axiosInstance.put(`/require/active${payload}`);

  const {
    data: companyList,
    isPending: companyLoading,
    // isError: companyError,
    // refetch: refetchCompanies,
  } = useQuery({
    queryKey: ["companyList"],
    queryFn: companyRequest,
  });

  const {
    data: planList,
    // isPending: planLoading,
    // isError: planError,
  } = useQuery({
    queryKey: ["planList"],
    queryFn: planRequest,
  });

  const {
    data: extendPlanData,
    error: extendPlanError,
    mutate: extendPlanMutate,
    isPending: extendPlanLoading,
  } = useMutation({
    mutationKey: ["extendPlan"],
    mutationFn: extendPlanRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["companyList"] });
    },
  });

  const {
    data: offlineData,
    error: offlineError,
    mutate: offlineMutate,
  } = useMutation({
    mutationKey: ["company-offline"],
    mutationFn: offlineRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["companyList"] });
    },
  });

  const {
    data: onlineData,
    error: onlineError,
    mutate: onlineMutate,
  } = useMutation({
    mutationKey: ["company-online"],
    mutationFn: onlineRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["companyList"] });
    },
  });

  useEffect(() => {
    if (extendPlanData || extendPlanError) {
      if (extendPlanData?.data?.message === "Success") {
        toast.success("Plan extended successfully");
      }

      if (
        extendPlanError?.response?.data?.message === "Internal Server Error"
      ) {
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
  }, [extendPlanData, extendPlanError]);

  useEffect(() => {
    if (offlineData || offlineError) {
      if (offlineData) {
        const message = offlineData?.data?.message;
        if (message === "Success") {
          toast.success("User Inactive Successfully");
        }
      }

      if (offlineError) {
        const msg = offlineError?.response?.data?.message;
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
  }, [offlineData, offlineError]);

  useEffect(() => {
    if (onlineData || onlineError) {
      if (onlineData?.data?.message === "Success") {
        toast.success("User Active Successfully");
      }

      if (onlineError?.response?.data?.message === "Internal Server Error") {
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
  }, [onlineData, onlineError]);

  const companies = companyList?.data?.data || [];

  const filteredCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [];

    const term = search.trim().toLowerCase();
    if (!term) return companies;

    return companies.filter((company) => {
      const id = String(company.id || "").toLowerCase();
      const companyName = (company.company_name || "").toLowerCase();
      const buyerName = (company.buyer_name || "").toLowerCase();
      const email = (company.email_id || "").toLowerCase();
      const phone = String(company.phone_number || "").toLowerCase();
      const country = (company.country || "").toLowerCase();
      const city = (company.city || "").toLowerCase();
      const domain = (company.domain || "").toLowerCase();

      return (
        id.includes(term) ||
        companyName.includes(term) ||
        buyerName.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        country.includes(term) ||
        city.includes(term) ||
        domain.includes(term)
      );
    });
  }, [companies, search]);

  const plans = planList?.data?.data || [];

  // Store selected plan per company: { [companyId]: planId }
  const [selectedPlans, setSelectedPlans] = useState({});

  const handlePlanChange = (companyId, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [companyId]: planId,
    }));
  };

  // 🔹 Now we pass the whole company object
  const handleExtendPlan = (company) => {
    const companyId = company.id;
    const selectedPlanIdFromState = selectedPlans[companyId];
    // 🔹 Fallback: if dropdown not selected, use company.plan_id from API
    const effectivePlanId = selectedPlanIdFromState || company.plan_id || null;

    if (!effectivePlanId) {
      console.warn(
        "No plan selected and no plan_id found in company data for:",
        companyId,
      );
    }
    const payload = {
      company_id: companyId,
      plan_id: effectivePlanId,
    };

    extendPlanMutate(payload);
  };

  const handleOffline = (company) => {
    if (!company) return;
    if (company.id) {
      offlineMutate(`?company_id=${company.id}`);
    }
  };
  const handleOnline = (company) => {
    if (!company) return;
    if (company.id) {
      onlineMutate(`?company_id=${company.id}`);
    }
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setEditModalOpen(true);

  }

  const formatDate = (iso) => {
    if (!iso) return "--";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getExpiryStatus = (endDate) => {
    if (!endDate) return "unknown";

    const today = new Date();
    const expiry = new Date(endDate);

    if (isNaN(expiry.getTime())) return "unknown";

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired"; // past date
    if (diffDays <= 7) return "expiringSoon"; // within 7 days
    return "active"; // more than 7 days
  };

  // if (companyLoading || planLoading) {
  //   return (
  //     <div className="p-6 text-sm text-slate-600">
  //       Loading companies and plans...
  //     </div>
  //   );
  // }

  // if (companyError || planError) {
  //   return (
  //     <div className="p-6 text-sm text-red-600">
  //       Failed to load companies or plans.
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 flex justify-between items-center">
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
              Edit, customize and manage plans — names, duration, limits, price
              and description.
            </p>
          </div>
          <div className="flex min-w-56 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or company"
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200  overflow-y-auto text-[11px] sm:text-xs">
        {/* Wrapper for horizontal scroll */}
        <div className="overflow-x-auto h-[calc(100vh-101px)]">
          {companyLoading ? (
            <TableSkeleton columns={8} rows={10} />
          ) : (
            <table className="min-w-[1970px] w-full border-collapse relative">
              <thead className="bg-slate-50 border-b sticky top-0 z-10 border-slate-200">
                <tr>
                  <th className="px-4 py-2 border-r-2 border-slate-200 text-left font-semibold text-slate-600 sticky left-0  bg-slate-50 w-[150px] whitespace-nowrap">
                    Company
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Domain
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Buyer Name
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Token
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[250px] truncate">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[130px] whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Active/Inactive
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[180px] whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Plan
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[150px] whitespace-nowrap">
                    End Date
                  </th>
                  <th className="px-4 py-2 text-left border-r-2 border-slate-200 font-semibold text-slate-600 w-[100px] whitespace-nowrap">
                    Select Plan
                  </th>
                  <th className="px-4 py-2 text-center border-r-2 border-slate-200 font-semibold text-slate-600 w-[120px] whitespace-nowrap">
                    Exptend
                  </th>
                   <th className="px-4 py-2 text-center border-r-2 border-slate-200 font-semibold text-slate-600 w-[120px] whitespace-nowrap">
                    Edit
                  </th>
                  <th className="px-4 py-2 text-left  font-semibold text-slate-600 w-[130px] whitespace-nowrap">
                    Active/InActive
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => {
                    const companyId = company.id;
                    // const selectedPlanId = selectedPlans[companyId] || "";
                    const selectedPlanId =
                      selectedPlans[companyId] ?? company.plan_id ?? "";

                    return (
                      <tr
                        key={company.id}
                        className="border-b border-slate-100 hover:bg-slate-50/60"
                      >
                        {/* Company - sticky first column */}
                        <td className="px-4 py-3 border-r border-slate-200 align-top sticky left-0 z-10 bg-slate-50 w-[200px]">
                          <div className="font-semibold text-slate-900 capitalize">
                            {company.company_name || "-"}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            ID: {company.id}
                          </div>
                        </td>

                        {/* Domain */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800 truncate">
                            {company.domain || "--"}
                          </div>
                        </td>

                        {/* Buyer */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800 truncate">
                            {company.buyer_name || "--"}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="text-slate-800 truncate max-w-[180px]">
                              {company.user_token || "--"}
                            </div>

                            {company.user_token && (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    company.user_token,
                                  );
                                  toast.success("Token copied to clipboard.");
                                }}
                                title="Copy"
                                className="text-slate-400 hover:text-slate-700 transition"
                              >
                                <FiCopy size={16} />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800 text-xs break-all truncate">
                            {company.email_id || "--"}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800">
                            {company.country_code || ""}-
                            {company.phone_number || "--"}
                          </div>
                        </td>

                        {/* Active / Inactive (badge only, not full cell) */}
                        <td className=" px-4 py-3 border-r border-slate-200">
                          <span
                            className={` px-3 py-1 rounded-full text-[11px] font-semibold
                               ${
                                 company.active === 1
                                   ? "bg-green-100 text-green-700"
                                   : "bg-red-100 text-red-700"
                               }
                             `}
                          >
                            {company.active === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800 truncate">
                            {company.city || "--"}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {company.country || ""}{" "}
                            {/* {company.pincode ? `• ${company.pincode}` : ""} */}
                          </div>
                        </td>

                        {/* Current Plan */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <div className="text-slate-800 capitalize truncate">
                            {company.plan_name || "--"}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Users: {company.total_users ?? "--"}
                          </div>
                        </td>

                        {/* Start Date */}
                        <td className="px-4 py-3 align-top text-slate-800 w-[120px] whitespace-nowrap border-r border-slate-200">
                          {formatDate(company.start_date)}
                        </td>

                        {/* End Date with Health Color */}
                        <td
                          title={
                            getExpiryStatus(company.end_date) === "expired"
                              ? "Plan expired"
                              : getExpiryStatus(company.end_date) ===
                                  "expiringSoon"
                                ? "Expiring soon"
                                : "Active"
                          }
                          className={`px-4 py-3 align-top whitespace-nowrap border-r border-slate-200
                               ${
                                 getExpiryStatus(company.end_date) === "expired"
                                   ? "bg-red-100 text-red-600"
                                   : getExpiryStatus(company.end_date) === "expiringSoon"
                                     ? "bg-orange-100 text-orange-600"
                                     : "bg-green-100 text-green-700"
                               }
                             `}
                        >
                          {formatDate(company.end_date)}
                        </td>

                        {/* Plan Dropdown */}
                        <td className="px-4 py-3 align-top w-[170px] border-r border-slate-200">
                          <select
                            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={selectedPlanId}
                            onChange={(e) =>
                              handlePlanChange(companyId, e.target.value)
                            }
                          >
                            <option value="">Select plan</option>
                            {plans.map((plan) => (
                              <option
                                key={plan.plan_id ?? plan.id}
                                value={plan.plan_id ?? plan.id}
                              >
                                {plan.plan_name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 align-top border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleExtendPlan(company)}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#676CE7] text-white hover:bg-[#575ddc] whitespace-nowrap"
                          >
                            {extendPlanLoading ? "Extending..." : "Extend Plan"}
                          </button>
                        </td>

                        {/* Edit */}
                        <td className="text-center px-4 py-3 align-top border-r border-slate-200">
                         <button onClick={() => handleEdit(company)} className="bg-white p-2 rounded-full hover:bg-slate-100">
                      <MdEdit className="w-4 h-4 text-slate-500" />
                    </button>
                        </td>

                        {company.active === 1 ? (
                          <td className="px-4 py-3 align-top border-r border-slate-200">
                            <div className="text-slate-800">
                              <button
                                onClick={() => handleOffline(company)}
                                className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 whitespace-nowrap border border-gray-300"
                              >
                                Go offline
                              </button>
                              {/* {company.phone_numberr || "Go offline"} */}
                            </div>
                          </td>
                        ) : (
                          <td className="px-4 py-3 align-top border-r border-slate-200">
                            <div className="text-slate-800">
                              <button
                                onClick={() => handleOnline(company)}
                                className="inline-flex items-center justify-center px-4 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 whitespace-nowrap border border-gray-300"
                              >
                                Go online
                              </button>
                              {/* {company.phone_numberr || "Go offline"} */}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>


      {editModalOpen && (
        <CompanyEditModal
          company={editCompany}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyList;
