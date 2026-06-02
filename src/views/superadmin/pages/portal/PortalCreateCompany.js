import { useMutation } from "@tanstack/react-query";
import React, {  useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import { COUNTRY_CODES } from "src/constant/countrycode.constant";
import { validateField } from "./utils/companyFormValidateUtils";
import { COUNTRY_LIST } from "./utils/countryListUtils";
import Swal from "sweetalert2";

export default function CreateCompanyPortal({ token, plan_id, plan_name, setIsCompanyCreated, setDomain, setCompanyId }) {
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
    countryCode: "+91",
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
  });
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const createCompanyRequest = (payload) =>
    axiosInstance.post("/auth/company", payload);

  const { mutate: createMutate, isPending: isCreateLoading } = useMutation({
    mutationKey: ["createCompany"],
    mutationFn: createCompanyRequest,
    onSuccess: (res) => {
        const response = res?.data?.data?.company_id
        toast.success("Company created successfully");
        setCompanyId(response);
        setDomain(company.companyDomain);
        setIsCompanyCreated(true);
    },
    onError: (err) => {
        const errormsg = err?.response?.data?.message;
        if(errormsg === "Domain Already Exists"){
            toast.error("Domain already exists. Please choose a different domain.");
            Swal.fire({
                title: 'Domain Already Exists',
                text: 'Please choose a different domain.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
        }else{
                   Swal.fire({
              title: 'Backend Service Error',
              text: 'A technical issue occurred in the backend service. Please contact your administrator for support.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
        }
    }
  });

  const emailValidationRequest = (payload) =>
    axiosInstance.post("/auth/otp", payload);

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
    axiosInstance.post("/auth/verify-otp", payload);

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

      if (err === "Invalid OTP") {
        toast.error("Invalid OTP");
      } else if (err === "OTP Expired") {
        toast.error("OTP Expired. Please request a new OTP.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Normalize numeric fields
    if (name === "phoneNumber") {
      newValue = value.replace(/\D/g, "");
    }
    setCompany((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

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
      token: token,
      plan_id: plan_id,
    };

    createMutate(payload);
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
      {/* header */}
     <div className="text-center space-y-2">
  <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500">
    Crypsyn Portal
  </h2>

  <p className="text-3xl font-bold text-slate-800">
    Create Company
  </p>

  <div className="mx-auto h-1 w-12 rounded-full bg-blue-600"></div>
</div>

      {/* Main Content */}
      <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <option key={index} value={code.code}>
                      {code.code} {code.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.countryCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.countryCode}
                </p>
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
                maxLength={15}
                placeholder="9876543210"
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
                readOnly={
                  otpValidationResponse?.data?.message === "Success" ||
                  emailValidationResponse?.data?.message === "Success"
                }
                placeholder="example@gmail.com"
                className={`w-full ${otpValidationResponse?.data?.message === "Success" || emailValidationResponse?.data?.message === "Success" ? "bg-slate-100 cursor-not-allowed opacity-50" : ""} border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition`}
              />
              {errors.emailId && (
                <p className="text-red-500 text-xs mt-1">{errors.emailId}</p>
              )}
            </div>

            {emailValidationResponse?.data?.message === "Success" &&
            otpValidationResponse?.data?.message !== "Success" ? (
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
                    isOtpValidationLoading
                      ? "cursor-not-allowed opacity-50"
                      : ""
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
                  disabled={
                    isEmailValidationLoading ||
                    !company.emailId ||
                    otpValidationResponse?.data?.message === "Success"
                  }
                  className={`${
                    isEmailValidationLoading ||
                    !company.emailId ||
                    otpValidationResponse?.data?.message === "Success"
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

               {/* subscription plan */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Subscription Plan
              </label>
              <input
                value={plan_name}
                readOnly
                placeholder="Free Plan"
                className=" opacity-50 cursor-not-allowed w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition "
              />
            
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
                maxLength={12}
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
            {/* <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Cancel
            </button> */}

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
