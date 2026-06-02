// src/components/PasskeyModal.jsx
import React, { useState, useEffect } from "react";
import SmallSpinner from "../loaders/SmallSpinner";

const PasskeyModal = ({ open, onClose, onSubmit, passkeyError, isLoading }) => {
  const [passkey, setPasskey] = useState("");
  const [inputError, setInputError] = useState("");

  // Reset input when popup opens
  useEffect(() => {
    if (open) {
      setPasskey("");
      setInputError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passkey) {
      setInputError("Passkey is required.");
      return;
    }
    if (passkey.length < 4) {
      setInputError("Passkey must be at least 4 digits.");
      return;
    }

    if (inputError) return; // prevent submit if typing invalid

    onSubmit(passkey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md px-6 py-5 ${
          isLoading ? "cursor-not-allowed" : ""
        }`}
      >
        {/* 🔄 Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center cursor-not-allowed">
            <SmallSpinner />
          </div>
        )}

        {/* Header */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Secure message access
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            For security purposes, please enter your passkey to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="passkey"
              className="block text-sm font-medium text-gray-700"
            >
              Passkey
            </label>

            <input
              id="passkey"
              type="password"
              autoComplete="off"
              inputMode="numeric"
              autoFocus="on"
              value={passkey}
              onChange={(e) => {
                const value = e.target.value;

                // Only numbers allowed
                if (/^\d*$/.test(value)) {
                  setPasskey(value);
                  setInputError("");
                } else {
                  setInputError("Only numeric values are allowed.");
                }
              }}
              placeholder="Enter your passkey"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
              required
            />

            {/* Local typing validation error */}
            {inputError && <p className="text-xs text-red-500">{inputError}</p>}

            {/* Server/API error */}
            {passkeyError && (
              <p className="text-xs text-red-500">{passkeyError}</p>
            )}

            <p className="text-xs text-gray-400">
              Do not share your passkey with anyone. Keep your mailbox secure.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {isLoading ? <SmallSpinner /> : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasskeyModal;
