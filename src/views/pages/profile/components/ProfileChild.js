// src/pages/ProfileChild.jsx
import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Edit3Icon } from "lucide-react";
import axiosInstance from "src/api/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SmallSpinner from "src/components/loaders/SmallSpinner";

const ProfileChild = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editGmail, setEditGmail] = useState(false);
  const [addGmailPopup, setAddGmailPopup] = useState(false);
  const [newGmail, setNewGmail] = useState("");
  const [isNewGmailOtpSent, setIsNewGmailOtpSent] = useState(false);
  const [newGmailOtp, setNewGmailOtp] = useState("");
  const [verifiedGmail, setVerifiedGmail] = useState("");
  const [otp, setOtp] = useState("");

  const queryClient = useQueryClient();

  // Form state
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gmail: "",
    // country_code: "",
    phone_number: "",
    email_address: "",
  });

  const user = localStorage.getItem("userDetails");
  const userDetails = user ? JSON.parse(user) : {};
  const userRole = userDetails?.role;
  const userId = userDetails?.id;

  const userDataRequest = () => axiosInstance.get("/require/userdata");
  const userDataUpdataRequest = (payload) =>
    axiosInstance.put("/require/userdata", payload);

  const {
    data: userData,
    isPending,
    isError,
  } = useQuery({
    queryFn: userDataRequest,
    queryKey: ["userData"],
  });

  const {
    data: updateUserData,
    mutate: updateUser,
    error: updateError,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: userDataUpdataRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  useEffect(() => {
    if (updateUserData || updateError) {
      if (updateUserData?.data?.message === "Success") {
        toast.success("Profile updated successfully");
      }

      if (updateError?.response?.data?.messsage) {
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
  }, [updateUserData, updateError]);


  const emailOtpRequest = (payload) => axiosInstance.post('/require/profile-otp', payload);

  const { mutate: emailOtp, isPending: emailOtpLoading } = useMutation({
    mutationFn: emailOtpRequest,
    mutationKey: ['email-otp'],
    onSuccess: () => {
      toast.success("OTP sent to your gmail");
          setEditGmail(true);

    },
  });

  const otpVerifyRequest = (payload) => axiosInstance.post('/require/verify-profile-otp', payload);

  const { mutate: otpVerify, isPending: otpVerifyLoading } = useMutation({
    mutationFn: otpVerifyRequest,
    mutationKey: ['previous-mail-verify-otp'],
    onSuccess: () => {
      toast.success("OTP verified successfully");
          setEditGmail(false);
  setOtp("");
          setAddGmailPopup(true)
    },
  });


    const newGmailAddRequest = (payload) => axiosInstance.post('/require/new-email-otp', payload);

  const { mutate: newGmailAdd, isPending: newGmailAddLoading } = useMutation({
    mutationFn: newGmailAddRequest,
    mutationKey: ['new-email-otp'],
    onSuccess: () => {
      toast.success("OTP sent to your gmail");
      setVerifiedGmail(newGmail);
      setAddGmailPopup(false);
      setIsNewGmailOtpSent(true);
                  // setNewGmail("");

    },
  });

    const newGmailAddOtpVerifyRequest = (payload) => axiosInstance.put('/require/new-email-otp', payload);

  const { mutate: newGmailAddOtpVerify, isPending: newGmailAddOtpVerifyLoading } = useMutation({
    mutationFn: newGmailAddOtpVerifyRequest,
    mutationKey: ['new-email-otp-verify'],
    onSuccess: () => {
      toast.success("New email verified successfully");
      setIsNewGmailOtpSent(false);
    },
  });


  // Extract API data safely
  const apiUser = userData?.data?.data || {};

  // Populate form when data loads
  useEffect(() => {
    if (apiUser) {
      setForm({
        first_name: apiUser.first_name || "",
        last_name: apiUser.last_name || "",
        gmail: apiUser.gmail || "",
        // country_code: apiUser.country_code || "",
        phone_number: apiUser.phone_number || "",
        email_address: apiUser.email_address || "",
      });
    }
  }, [apiUser]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = () => {
    const payload = {
      userId: userId,
      fname: form.first_name || "",
      lname: form.last_name || "",
      gmail: form.gmail || "",
      // country_code: form.country_code || "",
      phone_number: form.phone_number || "",
    };
    updateUser(payload);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset back to API values
    setForm({
      first_name: apiUser.first_name || "",
      last_name: apiUser.last_name || "",
      gmail: apiUser.gmail || "",
      // country_code: apiUser.country_code || "",
      phone_number: apiUser.phone_number || "",
      email_address: apiUser.email_address || "",
    });
    setIsEditing(false);
  };



  const handleEditGmail = () => {
    emailOtp();
  }

 const handleVerifyOtp = () => {
  if (!otp || otp.length < 4) {
    toast.error("Please enter valid OTP");
    return;
  }

  otpVerify({otp: otp});
  // TODO: call verify OTP API here
 
};

const handleAddNewGmail = () => {
  if (!newGmail || !newGmail.includes("@gmail.com")) {
    toast.error("Please enter a valid Gmail address");
    return;
  }
  newGmailAdd({gmail: newGmail});
}

 const handleNewGmailVerifyOtp = () => {
  if (!newGmailOtp || newGmailOtp.length < 4) {
    toast.error("Please enter valid OTP");
    return;
  }

  newGmailAddOtpVerify({gmail: verifiedGmail, otp: newGmailOtp});
 
};
  // Derived display values
  const firstName = form.first_name || "-";
  const lastName = form.last_name || "-";
  const email = form.gmail || form.email_address || "-";
  const phone = `${form.country_coder || ""} ${form.phone_number || ""}`.trim();
  const role =
    userRole === "super_admin"
      ? "Super Admin"
      : userRole === "admin"
      ? "Admin"
      : userRole === "user"
      ? "User"
      : userRole === "employee"
      ? "Employee"
      : "No role";

  if (isPending) {
return (
  <div className=" h-[calc(100vh-120px)] flex items-center justify-center text-slate-600 text-sm">
    Loading profile...
  </div>
);
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600 text-sm">
        Failed to load profile details.
      </div>
    );
  }

  

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-slate-900">Profile Settings</p>
        <p className="text-slate-600 mt-1">
          Manage your account information and security
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#E3E5FF] text-[#676CE7] flex items-center justify-center text-3xl font-bold">
            {(firstName[0] || "").toUpperCase()}
            {(lastName[0] || "").toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              {firstName} {lastName}
            </h2>

            <div className="flex items-center gap-2 text-slate-600 mt-2">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#E3E5FF] text-[#676CE7] rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              {role}
            </div>
          </div>
        </div>
      </div>

      {/* Account Details - Editable */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        {/* Title + Edit/Save/Cancel */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E3E5FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#676CE7]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Account Details
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-full border text-xs md:text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating}
                  className={`${isUpdating ? "cursor-not-allowed opacity-50" : ""} px-4 py-1.5 rounded-full bg-[#676CE7] text-white text-xs md:text-sm font-medium hover:bg-[#575ddc]"`}
                >
                    {isUpdating ? <SmallSpinner/> : "Save Changes"}
                  
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-full border border-slate-300 text-xs md:text-sm text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              FIRST NAME
            </p>
            {isEditing ? (
              <input
                type="text"
                value={form.first_name}
                onChange={handleChange("first_name")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm text-slate-900">{firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              LAST NAME
            </p>
            {isEditing ? (
              <input
                type="text"
                value={form.last_name}
                onChange={handleChange("last_name")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm text-slate-900">{lastName}</p>
            )}
          </div>

  

          {/* Phone */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              PHONE NUMBER
            </p>
            {isEditing ? (
              <div className="flex gap-2">
                {/* <input
                  type="text"
                  value={form.country_code}
                  onChange={handleChange("country_code")}
                  className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+91"
                /> */}
                <input
                  type="text"
                  value={form.phone_number}
                  onChange={handleChange("phone_number")}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="9894006582"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-900">{phone || "-"}</p>
            )}
          </div>

           {/* Role */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">ROLE</p>
            <p className="text-sm text-slate-900">{role}</p>
          </div>

          {/* Email Address (read-only) */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              LOGIN EMAIL (READ ONLY)
            </p>
            <input
              type="email"
              value={form.email_address}
              readOnly
              disabled
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
            />
          </div>

    
        </div> 
                {/* Gmail (user's contact email) */}
          <div className="mt-4 flex items-center justify-between">
            <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              CONTACT EMAIL
            </p>
              <p className="text-sm text-slate-900  border border-slate-200 bg-slate-50 rounded-lg px-3 py-2">{form.gmail || "-"}</p>
            </div>
            
            <button type="button" onClick={handleEditGmail} className="text-gray-700 flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 text-xs md:text-sm hover:bg-slate-50">
             {emailOtpLoading ? <SmallSpinner /> : <Edit3Icon size={17} /> }
              <span className="text-sm">Edit Gmail</span>
            </button>
          </div>
      </div>


{/* OTP POPUP */}
{editGmail && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-700 text-center">
        Verify Gmail OTP
      </h3>
      <p className="text-sm text-slate-500 text-center mt-1">
        Enter the OTP sent to your gmail
      </p>

      {/* OTP Input */}
   <input
  type="text"
  value={otp}
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={6}
  placeholder="x x x x x x"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
  }}
  className="mt-5 w-full border border-slate-300 rounded-lg px-4 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>


      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
        type="button"
          onClick={() => {
            setEditGmail(false);
            setOtp("");
          }}
          className="px-4 py-2 rounded-full text-sm border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
        type="button"
          onClick={handleVerifyOtp}
          className="px-5 py-2 rounded-full bg-[#676CE7] text-white text-sm font-medium hover:bg-[#575ddc]"
        >
          {otpVerifyLoading ? <SmallSpinner /> : "Verify OTP"}
        </button>
      </div>
    </div>
  </div>
)}

{/* add gmail popup */}

{ addGmailPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-700 text-center">
        Add New Gmail
      </h3>
      <p className="text-sm text-slate-500 text-center mt-1">
        Enter your New Gmail Address <span className="text-xs text-slate-500">(gmail only)</span>
      </p>

      {/* Gmail Input */}
      <input
        type="email"
        value={newGmail}
        onChange={(e) => setNewGmail(e.target.value)}
        className="mt-5 w-full border border-slate-300 rounded-lg px-4 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
        type="button"
          onClick={() => {
            setAddGmailPopup(false); setEditGmail(false);
            setNewGmail("");
          }}
          className="px-4 py-2 rounded-full text-sm border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
        type="button"
          onClick={handleAddNewGmail}
          className="px-5 py-2 rounded-full bg-[#676CE7] text-white text-sm font-medium hover:bg-[#575ddc]"
        >
          {newGmailAddLoading ? <SmallSpinner /> : "Add Gmail"}
        </button>
      </div>
    </div>
  </div>
)}

{/* new gmail otp verification */}

{isNewGmailOtpSent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative">

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-700 text-center">
        Verify Gmail OTP
      </h3>
      <p className="text-sm text-slate-500 text-center mt-1">
        Enter the OTP sent to your gmail
      </p>

      {/* OTP Input */}
   <input
  type="text"
  value={newGmailOtp}
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={6}
  placeholder="x x x x x x"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNewGmailOtp(value);
  }}
  className="mt-5 w-full border border-slate-300 rounded-lg px-4 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>


      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
        type="button"
          onClick={() => {
            setIsNewGmailOtpSent(false);
            setNewGmailOtp("");
          }}
          className="px-4 py-2 rounded-full text-sm border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
        type="button"
          onClick={handleNewGmailVerifyOtp}
          className="px-5 py-2 rounded-full bg-[#676CE7] text-white text-sm font-medium hover:bg-[#575ddc]"
        >
          {newGmailAddOtpVerifyLoading ? <SmallSpinner /> : "Verify OTP"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProfileChild;
