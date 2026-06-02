import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized({
  title = "Unauthorized",
  message = "You don't have permission to view this page. Please sign in with an account that has access.",
  onAction,
}) {
  const navigate = useNavigate?.();

  const handleAction = () => {
    if (typeof onAction === "function") return onAction();
    navigate ? navigate("/login") : (window.location.href = "/login");
  };

  return (
    <div
      className="fixed inset-0 w-full h-screen z-[9999] bg-white flex items-center justify-center px-4"
      role="alertdialog"
      aria-labelledby="unauth-title"
      aria-describedby="unauth-desc"
    >
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
      <svg 
  xmlns="http://www.w3.org/2000/svg" 
  className="w-8 h-8 text-red-600" 
  fill="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    fillRule="evenodd" 
    d="M12 2a10 10 0 100 20 10 10 0 000-20zm2.47 6.47a.75.75 0 00-1.06-1.06L12 9.94 10.59 8.53a.75.75 0 00-1.06 1.06L10.94 11l-1.41 1.41a.75.75 0 001.06 1.06L12 12.06l1.41 1.41a.75.75 0 001.06-1.06L13.06 11l1.41-1.53z" 
    clipRule="evenodd"
  />
</svg>

        </div>

        {/* Title */}
        <h1 id="unauth-title" className="text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>

        {/* Message */}
        <p id="unauth-desc" className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
      

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition"
          >
            Go Back
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-400">
          If you believe this is an error, contact your administrator.
        </p>
      </div>
    </div>
  );
}
