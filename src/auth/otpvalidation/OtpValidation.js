import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logoWithName from 'src/assets/images/crypsyn-full-logo.png';
import bg from'src/assets/images/bgsign.jpeg'
import logo from'src/assets/images/kyberraLogo.png'
const OtpVerification = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [countdown, setCountdown] = useState(60); // Initialize countdown state
    const [otpError, setOtpError] = useState("");
    const [sendtrack, setSendtrack] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    

    useEffect(() => {
        // Start the countdown when OTP is requested
        if (countdown === 0) return;
        const timer = setInterval(() => {
            setCountdown(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1 : 0));
        }, 1000);
        
        return () => clearInterval(timer); // Clear interval on cleanup
    }, [countdown]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) {
            return;
        }
        setOtpError("");
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Focus on the next input if the current input is filled
        if (value !== "" && index < otp.length - 1) {
            document.getElementById(`otp-input${index + 2}`).focus();
        }
    };

    // Handle form submission (OTP verification logic can go here)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const otpString = otp.join(""); 
        
    
        const payload = {
            email: email,
            otp: otpString
        };

        setSendtrack(true)
     
    };

 

    // Handle keydown event (move focus back on Backspace if the current input is empty)
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                document.getElementById(`otp-input${index}`).focus(); // Focus on previous input
            }
        }
    };

    // Resend OTP function (if the timer expires)
    const handleResendOtp = async () => {
        setOtp(["", "", "", ""]);
        setCountdown(60); // Reset countdown to 60 seconds
        Swal.fire({
            title: 'OTP Resent!',
            text: 'A new OTP has been sent to your email.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000, // Automatically close the alert after 1 second
        });

      
        
    };

    return (
       <div
        className="min-h-screen  bg-[#F6F0FF] flex items-center justify-center lg:px-6 overflow-hidden">
  <div  className="w-full max-w-5xl h-[570px]  bg-white overflow-hidden rounded-2xl shadow-2xl lg:grid lg:grid-cols-2" >

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
      className="min-h-[570px] flex items-center otp-verification-container justify-center p-4 relative rounded-2xl bg-[#ffff]"
    >
          {/* tab & mobile logo */}
          <div className="block lg:hidden flex justify-center absolute top-8 sm:top-9 md:top-11 items-center mb-6">
            <img src={logo} alt="logo-image" className="w-28" />
          </div>
        
        <div className="relative w-full max-w-lg">
        <div className="relative bg-white p-8 ">
          {/* Header */}
          <div className="text-center mb-2 ">
           
            
            <h1 className="text-3xl font-bold text-gray-800 ">Enter Otp</h1>
          </div>

                <form className="bg-white " onSubmit={handleSubmit}>
                    <div className="space-y-5">
               
                <p className="otpSubheading">We have sent you a one-time password (OTP) on this email</p>
                <div className="w-full flex flex-row gap-[10px] items-center justify-center">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            required
                            maxLength="1"
                            type="text"
                             className="w-[30px] h-[30px] text-center rounded-md border-none outline-none font-semibold bg-[#F8FAFC] text-zinc-800 caret-[#AF7BFD]"
                            id={`otp-input${index + 1}`} // Unique ID for each input
                            value={digit} // Controlled input (its value is stored in state)
                            onChange={(e) => handleChange(e, index)} // Update state when user types
                            onKeyDown={(e) => handleKeyDown(e, index)} // Handle Backspace to focus previous input
                            autoFocus={index === 0} // Automatically focus on the first input field
                            pattern="[0-9]*" // Enforces numeric pattern on mobile devices
                        />
                    ))}
                </div>
                {otpError && <p className="error-message text-red-500 text-[12px]">{otpError}</p>}
                         <p className="text-[12px] text-slate-500">
                    Expired in: {countdown < 10 ? `00:0${countdown}` : `00:${countdown}`}
                </p>
                <button

                    className="min-w-full bg-gradient-to-r from-[#230A3C] to-[#5F1BA2] hover:from-[#1f153c] hover:to-[#4a148c] text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    type="submit"
                    disabled={otp.some(digit => digit === "")} // Disable if any OTP field is empty
                >
                    Verify OTP
                </button>
                <p className="resendNote">
                    Didn't receive OTP? 
                    <button
                        className="resendBtn"
                        onClick={handleResendOtp}
                        disabled={countdown > 0} // Disable resend if countdown hasn't expired
                    >
                        Resend OTP
                    </button>
                </p>
                </div>
            </form>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default OtpVerification;