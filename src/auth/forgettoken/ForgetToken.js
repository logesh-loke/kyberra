import React, { useEffect, useState } from 'react';
import {  Mail } from 'lucide-react';
import image from 'src/assets/images/bg.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from 'src/api/Api';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import SmallSpinner from 'src/components/loaders/SmallSpinner';
import background from 'src/assets/images/bg-new.png';
import logoWithName from 'src/assets/images/crypsyn-full-logo.png';
import bg from'src/assets/images/bgsign.jpeg'
import logo from'src/assets/images/kyberraLogo.png'

const ForgetToken = () => {

  // single state for form fields
  const [formData, setFormData] = useState({
    email: '',
  });
 
   const navigate = useNavigate();
  const [errors, setErrors] = useState({});

   const request = (payload) =>{
   return axiosInstance.get('/auth/emailverify', { params: payload });
   }
    const { data: isresponse, mutate: postmutate, isPending: isLoading, error: posterror } = useMutation({
      mutationKey: ["emailverify"],
      mutationFn: request,
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
    };
    postmutate(payload);

    // console.log('Full Data:', payload);
    // TODO: call your API for sending/resetting token
  };


   useEffect(() => {

    if(isresponse || posterror){

      if(isresponse?.data?.message === 'Token Send To Admin'){
        Swal.fire({
          icon: 'success',
          title: 'Request Send your To Admin',
          text: `Please contact admin ${isresponse?.data?.data?.[0]?.admin_name} to verify your email address. Your request has been forwarded, and the admin will share the verification token with you.`,
          allowOutsideClick: false,
          confirmButtonText: 'Got it',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/forgetpassword')
          }
        })
    }else if(isresponse?.data?.message === 'Token Sent To Gmail'){
      Swal.fire({
        icon: 'success',
        title: 'Token Send To Gmail',
        text: `A verification token has been sent to your registered Gmail. ${isresponse?.data?.data?.[0]?.userMailId} Please check your inbox.`,
        allowOutsideClick: false,
        confirmButtonText: 'Got it',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/forgetpassword')
        }
      })
    }

    if(posterror?.response?.data?.message === 'Invalid Email'){
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please check your email address.',
        allowOutsideClick: false,
        confirmButtonText: 'Got it',
      })
    } else if(posterror?.response?.data?.message === 'Mail Sending Failed'){
      Swal.fire({
        icon: 'error',
        title: 'Mail Sending Failed',
        text: 'We were unable to send the email. Please verify that your registered Gmail address is correct.',
        allowOutsideClick: false,
        confirmButtonText: 'Got it',
      })
    }else if(posterror?.response?.data?.message === 'Internal Server Error'){
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

      {/* Card */}
      <div className="relative w-full max-w-lg">
        <div className="relative bg-white p-8 ">
          {/* Header */}
          <div className="text-center mb-4">

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Token Recovery</h3>
            <p className="text-sm text-gray-500">Enter your email to proceed</p>
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


  

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full ${isLoading ? 'cursor-not-allowed opacity-50' : ''} bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {isLoading ? <SmallSpinner /> : 'Send'}
            </button>

            {/* Optional: link back */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Remembered your token?{' '}
              <Link to="/forgetpassword" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                ForgetPassword
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

export default ForgetToken;
