import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  FiAlertTriangle,
  FiShield,
//   FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";

const modalRoot = document.getElementById("modal-root");

const SubscriptionExpired = ({ onLogout }) => {
  const navigate = useNavigate();

  const request = () => axiosInstance.get("/require/planings");

  const{ data:planningData } = useQuery({
    queryKey: ["planings"],
    queryFn: request,
  })

  const plans = planningData?.data?.data || [];
  
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

//   const handleLogout = () => {
//     // localStorage.clear();
//     onLogout?.();
//     navigate("/");
//   };

  const handleContactSupport = () => {
    navigate("/support");
  };

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-white z-[9999] overflow-auto h-screen w-screen flex flex-col">
      {/* HEADER */}
      <div className="h-[70px] flex items-center justify-between px-4 sm:px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <FiShield className="text-white" />
          </div>
          <span className="text-base sm:text-lg font-semibold">MailBox</span>
        </div>
        {/* <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm"
        >
          <FiLock /> Logout
        </button> */}
      </div>

      {/* BODY */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* LEFT */}
        <div className="flex flex-col gap-6 p-4 sm:p-5">
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs bg-red-100 text-red-600">
              SUBSCRIPTION EXPIRED
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
              Your <span className="text-indigo-600">Premium Access</span> has been{" "}
              <span className="text-red-600">suspended</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 max-w-md">
              Your encrypted vault is temporarily locked. Renew your subscription
              to restore secure access to your messages and attachments.
            </p>
          </div>

          {/* SMALL INFO LIST INSTEAD OF BIG STATUS CARD */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              What happens when you renew?
            </p>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <FiCheckCircle className="mt-[2px] text-emerald-500 flex-shrink-0" />
                <span>Immediate access to all previously encrypted emails.</span>
              </div>
              <div className="flex items-start gap-2">
                <FiCheckCircle className="mt-[2px] text-emerald-500 flex-shrink-0" />
                <span>New messages continue to be protected with end-to-end encryption.</span>
              </div>
              <div className="flex items-start gap-2">
                <FiCheckCircle className="mt-[2px] text-emerald-500 flex-shrink-0" />
                <span>You keep your existing passkey and security settings.</span>
              </div>
            </div>
          </div>

          {/* WARNING */}
          <div className="mt-2 p-3.5 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2 text-[11px] sm:text-sm text-yellow-800">
              <FiAlertTriangle className="mt-[2px] flex-shrink-0" />
              <span>
                Renew within 30 days to avoid permanent deletion of your encrypted data.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-between border rounded-xl p-4 sm:p-5 lg:p-6 bg-white">
          <div>
            <h4 className="text-xl sm:text-2xl font-bold mb-2">
              Choose a plan to restore access
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Pick the plan that fits your needs. You can change or upgrade later.
            </p>

            {/* PLANS LIST */}
            <div className="flex flex-col gap-3">
              <button className="w-full border rounded-xl p-3.5 sm:p-4 text-left hover:border-indigo-500 hover:bg-indigo-50/40 transition">
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>{plans[0]?.plan_name|| "Basic"} {plans[0]?.duration|| "Monthly"}</span>
                  <span className="text-indigo-600 text-xs sm:text-sm">₹{plans[0]?.price|| "0.00"}</span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                  Light encryption usage and access for {plans[0]?.user_limit|| "0"} users.
                </p>
              </button>

              <button className="w-full border-2 border-indigo-500 rounded-xl p-3.5 sm:p-4 text-left bg-indigo-50/40">
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>
                    {plans[2]?.plan_name|| "Basic"} {plans[2]?.duration|| "Monthly"}
                    <span className="ml-2 text-[10px] sm:text-xs bg-indigo-500 text-white px-2 rounded-full">
                      POPULAR
                    </span>
                  </span>
                  <span className="text-indigo-600 text-xs sm:text-sm">₹{plans[2]?.price|| "0.00"}</span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                  All features unlocked and access for {plans[2]?.user_limit|| "0"} users.
                </p>
              </button>

              <button className="w-full border rounded-xl p-3.5 sm:p-4 text-left bg-green-50 border-green-400">
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>
                    {plans[3]?.plan_name|| "Basic"} {plans[3]?.duration|| "Monthly"}
                    <span className="ml-2 text-[10px] sm:text-xs bg-green-500 text-white px-2 rounded-full">
                      SAVE 40%
                    </span>
                  </span>
                  <span className="text-green-600 text-xs sm:text-sm">₹{plans[3]?.price|| "0.00"}</span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                  Best value for long-term, heavy usage. Access for {plans[3]?.user_limit|| "0"} users.
                </p>
              </button>

              <button className="w-full border rounded-xl p-3.5 sm:p-4 text-left hover:bg-slate-50 transition">
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <p>{plans[4]?.plan_name|| "Basic"} {plans[4]?.duration|| "Monthly"} <span className="text-xs text-gray-600">Team / Business</span></p>
                  
                  <span className="text-green-600 text-xs sm:text-sm">₹{plans[4]?.price|| "0.00"}</span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                  Multi-user setup with centralized billing. Access for {plans[4]?.user_limit|| "0"} users.
                </p>
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-center text-[11px] sm:text-sm text-gray-500 mt-4">
            Questions?{" "}
            <span
              onClick={handleContactSupport}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Contact our support team
            </span>{" "}
            • Typically respond within 15 minutes
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default SubscriptionExpired;
