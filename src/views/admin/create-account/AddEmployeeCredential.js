import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, CheckCircle } from "lucide-react";
import {  useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const AddEmployeeCredential = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailerrorstate, setEmailErrorState] = useState("");
  const user = localStorage.getItem("userDetails");
  const userDetails = user ? JSON.parse(user) : {};
  const domain = userDetails.domain;
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  // console.log('state', state);
  

  const fetchuser = (payload) => axiosInstance.post("/require/add-employee", payload);
  const fetchemailfind = (payload) =>
    axiosInstance.get(`/auth/find_email?email=${payload}`);

  const {
    data: postdata,
    mutate: postmutate,
    error: posterror,
    isPending: isLoading,
  } = useMutation({
    mutationKey: ["add-employee"],
    mutationFn: fetchuser,
  });

  const {
    data: emaildata,
    mutate: emailmutate,
    error: emailerror,
  } = useMutation({
    mutationKey: ["emailfind"],
    mutationFn: fetchemailfind,
  });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const passwordValid = passwordRule.test(formData.password);
  const passwordsMatch =
    formData.password &&
    formData.confirm &&
    formData.password === formData.confirm;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Username handler to enforce no @ in input
  const handleUsernameChange = (e) => {
    let val = e.target.value || "";

      // ❌ Block uppercase letters
  if (/[A-Z]/.test(val)) {
    setErrors((prev) => ({
      ...prev,
      username: "Only lowercase letters are allowed",
    }));
    return;
  }

  // ❌ Remove spaces
  val = val.replace(/\s/g, "");

    if (val.includes("@")) {
      const cleaned = val.split("@")[0];
      setFormData((prev) => ({ ...prev, username: cleaned }));
      setErrors((prev) => ({
        ...prev,
        username:
          `Please enter only the username (do not include @${domain}).`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, username: val }));
      setErrors((prev) => ({ ...prev, username: "" }));
      if (val.trim()) {
        emailmutate(`${val}@${domain}`);
      }
    }
  };

  const handleSubmit = () => {
    let newErrors = {};

    if (!formData.username?.trim())
      newErrors.username = "Username is required.";

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!passwordValid) {
      newErrors.password =
        "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, and one numeric.";
    }

    if (!formData.confirm.trim()) {
      newErrors.confirm = "Confirm password is required.";
    } else if (formData.password && !passwordsMatch) {
      newErrors.confirm = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const finalData = {
      email: `${formData.username}@${domain}`,
      password: formData.password,
      c_password: formData.confirm,
      country_code: state.country_code,
      f_name: state.f_name,
      gmail: state.gmail,
      l_name: state.l_name,
      phone_number: state.phone_number,
    };

    
    postmutate(finalData);
  };

  useEffect(() => {
    if (postdata?.data?.message === "Created successfully") {
      Swal.fire({
        icon: "success",
        title: "Account Created Successfully",
        text: "You can now log in with your new password.",
        timer: 1000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/inbox");
      });
    }
  }, [postdata, navigate]);

  useEffect(() => {
    if (posterror) {
      const err = posterror?.response?.data?.message;
      toast.error(err);
      if (err === "Gmail Aleardy Exists") {
        Swal.fire({
          icon: "error",
          title: "User already exists and active",
          text: "Please Login instead.",
          confirmButtonText: "Go to Login",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/inbox");
          }
        });
      }
    }
  }, [posterror, navigate]);

  useEffect(() => {
    if (emaildata?.data?.message === "Success") {
      setEmailErrorState("Success");
      return;
    }

    if (emaildata?.data?.message === "Internal Server Error") {
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
  }, [emaildata]);

  useEffect(() => {
    if (emailerror?.response?.data?.message === "Email Already Exists") {
      setEmailErrorState("exists");
      return;
    }
  }, [emailerror]);

  return (
    <div className="bg-white">
      {/* Header (same style as previous UI) */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-2 py-2 rounded-lg
                text-slate-600 hover:text-slate-800 hover:bg-[#F6F0FF] transition"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300" />

            <p className="text-sm text-slate-500">
              Set secure login credentials for the employee mailbox
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-2 pb-6">
        <div className="max-w-3xl">
          {/* Page title */}
          <h1 className="text-xl font-semibold text-slate-800 mb-3">
            Employee credentials
          </h1>

          <div className="space-y-5">
            {/* Username */}
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Create / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  placeholder="Eg: johndoe"
                  className={`w-full pl-11 pr-28 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-800 placeholder-gray-400 
                    transition-all focus:outline-none 
                    ${
                      emailerrorstate === "Success"
                        ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        : emailerrorstate === "exists"
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs md:text-sm pointer-events-none">
                  @{domain}
                </span>
              </div>
              {emailerrorstate === "exists" && (
                <p className="text-xs text-red-500 mt-2">
                  This email is already in use. Please choose a different one.
                </p>
              )}
              {errors.username && (
                <p className="text-xs text-red-500 mt-2">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 border focus:border-purple-500 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all
                    ${
                      formData.password
                        ? passwordValid
                          ? "border-green-400"
                          : "border-red-300"
                        : "border-gray-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  value={formData.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 border rounded-lg text-sm focus:border-purple-500 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all
                    ${
                      formData.confirm
                        ? passwordsMatch
                          ? "border-green-400"
                          : "border-red-300"
                        : "border-gray-300"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {formData.confirm && passwordsMatch && passwordValid && (
                  <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.confirm && (
                <p className="text-xs text-red-500 mt-2">{errors.confirm}</p>
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
                disabled={isLoading}
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm bg-[#8A3FFA] hover:bg-[#771ff9] focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:ring-offset-1 transition-colors ${
                  isLoading ? "cursor-not-allowed opacity-90" : ""
                }`}
              >
                {isLoading ? <SmallSpinner /> : "Create Account"}
              </button>
            </div>

     
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeCredential;
