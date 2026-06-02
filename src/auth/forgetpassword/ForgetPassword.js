import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import image from 'src/assets/images/bg.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from 'src/api/Api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import SmallSpinner from 'src/components/loaders/SmallSpinner';
import background from 'src/assets/images/bg-new.png';
import logoWithName from 'src/assets/images/crypsyn-full-logo.png';
import bg from'src/assets/images/bgsign.jpeg'
import logo from'src/assets/images/kyberraLogo.png'

const ForgetPassword = () => {
  const [showToken, setShowToken] = useState(false);
   const navigate = useNavigate();
  // single state for form fields
  const [formData, setFormData] = useState({
    email: '',
    token: '',
  });

  const [errors, setErrors] = useState({});

   const fetchverify = (payload) => axiosInstance.get('/auth/verification', { params: payload });

    const { data: isresponse, mutate: ispostmutate, isPending: isLoading, error: isverifyerror } = useMutation({
      mutationKey: ["verify"],
      mutationFn: fetchverify,
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field-specific error while typing
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.token.trim()) newErrors.token = 'Token is required.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
    };
    ispostmutate(payload);

    // console.log('Full Data:', payload?.email);
  };

 useEffect(() => {
  if (isverifyerror || isresponse) {
    if (isverifyerror) {
      const errormessage =
        isverifyerror.response?.data?.message || "Something went wrong";
      const errorMessages = {
        "User Not Found": "User not found. Please enter your Kyberra mail.",
        "User Not Approved": "User not approved",
        "Enter Valid Email": "Please enter a valid email",
        "Enter Valid Token": "Please enter a valid token",
        "Internal Server Error": "Internal server error. Please try again later.",
      };
      const messageToShow =
        errorMessages[errormessage] || "Something went wrong. Please try again.";
      Swal.fire({
        title: "Token Verification Error",
        text: messageToShow,
        icon: "error",
        confirmButtonText: "Got it",
      });
    }

    if (isresponse?.data?.message === "Success") {
      toast.success("Token Verified Successfully");
      localStorage.setItem("email", JSON.stringify(formData.email));
      setTimeout(() => {
        navigate("/newpasswordandconfirmpassword");
      }, 1000);
    }
  }
}, [isresponse, isverifyerror, navigate]);


  return (
     <div className="min-h-screen bg-[#F6F0FF] flex items-center justify-center lg:px-6 overflow-hidden">
  <div  className="w-full max-w-5xl h-[570px] bg-white overflow-hidden rounded-2xl shadow-2xl lg:grid lg:grid-cols-2" >

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
          <div className="block lg:hidden flex justify-center absolute top-5 items-center mb-6">
            <img src={logo} alt="logo-image" className="w-28" />
          </div>
      {/* Card */}
      <div className="relative w-full max-w-lg">
        <div className="relative bg-whitep-8 ">
          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Token</h1>
            <p className="text-sm text-gray-500">Enter your email & token to proceed</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="username@kyberra.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
            </div>

            {/* Token */}
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
                Token
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showToken ? 'text' : 'password'}
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-2 bg-gray-50 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all ${
                    errors.token ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your token"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.token && <p className="text-xs text-red-500 mt-2">{errors.token}</p>}
            </div>

            {/* Forgot token (example action) */}
            <div className="flex justify-end text-sm">
              <Link to="/forgettoken" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Forgot token?
              </Link>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full ${isLoading  ? 'cursor-not-allowed opacity-90' :  ''} bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? <SmallSpinner /> : 'Verify'}
            </button>

            {/* Optional: link back */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Remembered your password?{' '}
              <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default ForgetPassword;
