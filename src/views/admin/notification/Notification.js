import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "src/api/Api";
import { FiCopy, FiTrash2, FiCheck, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NoDataFound from "src/components/nodata/NoData";
import moment from "moment";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ForgotTokenRequests = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const QueryClient = useQueryClient();

  const fetchTokens = () => axiosInstance.get("/require/user-token");
  const deleteTokenRequest = (payload) =>
    axiosInstance.delete(`/require/delete-token?id=${payload}`);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["user-token"],
    queryFn: fetchTokens,
  });

  const {
    data: deleteData,
    mutate: deleteToken,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteTokenRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["user-token"] });
    },
  });

  useEffect(() => {
    if (deleteData || deleteError) {
      if (deleteData?.data?.message === "Success") {
        toast.success("Token deleted successfully");
      }

      if (deleteError?.response?.data?.message === "Internal Server Error") {
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
  }, [deleteError, deleteData]);

  const tokenList = data?.data?.data;

  const filteredList = useMemo(() => {
    return tokenList?.filter((item) => {
      const name = `${item.first_name} ${item.last_name}`.toLowerCase();
      const token = item.user_token.toLowerCase();
      return (
        name.includes(search.toLowerCase()) ||
        token.includes(search.toLowerCase())
      );
    });
  }, [tokenList, search]);

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds?.length === filteredList?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList?.map((i) => i.id));
    }
  };

  const handleDelete = () => {
    deleteToken(selectedIds);
    // console.log("Delete IDs:", selectedIds);
  };

  const handleCopy = (token, id) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 900);
  };

  const allSelected =
    filteredList?.length > 0 && selectedIds?.length === filteredList?.length;

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 ">
          <div className="px-4">
            <div className="flex items-center justify-between h-12 gap-3">
              <div className="flex items-center gap-2">
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
  Review token requests, copy credentials, and maintain secure access control.
</p>

              </div>

              <div className="flex items-center gap-2">
                {/* TOTAL COUNT */}
                <span className="text-xs text-slate-500">
                  Total:{" "}
                  <strong className="text-[#6C72F3]">
                    {filteredList?.length}
                  </strong>
                </span>

                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-200 rounded-md px-2 py-1 text-xs w-[140px] outline-none focus:ring-1 focus:ring-[#6C72F3]"
                />

                {/* DELETE ICON SMALL */}
                <button
                  onClick={handleDelete}
                  disabled={!selectedIds.length}
                  className={`p-1.5 rounded transition ${
                    selectedIds.length
                      ? "text-rose-600 hover:bg-rose-100"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-slate-200 h-[calc(100vh-101)] overflow-y-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-sm font-medium text-slate-500">
                {/* CHECK ALL */}
                <th className="px-3 py-2 w-10 ">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 accent-[#6C72F3] cursor-pointer"
                  />
                </th>

                {/* Employee */}
                <th className="px-3 py-2 text-left">Employee</th>

                {/* Token */}
                <th className="px-3 py-2 text-left hidden md:table-cell">
                  Token
                </th>

                {/* Action */}
                <th className="px-3 py-2 text-center">Action</th>

                {/* Requested At */}
                <th className="px-3 py-2 text-left hidden md:table-cell">
                  Requested At
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-xs text-slate-500 text-left"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredList?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-0">
                    <NoDataFound
                      title="No Token Requests Found"
                      subtitle="You don't have any token requests."
                      className="h-[calc(100vh-140px)] overflow-hidden"
                    />
                  </td>
                </tr>
              ) : (
                filteredList?.map((item) => {
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`text-sm border-t ${
                        isChecked ? "bg-indigo-50/40" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* CHECK */}
                      <td className="px-3 py-2 align-top w-10 ">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(item.id)}
                          className="h-3.5 w-3.5 accent-[#6C72F3] cursor-pointer"
                        />
                      </td>

                      {/* NAME + mobile details */}
                      <td className="px-3 py-2 align-top">
                        <div className="font-medium text-slate-800">
                          {item.first_name} {item.last_name}
                        </div>
                        <div className="md:hidden text-[10px] text-slate-400">
                          {moment(item.created_at).format("D, MMM YYYY h:mm A")}
                        </div>
                        <div className="md:hidden font-mono text-[10px] text-gray-300 break-all">
                          {item.user_token}
                        </div>
                      </td>

                      {/* TOKEN (desktop) */}
                      <td className="px-3 py-2 font-mono hidden md:table-cell align-top break-all">
                        {item.user_token}
                      </td>

                      {/* COPY */}
                      <td className="px-3 py-2 align-top">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleCopy(item.user_token, item.id)}
                            title="Copy"
                            className="text-[#6C72F3] hover:text-indigo-700"
                          >
                            {copiedId === item.id ? (
                              <FiCheck size={14} className="text-emerald-500" />
                            ) : (
                              <FiCopy size={14} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* DATE (desktop) */}
                      <td className="px-3 py-2 text-slate-500 hidden md:table-cell align-top">
                        {moment(item.created_at).format("D, MMM YYYY h:mm A")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForgotTokenRequests;
