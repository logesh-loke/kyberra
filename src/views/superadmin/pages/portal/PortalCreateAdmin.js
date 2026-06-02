// src/pages/control-panel/CreateAdmin.js
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import Swal from "sweetalert2";

export default function CreateAdmin({
  token,
  setIsCompanyCreated,
  plan_id,
  plan_name,
  domain,
  companyId,
}) {
  const navigate = useNavigate();
  const domainname = domain || "@crypsyn.com";
  //   const domainId = location.state?.company_id || null;

  const [admin, setAdmin] = useState({
    adminFname: "",
    adminLname: "",
    adminCustomEmail: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({
    adminFname: "",
    adminLname: "",
    adminCustomEmail: "",
    password: "",
    cpassword: "",
  });

  // show/hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  // control when to show error messages
  const [showErrors, setShowErrors] = useState(false);

  const adminEmailRequest = (payload) =>
    axiosInstance.get(`/auth/find_email?email=${payload.email}@${domainname}`);

  const createAdminRequest = (payload) =>
    axiosInstance.post(`/auth/admin`, payload);

  const {
    data: adminEmailResponse,
    mutate: adminEmailMutate,
    error: adminEmailError,
    reset: resetAdminEmail,
  } = useMutation({
    mutationFn: adminEmailRequest,
    mutationKey: ["adminEmail"],
  });

  const emailSuccessMessage = adminEmailResponse?.data?.message;
  const emailErrorMessage = adminEmailError?.response?.data?.message;

  const {
    // data: createAdminResponse,
    mutate: createAdminMutate,
    // error: createAdminError,
  } = useMutation({
    mutationFn: createAdminRequest,
    mutationKey: ["createAdmin"],
    onSuccess: () => {
      toast.success("Admin created successfully");
      navigate("/");
    },
    onError: () => {
      Swal.fire({
        title: "Backend Service Error",
        text: "A technical issue occurred in the backend service. Please contact your administrator for support.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const validateField = (name, value, allValues = admin) => {
    const raw = typeof value === "string" ? value : "";
    const trimmed = raw.trim();

    switch (name) {
      case "adminFname":
        if (!trimmed) return "First name is required";
        if (trimmed.length < 2)
          return "First name must be at least 2 characters";
        return "";

      case "adminLname":
        if (!trimmed) return "Last name is required";
        if (trimmed.length < 1) return "Last name must be at least 1 character";
        return "";

      case "adminCustomEmail": {
        if (!trimmed) return "Custom company email is required";

        if (trimmed.includes("@")) {
          return "Please enter only the username (do not include eg: @crypsyn.com).";
        }

        if (emailErrorMessage === "Email Already Exists") {
          return "Email already exists. Please use a different email address";
        }

        return "";
      }

      case "password": {
        if (!trimmed) return "Password is required";

        const strongPassword =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if (!strongPassword.test(trimmed)) {
          return "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special char & 8+ chars";
        }
        return "";
      }

      case "cpassword": {
        if (!trimmed) return "Confirm password is required";
        const original = (allValues.password || "").trim();
        if (trimmed !== original) {
          return "Passwords do not match";
        }
        return "";
      }

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (
      (name === "adminCustomEmail" || name === "adminGmail") &&
      /[A-Z]/.test(value)
    ) {
      setShowErrors(true);
      setErrors((prev) => ({
        ...prev,
        [name]: "Only lowercase letters are allowed",
      }));
      return;
    }

    if (name === "adminCustomEmail" && newValue.includes("@")) {
      setShowErrors(true);
      setErrors((prev) => ({
        ...prev,
        adminCustomEmail:
          "Please enter only the username (do not include @crypsyn.com).",
      }));
      return;
    }
    if (name === "adminCustomEmail" || name === "adminGmail") {
      newValue = newValue.replace(/\s/g, "");
    }

    const nextAdmin = {
      ...admin,
      [name]: newValue,
    };

    setAdmin(nextAdmin);

    if (name === "adminCustomEmail") {
      const trimmed = newValue.trim();
      if (!trimmed) {
        resetAdminEmail();
      } else {
        adminEmailMutate({
          email: trimmed.toLowerCase(),
        });
      }
    }

    if (showErrors) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue, nextAdmin),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(admin).forEach((field) => {
      const err = validateField(field, admin[field], admin);
      newErrors[field] = err;
      if (err) isValid = false;
    });

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowErrors(true);
    if (!validateForm()) return;

    const pwd = (admin.password || "").trim();
    const cpwd = (admin.cpassword || "").trim();

    if (pwd !== cpwd) {
      setErrors((prev) => ({
        ...prev,
        cpassword: "Passwords do not match",
      }));
      return;
    }

    // const phoneDigits = (admin.phoneNumber || "").replace(/\D/g, "");

    const payload = {
      f_name: admin.adminFname.trim(),
      l_name: admin.adminLname.trim(),
      email: admin.adminCustomEmail
        .concat("@", domainname)
        .trim()
        .toLowerCase(),
      password: pwd,
      token: token,
      company_id: companyId,
    };
    createAdminMutate(payload);
  };

  const isEmailError =
    (!!(showErrors && errors.adminCustomEmail) ||
      emailErrorMessage === "Email Already Exists") &&
    admin.adminCustomEmail.trim() !== "";

  const isEmailSuccess =
    emailSuccessMessage === "Success" &&
    !isEmailError &&
    admin.adminCustomEmail.trim() !== "";

  const adminEmailInputClass = `
    w-full rounded-lg px-4 py-3 text-sm bg-white outline-none
    border
    ${
      isEmailError
        ? "border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        : isEmailSuccess
          ? "border-green-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
          : "border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
    }
    hover:border-slate-400 transition
  `;

  const adminEmailErrorText =
    (showErrors && errors.adminCustomEmail) ||
    (emailErrorMessage === "Email Already Exists"
      ? "Email already exists. Please use a different email address"
      : "");

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50/30 w-full">
      {/* header */}
      <div className="text-center space-y-2">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-500">
          Crypsyn Portal
        </h2>

        <p className="text-3xl font-bold text-slate-800">Create Admin</p>

        <div className="mx-auto h-1 w-12 rounded-full bg-blue-600"></div>
      </div>
      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Admin Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admin First Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Admin First Name
                </label>
                <input
                  name="adminFname"
                  value={admin.adminFname}
                  onChange={handleChange}
                  placeholder="Admin first name"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition"
                />
                {showErrors && errors.adminFname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.adminFname}
                  </p>
                )}
              </div>

              {/* Admin Last Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Admin Last Name
                </label>
                <input
                  name="adminLname"
                  value={admin.adminLname}
                  onChange={handleChange}
                  placeholder="Admin last name"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition"
                />
                {showErrors && errors.adminLname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.adminLname}
                  </p>
                )}
              </div>

              {/* Custom Company Domain Email */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Admin Email (Company Domain)
                </label>
                <input
                  name="adminCustomEmail"
                  value={admin.adminCustomEmail}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  className={adminEmailInputClass}
                />
                {adminEmailErrorText && (
                  <p className="text-red-500 text-xs mt-1">
                    {adminEmailErrorText}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Security */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={admin.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {showErrors && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showCPassword ? "text" : "password"}
                    name="cpassword"
                    value={admin.cpassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-12 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    {showCPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {showErrors && errors.cpassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cpassword}
                  </p>
                )}
              </div>
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
              className="px-8 py-3 rounded-lg bg-[#6C72F3] text-white hover:bg-[#656cf3] shadow-sm hover:shadow-md transition"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
