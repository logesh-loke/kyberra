import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import axiosInstance from "src/api/Api";
import TableSkeleton from "src/components/loaders/TableSkeliton";
import NoDataFound from "src/components/nodata/NoData";
import Swal from "sweetalert2";

const PendingVerificationTab = ({ search }) => {
  const QueryClient = useQueryClient();
  const pendindUserRequest = () => axiosInstance.get("/require/not-approved");
  const activeRequest = (payload) =>
    axiosInstance.put("/require/approved", payload);

  const { data: pendingUsers, isPending: isLoading } = useQuery({
    queryKey: ["pending-users"],
    queryFn: pendindUserRequest,
  });

  const {
    data: activateUserData,
    mutate: activateUserMutate,
    error: activateUserError,
  } = useMutation({
    mutationFn: activeRequest,
    mutationKey: ["approve-user"],
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["pending-users"] });
    },
  });

  useEffect(() => {
    if (activateUserData || activateUserError) {
      if (activateUserData) {
        const message = activateUserData?.data?.message;
        if (message === "Success") {
          toast.success("User Activated Successfully");
        }
      }

      if (activateUserError) {
        const msg = activateUserError?.response?.data?.message;
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
  }, [activateUserData, activateUserError]);
  const users = pendingUsers?.data?.data;

  // Filter logic
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`
        .toLowerCase()
        .trim();
      const email = (u.gmail || "").toLowerCase();
      const company = (u.company_name || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        company.includes(term)
      );
    });
  }, [users, search]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatName = (first, last) =>
    `${first ? first.charAt(0).toUpperCase() + first.slice(1) : ""} ${
      last ? last.charAt(0).toUpperCase() + last.slice(1) : ""
    }`.trim();

  const getInitials = (first, last) =>
    `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "?";

  const handleActivate = (userId) => {
    if (!userId) return;
    if(userId){
        activateUserMutate({ user_id: [userId] });
    }
  };

  return (
    <div className=" border border-slate-200 bg-white">
      {/* Content */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : !filteredUsers.length ? (
          <NoDataFound
            title="No Pending Verification Requests Found"
            subtitle="You don't have any pending verification requests."
            className="h-[calc(100vh-160px)] overflow-hidden"
          />
        ) : (
          <div className="h-[calc(100vh-160px)] overflow-y-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3">User's</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Requested On</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.map((user) => {
                  const name = formatName(user.first_name, user.last_name);
                  const initials = getInitials(user.first_name, user.last_name);

                  return (
                    <tr
                      key={user.user_id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full  bg-[#E0E7FF] text-[#676CE7] text-xs font-semibold">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {name || "Unnamed User"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              ID: {user.user_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-slate-700">
                        <span className="truncate max-w-[200px] block">
                          {user.gmail || "-"}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 text-slate-700">
                        {user.country_code} {user.phone_number}
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3 text-slate-700">
                        {user.company_name || "-"}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleActivate(user.user_id)}
                            className="rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 text-[11px] font-medium hover:bg-emerald-100 transition"
                          >
                            Approve
                          </button>
                        </div>
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
  );
};

export default PendingVerificationTab;
