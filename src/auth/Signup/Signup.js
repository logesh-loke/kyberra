import React, { useState } from "react";
import { Mail, User, Phone } from "lucide-react";
import image from "src/assets/images/bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "src/api/Api";
import SmallSpinner from "src/components/loaders/SmallSpinner";
import { COUNTRY_CODES } from "src/constant/countrycode.constant";
// import axiosInstance from "src/api/Api";
// import { useMutation } from "@tanstack/react-query";
// import { generateKeys } from "src/utils/generateKeys";
import background from 'src/assets/images/bg-new.png';
import bg from'src/assets/images/bgsign.jpeg'
import logo from 'src/assets/images/kyberraLogo.png';
// import logoWithName from 'src/assets/images/crypsyn-full-logo.png';

const Signup = () => {
  const navigate = useNavigate();

  // Form data (removed username, password, confirm)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gmail: "",
    countryCode: "+91",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const [showOtpModal, setShowOtpModal] = useState(false);
const [otp, setOtp] = useState("");


  const { mutate: gmailValidateMutate, isPending: isGmailValidateLoading } =
    useMutation({
      queryKey: ["otp"],
      mutationFn: (payload) => axiosInstance?.post("/auth/otp", payload),
      onSuccess: () => {
        toast.success("OTP sent to your gmail");
        setShowOtpModal(true);
      },
      onError: () => {
        toast.error("Failed to send OTP. Please try again.");
      },
    });


      const {
    data: verifyOtpData,
    mutate: verifyOtpMutate,
    isPending: isVerifyOtpLoading, 
  } = useMutation({
    queryKey: ["verify-otp"],
    mutationFn: (payload) => axiosInstance?.post("/auth/verify-otp", payload),
    onSuccess: () => {
      toast.success("OTP verified successfully");
      setShowOtpModal(false);
    },
    onError: (res) => {
      if (res) {
        console.log(res);

        toast.error(res?.response?.data?.message);
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    },
  });

//   const signuppost = (payload) => axiosInstance.post("/auth/signup", payload);

//  const { data: signupData, mutate: signupMutate, isLoading: signupLoading } = useMutation({
//   mutationKey: ["signup"],
//   mutationFn: signuppost,
//  })

  // Handle input change
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

  // Handle form submit
  const handleSubmit = async () => {
    let newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.gmail.trim()) newErrors.gmail = "Gmail address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail))
      newErrors.gmail = "Enter a valid Gmail address.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";

    setErrors(newErrors);

            //  Block submit if Gmail not verified
if (!isOtpVerified) {
  toast.error("Please verify your Gmail before creating employee account");
  setErrors((prev) => ({
    ...prev,
    gmail: "Please validate and verify your Gmail first.",
  }));
  return;
}

    if (Object.keys(newErrors).length > 0) return;

    const finalData = {
      f_name: formData.firstName,
      l_name: formData.lastName,
      gmail: formData.gmail,
      country_code: formData.countryCode,
      phone_number: formData.phone,
    };
    localStorage.setItem("signupData", JSON.stringify(finalData));

    // signupMutate(finalData)
    // console.log(finalData);
    // const { publicKeyJwk, privateKeyBase64 } = await generateKeys();
    // console.table("publickeys", publicKeyJwk);
    // console.log('privatekeys',privateKeyBase64);
    navigate("/passwordandconfirmpassword");
  };

  const handleValidateGmail = () => {
  if (!formData.gmail) {
    setErrors((prev) => ({
      ...prev,
      gmail: "Gmail address is required.",
    }));
    return;
  }

  // only @gmail.com allowed
  const gmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

  if (!gmailRegex.test(formData.gmail)) {
    setErrors((prev) => ({
      ...prev,
      gmail: "Only @gmail.com email addresses are allowed.",
    }));
    return;
  }

  gmailValidateMutate({ gmail: formData.gmail });
};

const handleVerifyOtp = () => {
  if (!otp) return;
  verifyOtpMutate({
    gmail: formData.gmail,
    otp: otp,
  });
  // setShowOtpModal(false);
};

const handleResendOtp = () => {
  setOtp("");
  gmailValidateMutate({ gmail: formData.gmail });
  // console.log("Resend OTP for Gmail:", formData.gmail);
};

  const isOtpVerified = verifyOtpData?.data?.message === "Success";


  return (
  
  <div className="min-h-screen bg-[#F6F0FF] flex px-1 md:px-4 items-center justify-center lg:px-6 overflow-hidden">
  <div  className="w-full max-w-5xl lg:h-[570px]  bg-white overflow-hidden rounded-2xl shadow-2xl lg:grid lg:grid-cols-2" >

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
      {/* <div className="flex flex-col justify-center h-full absolute left-4 ">
<h1 className="font-bold text-xl lg:text-3xl balance leading-tight mb-6 ">
  Communicate confidently with a platform designed to protect sensitive information and business-critical conversations.
</h1>

<div className="mt-4">
  <p className="font-semibold text-lg mb-3">Features</p>
  <ul className="space-y-2 text-sm lg:text-base">
    <li>✓ Military-Grade Encryption</li>
    <li>✓ Secure Document Exchange</li>
    <li>✓ Advanced Access Control</li>
    <li>✓ Activity Monitoring & Audit Logs</li>
    <li>✓ 99.99% Service Availability</li>
    <li className="mt-2">Trusted by organizations worldwide.</li>
  </ul>
</div>
</div> */}
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
          <div className="block lg:hidden flex justify-center absolute top-5 md:top-1 items-center mb-6">
            <img src={logo} alt="logo-image" className="w-28" />
          </div>

      <div className="relative w-full  flex justify-center">
        

        <div className="relative bg-white p-4 sm:p-8 w-full max-w-md">

       
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Create account
            </h1>
            <p className="text-sm text-gray-500">
              Join Kyberra — secure and private
            </p>
          </div>

          {/* Form */}
          <div className="lg:space-y-4 sm:space-y-2 ">
            {/* First + Last Name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full pl-11 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-2">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Gmail */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gmail <span className="text-xs text-gray-500">(google mail)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="gmail"
                  disabled={isOtpVerified}
                  value={formData.gmail}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`${isOtpVerified ? "cursor-not-allowed opacity-50" : ""} w-full pl-11 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all`}
                />
              </div>
              {errors.gmail && (
                <p className="text-xs text-red-500 mt-2">{errors.gmail}</p>
              )}
            </div>

{/* validate button */}
            <button
  type="button"
  disabled={isOtpVerified}
  onClick={handleValidateGmail}
  className={`${isOtpVerified ? "bg-green-500 cursor-not-allowed opacity-50" : "bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c]"} mt-2 rounded-lg  text-white px-4 py-2 text-sm font-medium  transition`}
>
  {isOtpVerified ? "Verified" :  isGmailValidateLoading ? <SmallSpinner /> : "Validate Gmail"}
</button>


            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative flex">
                {/* Country code dropdown */}
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-2 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                  {COUNTRY_CODES.map((code, index) => (
                    <option key={index} value={code.code}>{code.code} {code.short}</option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4  text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full pl-11 pr-3 py-2 bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-2">{errors.phone}</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSubmit}
              className="flex justify-center items-center gap-4 w-full bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3  rounded-lg hover:bg-[#1f1538] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Create Email Account</span>
              <FaArrowRightLong size={20} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
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


      {/* otp validate modal */}

      {showOtpModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl w-full max-w-sm p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Verify Email
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter the OTP sent to <b>{formData.gmail}</b>
      </p>

      <input
        type="text"
        value={otp}
        maxLength={6}
        inputMode="numeric"
        autoComplete="off"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setOtp(value);
        }}
        placeholder="Enter OTP"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleResendOtp}
          className="text-sm text-indigo-600 hover:underline"
        >
          {isGmailValidateLoading ? "Resending..." : "Resend OTP"}
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
            className="px-4 py-2 text-sm rounded-lg bg-[#AF7BFD] text-white hover:bg-[#8A3FFA]"
          >
            {isVerifyOtpLoading ? <SmallSpinner /> : "Verify"}
          </button>
          
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
    </div>
  );
};

export default Signup;
