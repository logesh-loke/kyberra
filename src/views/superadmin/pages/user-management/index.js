import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiMail,
  FiPhone,
  //   FiBuilding,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import NoDataFound from "src/components/nodata/NoData";
import { FiArrowLeft } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import DomainFilterDropdown from "./components/DomainDropdown";
import TableSkeleton from "src/components/loaders/TableSkeliton";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { MdCopyAll } from "react-icons/md";

const UserManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [domain, setDomain] = useState("");
  const QueryClient = useQueryClient();

  // Build URL based on page + domain
  const getUserUrl = (page, domain) => {
    if (domain === "all") return `?page=${page}&type=active`;
    if (domain === "user") return `?page=${page}&role=user`;
    if (domain === "admin") return `?page=${page}&role=admin`;
    if (domain === "employee") return `?page=${page}&role=employee`;
    if (domain === "inactive") return `?page=${page}&type=inactive`;
    return `?page=${page}&type=active`;
  };

  const userRequest = ({ queryKey }) => {
    const [_key, page, domain] = queryKey;
    const queryString = getUserUrl(page, domain);
    return axiosInstance.get(`/require/users${queryString}`);
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ["users", page, domain], // ⬅️ domain added here
    queryFn: userRequest,
    keepPreviousData: true,
  });

  const offlineRequest = (payload) => {
    // console.log('payload', payload);
    return axiosInstance.put(`/require/in-active${payload}`);
  };
  const onlineRequest = (payload) =>
    axiosInstance.put(`/require/active${payload}`);

  const {
    data: offlineData,
    mutate: offlineMutate,
    error: offlineError,
  } = useMutation({
    mutationKey: ["offline"],
    mutationFn: offlineRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["users", page, domain] });
    },
  });

  const {
    data: onlineData,
    mutate: onlineMutate,
    error: onlineError,
  } = useMutation({
    mutationKey: ["online"],
    mutationFn: onlineRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["users", page, domain] });
    },
  });

  useEffect(() => {
    if (onlineData || onlineError) {
      if (onlineData) {
        const message = onlineData?.data?.message;
        if (message === "Success") {
          toast.success("User Active Successfully");
        }
      }

      if (onlineError) {
        const msg = onlineError?.response?.data?.message;
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
  }, [onlineData, onlineError]);

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

  // If axiosInstance returns res.data directly:
  // userData = { data: [ ...users ] }
  const users = userData?.data?.data;

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${
        u.last_name || ""
      }`.toLowerCase();
      const email = (u.email_address || "").toLowerCase();
      const company = (u.company_name || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        company.includes(term)
      );
    });
  }, [users, search]);

  const formatName = (first = "", last = "") => {
    const cap = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    return `${cap(first)} ${cap(last)}`.trim();
  };

  const getInitials = (first = "", last = "") => {
    const f = first?.[0] || "";
    const l = last?.[0] || "";
    return `${f}${l}`.toUpperCase() || "?";
  };

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

  const handleDomainChange = (value) => {
    setDomain(value.key);
    // console.log("Value from child:", value);
  };

  const handleoffline = (value) => {
    if (value.company_id) {
      offlineMutate(`?company_id=${value.company_id}`);
    } else if (value.user_id) {
      offlineMutate(`?user_id=${value.user_id}`);
    }
  };

  const handleonline = (value) => {
    console.log(value);

    if (value.company_id) {
      onlineMutate(`?company_id=${value.company_id}`);
    } else if (value.user_id) {
      onlineMutate(`?user_id=${value.user_id}`);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50/30 ">
      {/* Header */}
      <div className="bg-white border-b border-[#F6F0FF]">
        <div className="px-4">
          <div className="flex items-center justify-between h-12 ">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-[#F6F0FF] transition"
              >
                <FiArrowLeft className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-slate-300"></div>

              {/* <p className="text-sm text-slate-500">
                View and manage all onboarded company users.
              </p> */}

              <DomainFilterDropdown onChange={handleDomainChange} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-full border border-[#F6F0FF] bg-[#F6F0FF] px-3 py-1.5 text-sm">
                <FiSearch className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or company"
                  className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              {/* Pagination + meta */}
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="hidden text-xs text-slate-500 sm:block">
                  Page{" "}
                  <span className="font-semibold text-slate-700">{page}</span>
                  {filteredUsers?.length
                    ? ` • Showing ${filteredUsers?.length} user${
                        filteredUsers?.length > 1 ? "s" : ""
                      }`
                    : ""}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    className={`rounded-lg p-1.5 text-slate-500 hover:bg-[#F6F0FF] hover:text-slate-700 transition ${
                      page === 1 ? "cursor-not-allowed opacity-40" : ""
                    }`}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    type="button"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-[#F6F0FF] hover:text-slate-700 transition"
                    onClick={() => setPage((prev) => prev + 1)}
                    type="button"
                    disabled={isLoading || users?.length === 0}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Main card */}

        <div className="overflow-hidden   border border-[#F6F0FF] bg-white shadow-sm">
          {/* Content */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <TableSkeleton rows={8} columns={7} />
            ) : filteredUsers?.length === 0 ? (
              <NoDataFound
                title="No Users Found"
                subtitle="You don't have any users in your workspace."
                className="h-[calc(100vh-110px)] overflow-hidden"
              />
            ) : (
              // Table of users
              <div className="h-[calc(100vh-101px)] overflow-y-auto">
                <table className="min-w-full text-left text-sm ">
                  <thead className="border-b sticky top-0 bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Token</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y  divide-[#F6F0FF] text-xs">
                    {filteredUsers.map((user) => {
                      const fullName = formatName(
                        user.first_name,
                        user.last_name,
                      );
                      const initials = getInitials(
                        user.first_name,
                        user.last_name,
                      );
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          {/* User */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F0FF] text-xs font-semibold text-[#260C41]">
                                {initials}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {fullName || "Unnamed User"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  ID: {user.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-4 py-3 align-middle">
                            <span
                              className={`inline-flex items-center rounded-full px-3 pt-1 pb-1 text-[11px] whitespace-nowrap
    ${
      user.role === "admin"
        ? "bg-indigo-50 text-purple-600"
        : user.role === "employee"
          ? "bg-blue-50 text-purple-600"
          : user.role === "user"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[#F6F0FF] text-slate-500"
    }

    `}
                            >
                              {user.role === "admin"
                                ? "Admin"
                                : user.role === "employee"
                                  ? "Org Member"
                                  : user.role === "user"
                                    ? "Reg User"
                                    : "Unknown"}
                            </span>
                          </td>

                          {/* Email */}
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-1 text-slate-700">
                              <FiMail className="h-3 w-3 text-slate-400" />
                              <span className="truncate max-w-[180px]">
                                {user.email_address || "-"}
                              </span>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-1 text-slate-700">
                              <FiPhone className="h-3 w-3 text-slate-400" />
                              <span>
                                {user.country_code} {user.phone_number}
                              </span>
                            </div>
                          </td>

                          {/* Company */}
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-1 text-slate-700">
                              {/* <FiGrid className="h-3 w-3 text-slate-400" /> */}
                              <HiOutlineBuildingOffice2 className="h-3 w-3 text-slate-400" />

                              <span className="truncate max-w-[160px]">
                                {user.company_name || "-"}
                              </span>
                            </div>
                          </td>

                          {/* Token */}
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-1 text-slate-700">
                              <HiOutlineBuildingOffice2 className="h-3 w-3 text-slate-400" />

                              <span className="truncate max-w-[160px]">
                                {user.user_token || "-"}
                              </span>
                              <MdCopyAll
                                className="h-4 w-4 text-slate-400 cursor-pointer"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    user.user_token,
                                  );
                                  toast.success("Token copied to clipboard");
                                }}
                              />
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-center text-slate-600">
                            {(user.role === "admin" || user.role === "user") &&
                            domain !== "inactive" ? (
                              <button
                                onClick={() => {
                                  user.role === "admin" &&
                                    handleoffline({
                                      company_id: user.company_id,
                                    });
                                  user.role === "user" &&
                                    handleoffline({ user_id: user.id });
                                }}
                                className="inline-flex whitespace-nowrap items-center justify-center rounded-full border border-slate-300 bg-[#F6F0FF] px-3 py-1 text-[11px] font-medium text-slate-500 cursor-pointer hover:bg-[#F6F0FF] hover:text-slate-600 active:scale-[0.97] transition duration-150"
                              >
                                Go Offline
                              </button>
                            ) : domain === "inactive" &&
                              (user.role === "user" ||
                                user.role === "admin") ? (
                              <button
                                onClick={() => {
                                  user.role === "admin" &&
                                    handleonline({
                                      company_id: user.company_id,
                                    });
                                  user.role === "user" &&
                                    handleonline({ user_id: user.id });
                                }}
                                className=" inline-flex whitespace-nowrap items-center justify-center rounded-full border border-slate-300 bg-[#F6F0FF] px-3 py-1 text-[11px] font-medium text-slate-500 cursor-pointer hover:bg-[#F6F0FF] hover:text-slate-600 active:scale-[0.97] transition duration-150 "
                              >
                                Go Online
                              </button>
                            ) : (
                              "--"
                            )}
                          </td>

                          {/* Created */}
                          <td className="px-2 py-3 align-middle text-slate-600">
                            {formatDate(user.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Small page indicator for mobile */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 sm:hidden">
          <span>Page {page}</span>
          {filteredUsers?.length > 0 && (
            <span>{filteredUsers?.length} user(s) shown</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
