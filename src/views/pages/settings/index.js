import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import Swal from "sweetalert2";

const Settings = () => {
  const navigate = useNavigate();

  // Session timeout is always enabled
  const [sessionTimeout] = useState(true);
  const [timeoutDuration, setTimeoutDuration] = useState("15min");

  const requestTokenExpire = (payload) =>
    axiosInstance.put("/require/token-expire", payload);

  const {
    data: tokenExpireData,
    mutate: tokenExpireMutate,
    error: tokenExpireError,
  } = useMutation({
    mutationKey: ["token-expire"],
    mutationFn: requestTokenExpire,
  });

  useEffect(() => {
    if (tokenExpireData || tokenExpireError) {
      if (tokenExpireData?.data?.message === "Success") {
        toast.success("Session added Successfully");
      }

      if (tokenExpireError) {
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
  }, [tokenExpireData, tokenExpireError]);
  const handleSaveSecurity = (e) => {
    e.preventDefault();
    const payload = {
      token_expire: timeoutDuration,
    };
    tokenExpireMutate(payload);
    console.log({ sessionTimeout, timeoutDuration });
  };

  return (
    <div className="flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
              text-slate-600 hover:text-slate-800 hover:bg-[#F6F0FF] transition"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-[#F6F0FF]" />

            <div>
              <p className="text-sm font-semibold text-slate-800">Settings</p>
              <p className="text-xs text-slate-500">
                Manage security and session preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-[calc(100vh_-_200px)] overflow-y-auto px-4 py-4">
        <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-[2fr,1.3fr]">
          {/* Session Security */}
          <section className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiLock className="w-4 h-4 text-[#8A3FFA]" />
              <h2 className="text-sm font-semibold text-slate-800">
                Session Security
              </h2>
            </div>

            <form className="space-y-3" onSubmit={handleSaveSecurity}>
              {/* Session Timeout Enabled */}
              <label className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={sessionTimeout}
                  disabled
                  className="mt-[2px] w-[13px] h-[13px] accent-[#8A3FFA] cursor-not-allowed opacity-70"
                />
                <div>
                  <span className="font-medium">Session timeout enabled</span>
                  <p className="text-[10px] text-slate-500">
                    For security reasons, sessions automatically expire after
                    inactivity.
                  </p>
                </div>
              </label>

              {/* Timeout Duration */}
              <div className="flex flex-col gap-1 text-[11px] sm:text-xs">
                <label className="font-medium text-slate-700">
                  Session timeout duration
                </label>

                <select
                  value={timeoutDuration}
                  onChange={(e) => setTimeoutDuration(e.target.value)}
                  className="w-full max-w-[220px] border border-[#8A3FFA] rounded-md px-2 py-1.5 text-[11px] accent-[#8A3FFA]
                  focus:outline-none focus:ring-2 focus:ring-[#aa73fb] bg-white"
                >
                  <option value="15min" className="bg-[#F6F0FF] hover:bg-[#F6F0FF]">15 minutes</option>
                  <option value="30min" className="bg-[#F6F0FF] hover:bg-[#F6F0FF]">30 minutes</option>
                  <option value="1h" className="bg-[#F6F0FF] hover:bg-[#F6F0FF]">1 hour</option>
                </select>

                <p className="text-[10px] text-slate-500">
                  You’ll be logged out automatically after this period of
                  inactivity.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium
                  bg-[#AF7BFD] text-white hover:bg-[#9651fc]"
                >
                  Save session settings
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
