import React, { useState } from "react";
import { Mail, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiArrowLeft } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "src/api/Api";
import toast from "react-hot-toast";
import SmallSpinner from "src/components/loaders/SmallSpinner";

const AddEmployeeDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gmail: "",
    countryCode: "+91",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  // const [showOtpModal, setShowOtpModal] = useState(false);
  // const [otp, setOtp] = useState("");

  // const { mutate: gmailValidateMutate, isPending: isGmailValidateLoading } =
  //   useMutation({
  //     queryKey: ["otp"],
  //     mutationFn: (payload) => axiosInstance?.post("/auth/otp", payload),
  //     onSuccess: () => {
  //       toast.success("OTP sent to your gmail");
  //       setShowOtpModal(true);
  //     },
  //     onError: () => {
  //       toast.error("Failed to send OTP. Please try again.");
  //     },
  //   });

  // const {
  //   data: verifyOtpData,
  //   mutate: verifyOtpMutate,
  //   isPending: isVerifyOtpLoading,
  // } = useMutation({
  //   queryKey: ["verify-otp"],
  //   mutationFn: (payload) => axiosInstance?.post("/auth/verify-otp", payload),
  //   onSuccess: () => {
  //     toast.success("OTP verified successfully");
  //     setShowOtpModal(false);
  //   },
  //   onError: (res) => {
  //     if (res) {
  //       console.log(res);

  //       toast.error(res?.response?.data?.message);
  //     } else {
  //       toast.error("Failed to verify OTP. Please try again.");
  //     }
  //   },
  // });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent uppercase letters & spaces for gmail
    if (name === "gmail") {
      if (/[A-Z\s]/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          gmail: "Only lowercase letters allowed (no spaces)",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
 let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.gmail.trim()) newErrors.gmail = "Gmail address is required.";
    else if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(formData.gmail))
      newErrors.gmail = "Only @gmail.com email addresses are allowed.";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

    setErrors(newErrors);
        //  Block submit if Gmail not verified
// if (!isOtpVerified) {
//   toast.error("Please verify your Gmail before creating employee account");
//   setErrors((prev) => ({
//     ...prev,
//     gmail: "Please validate and verify your Gmail first.",
//   }));
//   return;
// }

    if (Object.keys(newErrors).length > 0) return;

    const finalData = {
      f_name: formData.firstName,
      l_name: formData.lastName,
      gmail: formData.gmail,
      country_code: formData.countryCode,
      phone_number: formData.phone,
    };

    navigate("/create-account/add-employee-credential", { state: finalData });
  };

  // const handleValidateGmail = () => {
  //   if (!formData.gmail) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       gmail: "Gmail address is required.",
  //     }));
  //     return;
  //   }

  //   //  Only allow @gmail.com
  //   const gmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

  //   if (!gmailRegex.test(formData.gmail)) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       gmail: "Only @gmail.com email addresses are allowed.",
  //     }));
  //     return;
  //   }

  //   gmailValidateMutate({ gmail: formData.gmail });
  // };

  // const handleVerifyOtp = () => {
  //   if (!otp) return;

  //   verifyOtpMutate({ gmail: formData.gmail, otp: otp });
  // };

  // const handleResendOtp = () => {
  //   setOtp("");
  //   gmailValidateMutate({ gmail: formData.gmail });
  // };

  // const isOtpVerified = verifyOtpData?.data?.message === "Success";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-2 py-2 rounded-lg
                text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300" />

            <p className="text-sm text-slate-500">
              Create a new employee account with secure mailbox access
            </p>
          </div>
        </div>
      </div>

      {/* Form section – normal page layout, not centered card */}
      <div className="px-4 pb-6 pt-2">
        <div className="max-w-3xl">
          {/* Page title (optional) */}
          <h1 className="text-xl font-semibold text-slate-800 mb-3">
            Employee details
          </h1>

          <div className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Gmail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                <span className="text-xs text-gray-500 ml-1">
                  (Gmail required)
                </span>
              </label>
              <div className="relative max-w-md">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                {/* <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  disabled={isOtpVerified}
                  placeholder="employee@gmail.com"
                  className={`w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-sm transition-colors
    ${
      isOtpVerified
        ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed opacity-40"
        : "border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    }`}
                /> */}
                     <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  placeholder="employee@gmail.com"
                  className="w-full rounded-lg border bg-white pl-10 pr-4 py-2.5 text-sm transition-colors border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
 
                />
              </div>
              {errors.gmail && (
                <p className="mt-1.5 text-xs text-red-600">{errors.gmail}</p>
              )}
            </div>

            {/* Validate */}
            {/* <button
              type="button"
              onClick={handleValidateGmail}
              disabled={isOtpVerified || isGmailValidateLoading}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors
    ${
      isOtpVerified
        ? "bg-green-600 text-white cursor-not-allowed opacity-50"
        : "bg-[#6C72F3] text-white hover:bg-[#676CE7] focus:outline-none focus:ring-2 focus:ring-[#6C72F3] focus:ring-offset-2"
    }`}
            >
              {isOtpVerified ? (
                "Verified"
              ) : isGmailValidateLoading ? (
                <SmallSpinner />
              ) : (
                "Validate"
              )}
            </button> */}

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex max-w-md">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>

                <div className="relative flex-1">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-r-lg border border-l-0 border-gray-300 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6C72F3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
              >
                <span>Create Employee Account</span>
                <FaArrowRightLong size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Verify Email
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter the OTP sent to <b>{formData.gmail}</b>
            </p>

            <input
              type="text"
              value={otp}
              maxLength={6}
              autoComplete="off"
              inputMode="numeric"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:underline"
              >
                {isGmailValidateLoading ? "resending..." : "Resend OTP"}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 text-sm rounded-lg bg-[#6C72F3] text-white hover:bg-[#676CE7]"
                >
                  {isVerifyOtpLoading ? <SmallSpinner /> : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AddEmployeeDetails;
