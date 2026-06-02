import React, { useEffect, useState } from "react";
import {
  Key,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import ProfileChild from "./components/ProfileChild";
// import { startProfilePasskeyTour } from "src/onboarding/tours"; 
import { driver } from "driver.js";

const Profile = () => {
 

  // PASSKEY — single state object
  const [passkeyData, setPasskeyData] = useState({
    token: "",
    newPasskey: "",
    confirmPasskey: "",
  });
  const [passkeyError, setPasskeyError] = useState("");
  const [showPasskeyForm, setShowPasskeyForm] = useState(false);
  const [showPasskeyVisible, setShowPasskeyVisible] = useState(false); // visibility toggle
  const [tokenError, setTokenError] = useState("");

  const createOrUpdatePasskey = (payload) =>
    axiosInstance.post("/require/passkey", payload);

  const {
    data: passkeyResponse,
    mutate: passkeyMutate,
    isPending: passkeyLoading,
    error: passkeyApiError,
  } = useMutation({
    mutationFn: createOrUpdatePasskey,
    mutationKey: ["passkey"],
  });


   const tourEndRequest = (payload) => axiosInstance.post("/require/login-status", payload);

   const { mutate: tourEndMutate } = useMutation({
    mutationFn: tourEndRequest,
    mutationKey: ["tourEnd"],
})
  // helper to keep passkeys numeric
  const onlyDigits = (value) => value.replace(/\D/g, "");

  // Submit handler
  const handleSubmitPasskey = () => {
    const { token, newPasskey, confirmPasskey } = passkeyData;

    if (!token || !newPasskey || !confirmPasskey) {
      setPasskeyError("Please fill all fields.");
      return;
    }

    // numeric only & at least 4 digits
    if (!/^\d{4,}$/.test(newPasskey) || !/^\d{4,}$/.test(confirmPasskey)) {
      setPasskeyError("Passkey must be numeric and at least 4 digits.");
      return;
    }

    if (newPasskey !== confirmPasskey) {
      setPasskeyError("Passkeys do not match.");
      return;
    }

    const payload = {
      token,
      passkey: newPasskey,
    };

    // console.log("Passkey Payload →", payload);
    passkeyMutate(payload);
  };

  useEffect(() => {
    if (passkeyResponse || passkeyApiError) {
      if (passkeyResponse?.data?.message === "Passkey Set Successfully") {
        tourEndMutate({ login_status: "true" });
              localStorage.setItem("passkeyTour", "true");
      try {
        const active = driver();   // get current instance
        active?.destroy();         // removes overlay + tooltip
      } catch (e) {
        console.warn("No active tour to destroy", e);
      }
        toast.success("Passkey Updated successfully.");
        // reset
        setPasskeyData({ token: "", newPasskey: "", confirmPasskey: "" });
        setPasskeyError("");
        setShowPasskeyForm(false);
      }

      if (passkeyApiError?.response?.data?.message === "Invalid Token") {
        setTokenError("Invalid Token. Please try again.");
        toast.error("Invalid Token. Please try again.");

        setPasskeyData({ token: "", newPasskey: "", confirmPasskey: "" });
        setPasskeyError("");
      } else if (
        passkeyApiError?.response?.data?.message === "Internal Server Error"
      ) {
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
  }, [passkeyResponse, passkeyApiError]);

  //   useEffect(() => {
  //       if (localStorage.getItem("passkeyTour") === "true") return;

  //   const t = setTimeout(() => {
  //     startProfilePasskeyTour();
  //   }, 1000); // small delay so DOM is ready

  //   return () => clearTimeout(t);
  // }, []);




  return (
    <div className="h-[calc(100vh-50px)] overflow-y-auto">
      <div className="px-4 pt-4 pb-8 sm:px-6 lg:px-4">
       <ProfileChild />
     
        <div
                id="profile-passkey-section"   // 👈 IMPORTANT
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Title + Button row */}
          <div className="flex justify-between items-center">
            <div
              className={`flex items-center gap-3 ${showPasskeyForm && "mb-4"}`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#E3E5FF] flex items-center justify-center">
                <Key className="w-5 h-5 text-[#676CE7]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Passkey</h3>
                <p className="text-sm text-slate-600">
                  Create or update your passkey
                </p>
              </div>
            </div>

            {!showPasskeyForm && (
              <button
                onClick={() => setShowPasskeyForm(true)}
                className="px-5 py-2 bg-[#676CE7] hover:bg-[#575CDA] text-white rounded-xl transition-all"
              >
                Set Passkey
              </button>
            )}
          </div>

          {showPasskeyForm && (
            <div className="space-y-5">
              {/* Token */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Verification Token
                </label>
                <input
                  type="text"
                  value={passkeyData.token}
                  onChange={(e) =>
                    setPasskeyData({ ...passkeyData, token: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
                            focus:outline-none focus:ring-2 focus:ring-[#676CE7]"
                />
              </div>
              {tokenError && <p className="text-xs text-red-500">{tokenError}</p>}

              {/* New Passkey */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPasskeyVisible ? "text" : "password"}
                    value={passkeyData.newPasskey}
                    onChange={(e) =>
                      setPasskeyData({
                        ...passkeyData,
                        newPasskey: onlyDigits(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl 
                              focus:outline-none focus:ring-2 focus:ring-[#676CE7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskeyVisible((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  >
                    {showPasskeyVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Passkey must be numeric and at least 4 digits.
                </p>
              </div>

              {/* Confirm Passkey */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPasskeyVisible ? "text" : "password"}
                    value={passkeyData.confirmPasskey}
                    onChange={(e) =>
                      setPasskeyData({
                        ...passkeyData,
                        confirmPasskey: onlyDigits(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl 
                              focus:outline-none focus:ring-2 focus:ring-[#676CE7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskeyVisible((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  >
                    {showPasskeyVisible ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {passkeyError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-5" />
                  <span>{passkeyError}</span>
                </div>
              )}

              <button
                disabled={
                  passkeyLoading ||
                  !passkeyData.token ||
                  !passkeyData.newPasskey ||
                  !passkeyData.confirmPasskey
                }
                onClick={handleSubmitPasskey}
                className={`w-full py-3 bg-[#676CE7] hover:bg-[#575CDA] text-white font-medium rounded-xl transition-all ${
                  passkeyLoading ||
                  !passkeyData.newPasskey ||
                  !passkeyData.confirmPasskey
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {passkeyLoading ? <SmallSpinner /> : "Save Passkey"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
