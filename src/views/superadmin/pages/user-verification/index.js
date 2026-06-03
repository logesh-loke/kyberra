import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PendingVerificationTab from "./components/PendingVerificationTab";
// import RejectedUsersTab from "./components/RejectedUsersTab";
const UserVerification = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");


  return (
    <div>
      <div className=" bg-white shadow-sm border border-slate-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 mb-4">
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
                Approve, review, and manage user verifications.
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-full border border-slate-200 bg-[#F6F0FF] px-3 py-1.5 text-sm w-fit">
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by name, email, or company"
  className="w-64 bg-transparent text-xs text-slate-700  outline-none placeholder:text-slate-400"
  />
</div>

          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`relative pb-2 text-sm font-medium transition
                ${
                  activeTab === "pending"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              Pending Verification
              {activeTab === "pending" && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-[#8A3FFA]" />
              )}
            </button>

            {/* <button
              type="button"
              onClick={() => setActiveTab("verified")}
              className={`relative pb-2 text-sm font-medium transition
                ${
                  activeTab === "verified"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              Rejected Users
              {activeTab === "verified" && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full  bg-[#6C72F3]" />
              )}
            </button> */}
          </div>
        </div>

        {/* Tab Content */}
        <div className="h-[calc(100vh-156px)] overflow-y-auto">
{activeTab === "pending" && <PendingVerificationTab search={search} />}
          {/* {activeTab === "verified" && <RejectedUsersTab />} */}
        </div>
      </div>
    </div>
  );
};

export default UserVerification;