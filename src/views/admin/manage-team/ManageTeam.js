import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "src/api/Api";
import NoDataFound from "src/components/nodata/NoData";
import TableSkeleton from "src/components/loaders/TableSkeliton";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { PiPasswordThin } from "react-icons/pi";
import { FiCopy } from "react-icons/fi";

const ManageTeam = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState({});
  const [page, setPage] = useState(1);
  const QueryClient = useQueryClient();

  const employeeRequest = () =>
    axiosInstance.get(`/require/employees?page=${page}`);
  const deleteRequest = (payload) => axiosInstance.put(`/require/in-active?user_id=${payload}`);

  const { data: employeeData, isPending: isLoading } = useQuery({
    queryKey: ["employeeRequest", page],
    queryFn: employeeRequest,
    keepPreviousData: true,
  });

  const { data: deleteData, mutate: deleteMutate, error: deleteError } = useMutation({
    mutationFn: deleteRequest,
    mutationKey: ["delete"],
    onSuccess: () => {
        QueryClient.invalidateQueries({ queryKey: ["employeeRequest"] });
    }

  })

  useEffect(() => {
    if(deleteData || deleteError){

        if(deleteData){
            const message = deleteData?.data?.message;

            if(message === 'Success'){
                toast.success("Employee deleted successfully");
            }
        }

        if(deleteError){
            const msg = deleteError?.response?.data?.message;

            if(msg === "Internal Server Error"){
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
  
    
  }, [deleteData, deleteError]);

  const employees = employeeData?.data?.data;

  // Filter logic on current page data
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];

    const term = search.trim().toLowerCase();
    if (!term) return employees;

    return employees.filter((emp) => {
      const fullName = `${emp.first_name || ""} ${emp.last_name || ""}`
        .toLowerCase()
        .trim();
      const email = (emp.email_address || "").toLowerCase();
      const company = (emp.company_name || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        company.includes(term)
      );
    });
  }, [employees, search]);

  const formatName = (first = "", last = "") => {
    const cap = (str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    return `${cap(first)} ${cap(last)}`.trim();
  };

  const getInitials = (first = "", last = "") => {
    const f = first?.[0] || "";
    const l = last?.[0] || "";
    const initials = `${f}${l}`.toUpperCase();
    return initials || "?";
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // setPage(1);
  };

  const handleModalOpen = (fullName,id   ) => {
    setDeleteId({name:fullName,id:id});
setIsDeleteModalOpen(true);
  }

  const handleDelete = (id) => {
    deleteMutate(id);
    setIsDeleteModalOpen(false);
  }

  return (
    <div className="bg-white shadow-sm border border-slate-200">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4">
          <div className="flex items-center justify-between h-12 gap-3">
            {/* Left: back + subtitle */}
            <div className="flex items-center gap-3">
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
                Manage and review your organization&apos;s team members.
              </p>
            </div>

            {/* Right: search + add + pagination */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
                <FiSearch className="text-slate-400" />
                <input
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by name, email, or company"
                  className="w-40 sm:w-64 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Add Employee */}
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                 onClick={() => navigate("/create-account/add-employee-details")} // wire when route ready
              >
                + Add Employee
              </button>

              {/* Pagination */}
              <div className="flex items-center gap-2">
                <p className="hidden text-[11px] text-slate-500 md:block">
                  Page{" "}
                  <span className="font-semibold text-slate-700">{page}</span>
                  {filteredEmployees?.length
                    ? ` • ${filteredEmployees.length} employee${
                        filteredEmployees.length > 1 ? "s" : ""
                      }`
                    : ""}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    className={`rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition ${
                      page === 1 ? "cursor-not-allowed opacity-40" : ""
                    }`}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    type="button"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    className={`rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition ${
                      filteredEmployees.length === 0
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={filteredEmployees.length === 0 || isLoading}
                    type="button"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="h-[calc(100vh-101px)] overflow-y-auto">
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton rows={8} columns={5} />
          ) : !filteredEmployees.length ? (
            <NoDataFound
              title="No Team Members Found"
              subtitle="You don't have any team members."
              className="h-[calc(100vh-110px)] overflow-hidden"
            />
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Joined On</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEmployees.map((emp) => {
                  const fullName = formatName(emp.first_name, emp.last_name);
                  const initials = getInitials(emp.first_name, emp.last_name);
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Employee */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0E7FF] text-[#676CE7] text-xs font-semibold ">
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {fullName || "Unnamed Employee"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              ID: {emp.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1 text-slate-700">
                          <FiMail className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[220px] block">
                            {emp.email_address || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1 text-slate-700">
                          <FiPhone className="h-3 w-3 text-slate-400" />
                          <span>
                            {emp.country_code} {emp.phone_number}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1 text-slate-700">
                          <HiOutlineBuildingOffice2 className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[160px]">
                            {emp.company_name || "-"}
                          </span>
                        </div>
                      </td>

   {/* Token */}
                 <td className="px-4 py-3 align-middle">
  <div className="flex items-center gap-2 text-slate-700">
    <PiPasswordThin className="h-3 w-3 text-slate-400" />

    <span className="truncate max-w-[160px]">
      {emp.user_token || "-"}
    </span>

    {emp.user_token && (
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(emp.user_token);
          toast.success("Token copied to clipboard.");
        }}
        title="Copy"
        className="text-slate-400 hover:text-slate-700 transition"
      >
        <FiCopy size={14} />
      </button>
    )}
  </div>
</td>


                      {/* Joined On */}
                      <td className="px-4 py-3 align-middle text-slate-600">
                        {formatDate(emp.created_at)}
                      </td>

                         {/* Trash */}
                      <td onClick={() => handleModalOpen(fullName, emp.id)} className="px-4 py-3 text-center text-slate-600 cursor-pointer">
                        <FiTrash2 size={14} className=" text-slate-400 mx-auto" />
                      </td>

                    </tr>
                  );
                })}




              </tbody>
            </table>
          )}
        </div>

        {/* Small page indicator for mobile */}
        <div className="mt-3 flex items-center justify-between px-4 pb-3 text-[11px] text-slate-500 sm:hidden">
          <span>Page {page}</span>
          {filteredEmployees?.length > 0 && (
            <span>{filteredEmployees.length} employee(s) shown</span>
          )}
        </div>
      </div>



{isDeleteModalOpen &&(
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md px-6 py-5">
        
        {/* Header */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete employee
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to delete {deleteId.name}?
          </p>
          {/* <p className="mt-1 text-sm text-gray-500">{deleteId.name}</p> */}
        </div>

        {/* Warning Box */}
        <div className="my-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
          <p className="text-xs text-red-700">
            This action cannot be undone. The employee will be permanently removed
            from your team list.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-3.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
           No, Cancel
          </button>

          <button onClick={() => handleDelete(deleteId.id)} className="px-4 py-1.5 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
)}


    </div>
  );
};

export default ManageTeam;
