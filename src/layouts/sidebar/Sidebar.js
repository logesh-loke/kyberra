import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FiInbox,
  FiFileText,
  FiSend,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";

import { LuPencil, LuLayoutDashboard } from "react-icons/lu";
import { BsArchive } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { useClickContext } from "src/context/ClickContext";
// import useNotify from "src/hooks/useNotify";
import { useNotify } from "src/context/NotifyContext";
import { PiGameControllerDuotone } from "react-icons/pi";
import { FaUsersGear } from "react-icons/fa6";
// import logoWithName from "src/assets/images/crypsyn-full-logo.png";
import { MdEdit } from "react-icons/md";
// import logo from "src/assets/images/crypsyn-logo.png"
import logo from "src/assets/images/kyberraLogo.png";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const userdetails = localStorage.getItem("userDetails");
  const userdata = userdetails ? JSON.parse(userdetails) : {};
  const role = userdata?.role;

  const { setNotify } = useNotify();

  const { open } = useClickContext();

  const toggle = () => {
    setCollapsed((s) => !s);
    setNotify(collapsed ? "expanded" : "collapsed");
  };

  return (
    <aside
      className={`bg-[#F6F0FF] text-gray-800 h-screen flex flex-col border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="pl-2 py-[8px] flex items-center justify-between border-b">
        <div className="flex items-center ">
          {!collapsed && (
            <img src={logo} alt="logo" className="w-full h-[28px] my-[2px]" />
          )}
          {collapsed && <img src={logo} alt="logo" className="w-full " />}

          {/* <div
            className={`flex items-center justify-center rounded-md ${
              collapsed ? "w-8 h-8" : "w-8 h-8"
            } bg-gradient-to-tr from-indigo-500 to-indigo-400`}
          >
            <div className="font-bold text-white select-none">
              <FiInbox />
            </div>
          </div> */}

          {/* {!collapsed && <div className="text-lg font-semibold">Mailbox</div>} */}
        </div>

        <button
          onClick={toggle}
          className="p-1 rounded hover:bg-gray-100 transition text-gray-600"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* New Message Button */}
      <div
        className={`px-3 mt-3 ${
          collapsed ? "flex items-center justify-center" : ""
        }`}
      >
        <button
          onClick={open}
          className={`w-44 ${collapsed ? "p-2" : "py-3"} 
  bg-gradient-to-r 
  from-[#260c41] 
  via-[#3f146c] 
  to-[#561993]
  text-white rounded-2xl flex items-center justify-center gap-2
  hover:from-[#0d0416]
  hover:via-[#260c41]
  hover:to-[#561993]
  hover:scale-105 active:scale-95
  transition-all duration-300`}
        >
          {!collapsed && (
            <div className="flex justify-center items-center">
              <MdEdit />
              <span className="text-sm font-medium px-2">Compose</span>
            </div>
          )}
          {collapsed && (
            <div className="text-xl">
              <LuPencil size={16} />
            </div>
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 px-1 flex-1 overflow-auto">
        <ul className="space-y-1">
          {/* Dashboard – Only for admin & superadmin */}
          {role === "super_admin" && (
            <li>
              <NavLink
                to={
                  role === "admin"
                    ? "/admin-dashboard"
                    : role === "super_admin"
                      ? "/dashboard"
                      : "/dashboard"
                }
                // to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-[#d5b9ff] text-[#631fa9] font-medium"
                      : "hover:bg-[#f1e8ff]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-lg transition-colors duration-200 ${
                        isActive ? "text-[#8A3FFA]" : "text-gray-600"
                      }`}
                    >
                      <LuLayoutDashboard />
                    </span>
                    {!collapsed && <span>Dashboard</span>}
                  </>
                )}

                {/* <span className="text-lg text-gray-600">
                  <LuLayoutDashboard />
                </span>
                {!collapsed && <span>Dashboard</span>} */}
              </NavLink>
            </li>
          )}

          {/* Team hub */}
          {role === "admin" && (
            <li>
              <NavLink
                to="/manage-team"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
              ${collapsed ? "justify-center" : ""}
              ${
                isActive
                  ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                  : "hover:bg-[#f1e8ff]"
              }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-lg transition-colors duration-200 ${
                        isActive ? "text-[#8A3FFA]" : "text-gray-600"
                      }`}
                    >
                      <FaUsersGear size={18} className="transition-colors" />
                    </span>
                    {!collapsed && <span>Team Hub</span>}
                  </>
                )}
              </NavLink>
            </li>
          )}

          {/* Control Panel */}
          {role === "super_admin" && (
            <li>
              <NavLink
                to="/control-panel"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
              ${collapsed ? "justify-center" : ""}
              ${
                isActive
                  ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                  : "hover:bg-[#f1e8ff]"
              }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`text-lg transition-colors duration-200 ${
                        isActive ? "text-[#8A3FFA]" : "text-gray-600"
                      }`}
                    >
                      <PiGameControllerDuotone />
                    </span>
                    {!collapsed && <span>Control panel</span>}
                  </>
                )}
              </NavLink>
            </li>
          )}

          {/* Inbox */}
          <li>
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <FiInbox />
                  </span>
                  {!collapsed && <span>Inbox</span>}
                </>
              )}
            </NavLink>
          </li>

          {/* Drafts */}
          <li>
            <NavLink
              to="/drafts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <FiFileText />
                  </span>
                  {!collapsed && <span>Drafts</span>}
                </>
              )}
            </NavLink>
          </li>

          {/* Sent */}
          <li>
            <NavLink
              to="/sent"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium" 
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <FiSend />
                  </span>
                  {!collapsed && <span>Sent</span>}
                </>
              )}
            </NavLink>
          </li>

          {/* Starred */}
          <li>
            <NavLink
              to="/starred"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <FiStar />
                  </span>
                  {!collapsed && <span>Starred</span>}
                </>
              )}
            </NavLink>
          </li>

          {/* Archive */}
          <li>
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <BsArchive />
                  </span>
                  {!collapsed && <span>Archive</span>}
                </>
              )}
            </NavLink>
          </li>

          {/* Trash */}
          <li>
            <NavLink
              to="/trash"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
                    : "hover:bg-[#f1e8ff]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-lg transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-600"
                    }`}
                  >
                    <FaRegTrashCan />
                  </span>
                  {!collapsed && <span>Trash</span>}
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer Storage */}
      <div className="p-3 text-xs text-gray-500 border-t">
        <li className="list-none">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
       ${
         isActive
           ? "bg-[#d5b9ff] text-[#8A3FFA] font-medium"
           : "hover:bg-[#f1e8ff]"
       }`
            }
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 ${
                  collapsed ? "justify-center" : "justify-start"
                }`}
              >
                <span
                  className={`text-lg transition-colors duration-200 ${
                    isActive ? "text-[#8A3FFA]" : "text-gray-600"
                  }`}
                >
                  <FiSettings />
                </span>

                {!collapsed && (
                  <span
                    className={`text-sm text-nowrap transition-colors duration-200 ${
                      isActive ? "text-[#8A3FFA]" : "text-gray-700"
                    }`}
                  >
                    Settings
                  </span>
                )}
              </div>
            )}
          </NavLink>
        </li>
        {/* <li className=" list-none">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex  gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                ${collapsed ? "" : ""}
                ${
                  isActive
                    ? "bg-[#d5e1f1] text-[#2d5b9c] font-medium"
                    : "hover:bg-[#eaf0f8]"
                }`
            }
          >
            <div
              className={`flex items-center gap-3 ${
                collapsed ? "justify-center" : "justify-start"
              }`}
            >
              <span className="text-lg text-gray-600">
                <FiSettings />
              </span>
              {!collapsed && (
                <span className="text-sm text-gray-700 text-nowrap">
                  Settings
                </span>
              )}
            </div>
          </NavLink>
        </li> */}

        {/* {!collapsed && <div>© Mailbox</div>} */}
      </div>
    </aside>
  );
}
