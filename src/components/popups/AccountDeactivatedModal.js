import React from "react";

const AccountDeactivatedModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md px-6 py-5">

        {/* Title */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Deactivated
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your account has been disabled by the system administrator.
          </p>
        </div>

        {/* Warning Box */}
        <div className="my-4 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
          <p className="text-xs text-red-700">
            You no longer have access to email services or workspace features.
          </p>
        </div>

        {/* Info */}
        <div className="mb-4 space-y-1">
          <p className="text-xs text-gray-500">
            🔒 Account Status:
            <span className="ml-1 font-medium text-gray-700">Inactive</span>
          </p>
          <p className="text-xs text-gray-500">
            👤 Action Required:
            <span className="ml-1 font-medium text-gray-700">
              Contact your administrator
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          {/* <button className="px-3.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            Close
          </button> */}
           <button onClick={onClose} className="px-4 py-1.5 text-sm rounded-lg  bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
    Got it
  </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDeactivatedModal;
