import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { FiUser, FiSettings, FiHelpCircle } from "react-icons/fi";
// import { useClickContext } from "src/context/ClickContext";
import { useSocketContext } from "src/context/SocketContext";
import { FaUsersGear } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "src/api/Api";

const ProfileCard = ({ onClose }) => {
  const navigate = useNavigate();
  //  const { setIsOpen } = useClickContext();
  const { disconnect } = useSocketContext();



  const userdetails = localStorage.getItem("userDetails");
  const userdata = userdetails ? JSON.parse(userdetails) : {};
  const email = userdata?.email || "";
  const fName = userdata?.first_name || "No";
  const lName = userdata?.last_name || "Name";
  const role = userdata?.role || "";
//   const userId = userdata?.id || "";

//  const clearLocalStorage = () => {
//        localStorage.removeItem("authToken");
//       localStorage.removeItem("userDetails");
//       localStorage.removeItem("onboarding-step");
//       localStorage.removeItem("membershipRemindDate")
//       localStorage.removeItem("passkeyTour")
//   }
//     const { mutate: mutateLogout } = useMutation({
//     mutationKey: ["logout"],
//     mutationFn: () => axiosInstance.post(`/auth/logout/${userId}`),
//     onSuccess: () => {
// clearLocalStorage(); 
//     navigate("/");

//  },
//  onError: () => {
//     clearLocalStorage();
//         navigate("/");

//   },
//   })

  const cardRef = useRef(null);

  // Outside Click Close
  useEffect(() => {
    const handleOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = () => {
    // mutateLogout();
    localStorage.clear();

    disconnect();
    navigate("/");
  };

 

  return (
    <div
      ref={cardRef}
      className="absolute top-14 right-0 w-60 bg-white shadow-xl border border-gray-100 rounded-lg p-3 z-50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="border rounded-md  bg-[#F6F0FF] text-[#260c41] font-semibold py-1 px-2.5 text-sm ">
          {email ? email?.charAt(0)?.toUpperCase() : "U"}
        </span>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-800">
            {/* {email ? email.split("@")[0] : "Unknown User"} */}
            {fName && lName ? ` ${fName} ${lName}` : ""}
          </p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      <hr className="border-gray-100 mb-2" />

      {/* Menu List */}
      <ul className="space-y-1">
        {/* PROFILE */}
        <li>
          <NavLink
           id="profile-menu-profile"
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
            }
          >
            <FiUser size={18} className="transition-colors" />
            <span className="text-sm">Profile</span>
          </NavLink>
        </li>

        {/* MANAGE TEAM */}
        {role === "admin" && (
          <>
            <li>
              <NavLink
                to="/manage-team"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
                }
              >
                <FaUsersGear size={18} className="transition-colors" />
                {/* <CgUserAdd size={21} className="transition-colors" /> */}
                <span className="text-sm">Team Hub</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/membership-plan-history"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
                }
              >
                <MdPayment size={18} className="transition-colors" />
                <span className="text-sm">Membership plan</span>
              </NavLink>
            </li>

               <li>
              <NavLink
                to="/notifications"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
                }
              >
                <IoNotificationsOutline size={18} className="transition-colors" />
                <span className="text-sm">Notifications</span>
              </NavLink>
            </li>
          </>
        )}

        {/* SETTINGS */}
        <li>
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
            }
          >
            <FiSettings size={18} className="transition-colors" />
            <span className="text-sm">Settings</span>
          </NavLink>
        </li>

        {/* HELP */}
        <li>
          <NavLink
            to="/help"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 w-full px-2 py-2 rounded-md transition-all
               ${
                 isActive
                   ? "bg-indigo-50 text-indigo-600 font-semibold"
                   : "hover:bg-gray-100 text-gray-700"
               }`
            }
          >
            <FiHelpCircle size={18} className="transition-colors" />
            <span className="text-sm">Help Center</span>
          </NavLink>
        </li>
      </ul>

      <hr className="border-gray-100 my-2" />

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-2 py-1.5  rounded-md hover:bg-gray-100 text-gray-700 transition"
      >
        <LuLogOut size={17} className="transition-colors" />
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;