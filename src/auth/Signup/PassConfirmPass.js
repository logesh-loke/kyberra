import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, CheckCircle } from "lucide-react";
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
const PassConfirmPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailerrorstate, setEmailErrorState] = useState("");
  const signup = localStorage.getItem("signupData");
  const signupData = signup ? JSON.parse(signup) : {};
  const navigate = useNavigate();

  const fetchuser = (payload) => axiosInstance.post("/auth/signup", payload);
  const fetchemailfind = (payload) => {
    return axiosInstance.get(`/auth/find_email?email=${payload}`);
  };

   const {
    data: postdata,
    mutate: postmutate,
    error: posterror,
    isPending: isLoading,
  } = useMutation({
    mutationKey: ["signup"],
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

 

  // Form data (removed name, phone, gmail, countryCode)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});

  // Password validation rule
  const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const passwordValid = passwordRule.test(formData.password);
  const passwordsMatch =
    formData.password &&
    formData.confirm &&
    formData.password === formData.confirm;

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Username handler to enforce no @ in input
  const handleUsernameChange = (e) => {
    const val = e.target.value || "";

  // ❌ Block uppercase letters & spaces
  if (/[A-Z\s]/.test(val)) {
    setErrors((prev) => ({
      ...prev,
      username: "Only lowercase letters allowed (no spaces)",
    }));
    return;
  }

    if (val.includes("@")) {
      const cleaned = val.split("@")[0];
      setFormData((prev) => ({ ...prev, username: cleaned }));
      setErrors((prev) => ({
        ...prev,
        username:
          "Please enter only the username (do not include @kyberra.com).",
      }));
      console.log(`${formData.username}@kyberra.com`);
    } else {
      setFormData((prev) => ({ ...prev, username: val }));
      setErrors((prev) => ({ ...prev, username: "" }));
      emailmutate(`${val}@kyberra.com`);

      // console.log(`${val}@crypsyn.com`);
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
      email: `${formData.username}@Kyberra.com`,
      password: formData.password,
      c_password: formData.confirm,
      country_code: signupData.country_code,
      f_name: signupData.f_name,
      gmail: signupData.gmail,
      l_name: signupData.l_name,
      phone_number: signupData.phone_number,
    };

    postmutate(finalData);
    // console.log(finalData);
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
        navigate("/signin");
        localStorage.removeItem("signupData");
      });
    }
  }, [postdata]);

  useEffect(() => {
    if (posterror) {
      const err = posterror?.response?.data?.message;
      if (err === "User already exists and active") {
        Swal.fire({
          icon: "error",
          title: "User already exists",
          text: "Please Login instead. or enter a different gmail address.",
          confirmButtonText: "Go to Login",
          allowOutsideClick: false,
          // confirmButtonColor: "#4638CB",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/signin");
          }
        });
      }
      localStorage.removeItem("signupData");
    }
  }, [posterror]);

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
    <div className="min-h-screen bg-[#F6F0FF] flex items-center justify-center px-1 lg:px-6 md:px-4 overflow-hidden">
  <div div className="w-full max-w-5xl h-[570px] bg-white overflow-hidden rounded-2xl shadow-2xl lg:grid lg:grid-cols-2" >

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
    <div
      // style={{
      //   backgroundImage: `url(${background})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
      className="min-h-[570px] flex items-center justify-center p-4 relative rounded-2xl bg-[#ffff]"
    >
          {/* tab & mobile logo */}
          <div className="block lg:hidden flex justify-center absolute top-5 sm:top-9 md:top-11 items-center mb-6">
            <img src={logo} alt="logo-image" className="w-28" />
          </div>

      <div className="relative w-full max-w-xl">
        <div className="relative bg-white/40 p-8 ">

           {/* tab & mobile logo */}
            <div className="block lg:hidden">
            <img src={logo} alt="logo-image" className="w-10 " />
            </div>
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Account Setup
            </h1>
            <p className="text-sm text-gray-500">
              Create your Kyberra Mail password
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username/Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  placeholder="Eg: johndoe@kyberra.com"
                  className={`w-full pl-11 pr-28 py-2 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 
    transition-all focus:outline-none 
    ${
      emailerrorstate === "Success"
        ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        : emailerrorstate === "exists"
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
    }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  @Kyberra.com
                </span>
              </div>
              {emailerrorstate === "exists" && (
                <p className="text-xs text-red-500 mt-2">
                  This email is already in use. Please choose a different one
                </p>
              )}
              {errors.username && (
                <p className="text-xs text-red-500 mt-2">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
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
              disabled={isLoading}
              className={`w-full ${isLoading  ? 'cursor-not-allowed opacity-90' :  ''}bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus: focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? <SmallSpinner /> : "Create Account"}
              
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default PassConfirmPass;
