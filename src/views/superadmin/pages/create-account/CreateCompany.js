import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import Swal from "sweetalert2";
import { COUNTRY_CODES } from "src/constant/countrycode.constant";
import CreatePortal from "./CreatePortal";

export default function CreateCompany() {
  const COUNTRY_LIST = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "United Arab Emirates",
    "Japan",
  ];

  const navigate = useNavigate();

  const [company, setCompany] = useState({
    companyName: "",
    buyerName: "",
    phoneNumber: "",
    emailId: "",
    streetAddress: "",
    area: "",
    city: "",
    pincode: "",
    country: "",
    companyDomain: "",
    countryCode: "+91"
  });

  const [errors, setErrors] = useState({
    companyName: "",
    buyerName: "",
    phoneNumber: "",
    emailId: "",
    streetAddress: "",
    area: "",
    city: "",
    pincode: "",
    country: "",
    companyDomain: "",
    countryCode: "",
      plan: "", 
  });
 const [portalModal, setPortalModal] = useState(false)
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  // Only store selected plan id (no plan_name in payload)
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const createCompanyRequest = (payload) =>
    axiosInstance.post("/require/company", payload);

  const planRequest = () => axiosInstance.get("/require/get-planings");

  const {
    data: createResponse,
    mutate: createMutate,
    error: createError,
    isPending: isCreateLoading,
  } = useMutation({
    mutationKey: ["createCompany"],
    mutationFn: createCompanyRequest,
  });

  const {
    data: planResponse,
    isLoading: isPlanLoading,
    isError: isPlanError,
  } = useQuery({
    queryKey: ["plan"],
    queryFn: planRequest,
  });

  useEffect(() => {
    if (createResponse || createError) {
      if (createResponse) {
        const message = createResponse.data.message;
        if (message === "Success") {
          Swal.fire({
            icon: "success",
            title: "Company created successfully",
            text: "Company created successfully. Redirecting to admin creation page...",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1500,
          }).then(() => {
            navigate("/control-panel/create-admin", {
              state: {
                company_id: createResponse?.data?.data?.company_id,
                domain: createResponse?.data?.data?.U_domain,
              },
            });
          });
        }
      }

      if (createError) {
        const msg = createError.response.data.message;

        if (msg === "Domain Already Exists") {
          setErrors((prev) => ({
            ...prev,
            companyDomain:
              "Domain Already Exists. Please choose another domain.",
          }));
          toast.error(
            "Company Domain Already Exists. Please choose another domain."
          );
        } else if (msg === "Internal Server Error") {
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
    }
  }, [createResponse, createError]);

  const emailValidationRequest = (payload) =>
    axiosInstance.post("/require/company-otp", payload);

  const {
    data: emailValidationResponse,
    mutate: emailValidationMutate,
    isPending: isEmailValidationLoading,
  } = useMutation({
    mutationKey: ["emailValidation"],
    mutationFn: emailValidationRequest,
    onSuccess: () => {
      toast.success("Email validation OTP sent successfully");
    },
    onError: () => {
      toast.error("Failed to send OTP. Please try again.");
    },
  });

    const otpValidationRequest = (payload) =>
    axiosInstance.post("/require/verify-company-otp", payload);

  const {
    data: otpValidationResponse,
    mutate: otpValidationMutate,
    isPending: isOtpValidationLoading,
  } = useMutation({
    mutationKey: ["otpValidation"],
    mutationFn: otpValidationRequest,
    onSuccess: () => {
      toast.success("OTP validation successful");
    },
    onError: (res) => {
      const err = res?.response?.data?.message;

      if(err === "Invalid OTP"){
        toast.error("Invalid OTP");
      }else if(err === "OTP Expired"){
        toast.error("OTP Expired. Please request a new OTP.");
      }else{
        
        toast.error("Failed to send OTP. Please try again.");
      }
    },
  });

  const planOptions = planResponse?.data?.data || [];

  // Utility: capitalize first letter of each word
  const capitalizeWords = (str = "") =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // ---- Single source of truth for field validation ----
  const validateField = (name, value) => {
    const raw = typeof value === "string" ? value : "";
    const trimmed = raw.trim();

    switch (name) {
      case "companyName":
        if (!trimmed) return "Company name is required";
        if (trimmed.length < 2)
          return "Company name must be at least 2 characters";
        return "";

      case "buyerName":
        if (!trimmed) return "Buyer name is required";
        if (trimmed.length < 2)
          return "Buyer name must be at least 2 characters";
        return "";

      case "emailId": {
        if (!trimmed) return "Email is required";

        //  Block spaces
        if (/\s/.test(trimmed)) {
          return "Email must not contain spaces";
        }

        //  Block uppercase letters
        if (/[A-Z]/.test(trimmed)) {
          return "Only lowercase letters are allowed";
        }

        //  Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address";
        }

        //  Allow only Gmail
        if (!trimmed.endsWith("@gmail.com")) {
          return "Only Gmail addresses are allowed";
        }

        return "";
      }

      case "phoneNumber": {
        const digits = trimmed.replace(/\D/g, "");
        if (!digits) return "Phone number is required";
        if (!/^\d+$/.test(digits) || digits.length !== 10) {
          return "Phone number must be exactly 10 digits";
        }
        return "";
      }

      case "companyDomain": {
        const compact = trimmed.replace(/\s+/g, "");
        const domainRegex = /\.(com|in|io|ai|net|org)$/i;
        if (!compact) return "Company domain is required";
        if (!domainRegex.test(compact)) {
          return "Domain must end with .com, .in, .io, .ai, .net, or .org";
        }
        return "";
      }

      case "streetAddress":
        if (!trimmed) return "Street address is required";
        if (trimmed.length < 5) return "Please enter a complete street address";
        return "";

      case "area":
        if (!trimmed) return "Area is required";
        if (trimmed.length < 2) return "Please enter a valid area name";
        return "";

      case "city":
        if (!trimmed) return "City is required";
        if (trimmed.length < 2) return "Please enter a valid city name";
        return "";

      case "pincode": {
        const digits = trimmed.replace(/\D/g, "");
        if (!digits) return "Pincode is required";
        if (!/^\d+$/.test(digits)) return "Pincode must contain only numbers";
        if (digits.length < 4) return "Pincode must be at least 4 digits";
        return "";
      }

      case "country":
        if (!trimmed) return "Country is required";
        return "";

      case "countryCode":
        if (!trimmed) return "Country code is required";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Normalize numeric fields
    if (name === "phoneNumber" || name === "pincode") {
      newValue = value.replace(/\D/g, "");
    }

    setCompany((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Re-validate this field on change
    // setErrors((prev) => ({
    //   ...prev,
    //   [name]: validateField(name, newValue),
    // }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(company).forEach((field) => {
      const error = validateField(field, company[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return isValid;
  };

  const handlePlanChange = (e) => {
    const id = e.target.value;
    setSelectedPlanId(id);
    // console.log("Selected plan id:", id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     //  PLAN VALIDATION
  if (!selectedPlanId) {
    setErrors((prev) => ({
      ...prev,
      plan: "Please select a subscription plan",
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      plan: "",
    }));
  }

    // if (!validateForm() || otpValidationResponse?.data?.message !== "Success" || emailValidationResponse?.data?.message !== "Success") return;
 if (!validateForm()) {
    toast.error("Please fill all required fields correctly", {
      position: "top-center",
    });
    return;
  }

  if (emailValidationResponse?.data?.message !== "Success") {
    toast.error("Please validate your email address", {
      position: "top-center",
    });
    return;
  }

  if (otpValidationResponse?.data?.message !== "Success") {
    toast.error("Please verify OTP before submitting", {
      position: "top-center",
    });
    return;
  }
    const rawDomain = company.companyDomain || "";
    const cleanedDomain = rawDomain.replace(/\s+/g, "").toLowerCase();
    const phoneDigits = (company.phoneNumber || "").replace(/\D/g, "");

    const payload = {
      company_name: company.companyName,
      buyer_name: company.buyerName,
      email_id: company.emailId,
      street_address: company.streetAddress,
      area: company.area,
      city: company.city,
      pincode: company.pincode,
      country: company.country,
      domain: cleanedDomain,
      phone_number: phoneDigits,
      country_code: company.countryCode,
      // Only plan_id is sent to backend
      plan_id: Number(selectedPlanId || null),
    };

    createMutate(payload);
    // console.table(payload);
  };

  const handleEmailValidate = (emailId) => {
    console.log("emailId:", emailId);

    emailValidationMutate({ gmail: emailId });
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    console.log("OTP:", otp.join(""));
    otpValidationMutate({
      gmail: company.emailId,
      otp: otp.join(""),
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 w-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 flex justify-between items-center">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            <div className="w-px h-6 bg-slate-300"></div>

            <p className="text-sm text-slate-500">
              Set up company workspace for encrypted mail
            </p>
          </div>
          <button
            onClick={() => setPortalModal(true)}
            type="button"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-white bg-[#6C72F3] hover:bg-[#5A62E0] transition"
          >
            Create Portal
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-110px)] overflow-auto mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {portalModal && <CreatePortal onClose={() => setPortalModal(false)} />}
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Company & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Company Name
              </label>
              <input
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Buyer Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Buyer Name
              </label>
              <input
                name="buyerName"
                value={company.buyerName}
                onChange={handleChange}
                placeholder="Primary contact name"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.buyerName && (
                <p className="text-red-500 text-xs mt-1">{errors.buyerName}</p>
              )}
            </div>


            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-medium text-slate-700">
                Country Code
              </label>
                   <div className="relative">
                              <select
                                name="countryCode"
                                value={company.countryCode}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                              >
                                {COUNTRY_CODES.map((code, index) => (
                                    <option key={index} value={code.code}>{code.code} {code.label}</option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                              {errors.countryCode && (
                <p className="text-red-500 text-xs mt-1">{errors.countryCode}</p>
              )}
</div>

        

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={company.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Company Domain + otp validation (separate white card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Email ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email ID
                <span className="text-gray-500 text-xs"> (gmail)</span>
              </label>
              <input
                type="email"
                name="emailId"
                value={company.emailId}
                onChange={handleChange}
                readOnly={otpValidationResponse?.data?.message === "Success" || emailValidationResponse?.data?.message === "Success"}
                placeholder="example@gmail.com"
                className={`w-full ${otpValidationResponse?.data?.message === "Success" || emailValidationResponse?.data?.message === "Success" ? "bg-slate-100 cursor-not-allowed opacity-50" : ""} border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition`}
              />
              {errors.emailId && (
                <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
              )}
            </div>

            {emailValidationResponse?.data?.message === "Success" && otpValidationResponse?.data?.message !== "Success" ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-8 h-8 text-center text-md  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C72F3]"
                    />
                  ))}
                </div>

                <button
                type="button"
                  onClick={handleOtpSubmit}
                  disabled={isOtpValidationLoading}
                  className={`px-6 py-1 bg-[#6C72F3] text-white rounded-lg hover:bg-[#6C72F3]/90 transition ${
                    isOtpValidationLoading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Verify OTP
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => handleEmailValidate(company.emailId)}
                  disabled={isEmailValidationLoading || !company.emailId || otpValidationResponse?.data?.message === "Success"}
                  className={`${
                    isEmailValidationLoading || !company.emailId || otpValidationResponse?.data?.message === "Success"
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  } bg-[#6C72F3] px-4 py-1 text-white rounded-lg`}
                >
                  {isEmailValidationLoading ? (
                    <div className="px-6">
                      <SmallSpinner />
                    </div>
                  ) : (
                    "Validate Email"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Company Domain + Plan section (separate white card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Company Domain */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Company Domain
              </label>
              <input
                name="companyDomain"
                value={company.companyDomain}
                onChange={handleChange}
                placeholder="crypsyn.com"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.companyDomain && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyDomain}
                </p>
              )}
            </div>

            {/* Plan Dropdown */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Subscription Plan
              </label>
              <select
                name="plan"
                value={selectedPlanId}
                onChange={handlePlanChange}
                disabled={isPlanLoading || isPlanError || !planOptions.length}
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              >
                <option value="">
                  {isPlanLoading
                    ? "Loading plans..."
                    : isPlanError
                    ? "Failed to load plans"
                    : "Select Subscription Plan"}
                </option>
                {planOptions.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {capitalizeWords(plan.plan_name)}
                  </option>
                ))}
              </select>
                {errors.plan && (
    <p className="text-red-500 text-xs mt-1">{errors.plan}</p>
  )}
            </div>
            
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            {/* Street Address */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Street Address
              </label>
              <input
                name="streetAddress"
                value={company.streetAddress}
                onChange={handleChange}
                placeholder="Street, building, landmark"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.streetAddress}
                </p>
              )}
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Area</label>
              <input
                name="area"
                value={company.area}
                onChange={handleChange}
                placeholder="Locality / area"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">City</label>
              <input
                name="city"
                value={company.city}
                onChange={handleChange}
                placeholder="City"
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Pincode
              </label>
              <input
                name="pincode"
                value={company.pincode}
                onChange={handleChange}
                placeholder="Postal code"
                maxLength={6}
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
              )}
            </div>

            {/* Country dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Country
              </label>
              <select
                name="country"
                value={company.country}
                onChange={handleChange}
                className=" w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              >
                <option value="">Select Country</option>
                {COUNTRY_LIST.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreateLoading}
              className={`${
                isCreateLoading ? "cursor-not-allowed opacity-50" : ""
              } px-8 py-3 rounded-lg bg-[#6C72F3] text-white hover:bg-[#656cf3] shadow-sm hover:shadow-md transition`}
            >
              {isCreateLoading ? <SmallSpinner /> : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
