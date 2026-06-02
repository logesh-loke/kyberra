import React, { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import image from "src/assets/images/bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import background from 'src/assets/images/bg-new.png';
import logoWithName from 'src/assets/images/crypsyn-full-logo.png';
import bg from'src/assets/images/bgsign.jpeg'
import logo from'src/assets/images/kyberraLogo.png'

const CommonNewPassAndConfirmPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const email = JSON.parse(localStorage.getItem("email"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  const request = (payload) => axiosInstance.post("/auth/password", payload);

  const {
    data: isresponse,
    mutate: postmutate,
    isPending: isLoading,
    error: posterror,
  } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: request,
  });

  // Password validation rule
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

  const handleSubmit = () => {
    let newErrors = {};

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
      password: formData.password,
      email: email,
    };
    postmutate(finalData);
  };

  useEffect(() => {
    if (isresponse || posterror) {
      if (isresponse?.data?.message === "Success") {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Your password has been successfully updated. You may now sign in using your new credentials.",
          confirmButtonText: "Continue",
          timer: 1500,
          allowOutsideClick: false,
          timerProgressBar: true,
        }).then(() => {
          localStorage.removeItem("email");
          navigate("/signin");
        });
      }

      if (
        posterror?.response?.data?.message ===
        "Email Not Found Or Update Failed"
      ) {
        Swal.fire({
          icon: "error",
          title: "Email Not Found Or Update Failed",
          text: "Please try again with a valid email.",
          showConfirmButton: false,
          timer: 1000,
          allowOutsideClick: false,
          timerProgressBar: true,
        });
      } else if (
        posterror?.response?.data?.message === "Internal Server Error"
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
  }, [isresponse, posterror]);

  return (
  <div className="min-h-screen bg-[#F6F0FF] flex items-center justify-center lg:px-6 overflow-hidden">
  <div  className="w-full max-w-6xl h-[570px] bg-white overflow-hidden rounded-2xl shadow-2xl lg:grid lg:grid-cols-2" >

    {/* LEFT CARD */}
    <div
      className="relative flex flex-col justify-center px-16 text-white rounded-xl lg:m-3"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-6 left-6">

      <img
        src={logo}
        alt="logo"
        className=" lg:w-28"
        />
        </div>
      {/* content */}
      {/* <div className="text-white max-w-md">
        <h1 className="text-5xl font-bold leading-tight">
          Welcome Back
        </h1>

        <p className="mt-5 text-white/80 text-lg">
          Securely manage your communication and workflow with Crypsyn.
        </p>
      </div> */}
    </div>

          {/* tab & mobile logo */}
          <div className="block lg:hidden m-1 lg:m-4">
            <img src={logo} alt="logo-image" className="w-12 " />
          </div>
    <div
      // style={{
      //   backgroundImage: `url(${background})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
      className="min-h-[570px] flex items-center justify-center p-4 relative rounded-2xl bg-[#ffff]"
    >
      
      <div className="relative w-full max-w-xl">
        <div className="relative bg-white/40 p-8">
          {/* Header */}
          <div className="text-center mb-6">
             

            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Set a New Password
            </h1>
            <p className="text-sm text-gray-500">
              Create your Crypsyn Mail password
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-11 pr-12 py-2 bg-gray-50 border ${
                    formData.password
                      ? passwordValid
                        ? "border-green-400"
                        : "border-red-300"
                      : "border-gray-300"
                  } rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
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
            <div>
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
                  className={`w-full pl-11 pr-12 py-2 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${
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

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`w-full ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              } bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? <SmallSpinner /> : "Save Password"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Having trouble accessing your account?{" "}
            <Link
              to="/forgettoken"
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Forget Token
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CommonNewPassAndConfirmPass;
