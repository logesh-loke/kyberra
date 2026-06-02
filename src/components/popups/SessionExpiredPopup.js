// SessionExpiredModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "src/context/SessionContext"; 
import { useSocketContext } from "src/context/SocketContext";



export default function SessionExpiredModal() {
    const navigate = useNavigate();
  const { setSessionExpired } = useSession(); 
 const { disconnect } = useSocketContext();

    const onGoToLogin = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("onboarding-step");
      localStorage.removeItem("membershipRemindDate")
      localStorage.removeItem("passkeyTour")
      // localStorage.clear();
      disconnect();
      navigate("/");
      setSessionExpired(false);
    }



  return (
          <div
      className="
        fixed top-0 left-0 w-full h-[100vh]
        bg-black/40 backdrop-blur-sm
        z-[9999]
        flex items-center justify-center
      "
    >
      {/* Card */}
      <div className="relative max-w-[320px] w-full mx-4 overflow-hidden rounded-lg bg-white text-left shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
        <div className="bg-white px-4 py-5">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-red-600"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>

          {/* Text */}
          <div className="mt-3 text-center">
            <span className="text-base font-semibold leading-6 text-slate-900">
              Session expired
            </span>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              Your login session has expired. Please sign in again to continue.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-4 pb-4">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700"
            onClick={onGoToLogin}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  
  );
}
