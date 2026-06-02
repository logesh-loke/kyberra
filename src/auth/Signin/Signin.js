import React, { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import image from "src/assets/images/bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "src/api/Api";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import SmallSpinner from "src/components/loaders/SmallSpinner";
// import EnvCheck from 'src/views/pages/envcheck/EnvCheck';
import { useSocketContext } from "src/context/SocketContext";
// import MembershipEndModal from "src/components/popups/MembershipEndModal";
import AccountDeactivatedModal from "src/components/popups/AccountDeactivatedModal";
// import  logo  from "src/assets/images/bg-Photoroom.png";
import background from 'src/assets/images/bg-new.png';
import bg from'src/assets/images/bgsign.jpeg';
import logoWithName from 'src/assets/images/crypsyn-full-logo.png';
import logo from'src/assets/images/kyberraLogo.png'
const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [isMembershipEnded, setIsMembershipEnded] = useState(false);
  const [accountDeactivated, setAccountDeactivated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [emailerrorstate, setEmailErrorState] = useState("");
  const [passworderrorstate, setPasswordErrorState] = useState("");
  const navigate = useNavigate();
  const { connect } = useSocketContext();

  const request = (payload) => axiosInstance.post("/require/login", payload);

  const {
    data: isdata,
    mutate: ismutate,
    isPending: isLoading,
    error: iserror,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: request,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleSubmit = () => {
  //   const newErrors = {};
  //   if (!formData.email.trim()) newErrors.email = "Email is required.";
  //   if (!formData.password.trim()) newErrors.password = "Password is required.";

  //   setErrors(newErrors);
  //   if (Object.keys(newErrors).length > 0) return;
  //   const payload = { ...formData };
  //   ismutate(payload);
  //   setEmailErrorState("");
  //   setPasswordErrorState("");
  // };

  const handleSubmit = () => {
  const newErrors = {};

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.email.trim()) {
    newErrors.email = "Email is required.";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  const payload = { ...formData };
  ismutate(payload);

  setEmailErrorState("");
  setPasswordErrorState("");
};


  useEffect(() => {
    if (isdata || iserror) {
      if (isdata?.data?.message === "Success") {
        const token = isdata?.data?.data?.accessToken;
        const user = isdata?.data?.data?.user;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userDetails", JSON.stringify(user));

        try{
           connect({token, user})
        }catch(err){
          console.log(err);
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
        }).then(() => {
          if (isdata?.data?.data?.user?.role === "user") {
            navigate("/inbox");
          } else if (isdata?.data?.data?.user?.role === "admin") {
            navigate("/inbox");
          } else if (isdata?.data?.data?.user?.role === "employee") {
            navigate("/inbox");
          } else if (isdata?.data?.data?.user?.role === "super_admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        });
      }

      if (iserror?.response?.data?.message === "Invalid User") {
        setEmailErrorState("Invalid email");
      } else if (iserror?.response?.data?.message === "Invalid Password") {
        setPasswordErrorState("Invalid password");
      }
      // else if (iserror?.response?.data?.message === "Company Is Not Active"){
      //   setIsMembershipEnded(true);
      // }
      else if ( iserror?.response?.data?.message === "User Not Active" || iserror?.response?.data?.message === "Company Is Not Active"){
        setAccountDeactivated(true);
      }else if(iserror?.response?.data?.message === "User Not Approved"){
        Swal.fire({
    icon: "warning",
    title: "Account Pending Approval",
    text: "Your account has been created successfully but is not yet approved. Please wait for an administrator to review and activate your access.",
    showConfirmButton: true,
    confirmButtonText: "Got it",
    allowOutsideClick: false,
  });
      } else if(iserror?.response?.data?.message === "Internal Server Error"){
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
      }else{
        console.log("");
        
      }
    }
  }, [isdata, iserror]);

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
    
      {/* <EnvCheck /> */}
      {/* Login Card */}
      <div className="relative w-full max-w-lg">
        <div className="relative bg-white p-8 ">
          {/* Header */}
          <div className="text-center mb-2 ">
           
           {/* tab & mobile logo */}
            <div className="block lg:hidden">
            <img src={logo} alt="logo-image" className="w-10 " />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 ">Login</h1>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-2 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="username@Kyberra.com"
                />
              </div>
              {emailerrorstate && (
                <p className="text-xs text-red-500 mt-2">{emailerrorstate}</p>
              )}
              {errors.email && (
                <p className="text-xs text-red-500 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-2 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passworderrorstate && (
                <p className="text-xs text-red-500 mt-2">
                  {passworderrorstate}
                </p>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end text-sm">
              <Link
                to="/forgetpassword"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? <SmallSpinner /> : "Sign In"}
            </button>
          </div>



          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* {isMembershipEnded && <MembershipEndModal onClose={() => setIsMembershipEnded(false)} />} */}
        {accountDeactivated && <AccountDeactivatedModal onClose={() => setAccountDeactivated(false)} />}
    </div>
    </div>
    </div>
  );
};

export default Signin;
