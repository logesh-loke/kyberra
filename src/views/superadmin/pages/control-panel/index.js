// src/pages/ControlPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiBell,
  FiDatabase,
  FiActivity,
  FiUserCheck, 
  FiBriefcase
} from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";


const cards = [
{
  id: "company-setup",
  title: "Company & Admin Setup",
 description:"Company profile, domain configuration, and admin credentials setup",
  icon: FiUser,
  route: "/control-panel/create-company",
},
 {
  id: "subscription",
  title: "Subscription Management",
  description: "Configure plans and account entitlements",
  icon: FiCreditCard,
  route: "/control-panel/plans",
},
{
  id: "directory",
  title: "Organization Directory",
  description: "Administer companies, roles, and user lifecycle management",
  icon: FiDatabase,
  route: "/control-panel/user-management",
},
{
  id: "approvals",
  title: "User Verification",
  description: "Approve or decline new user accounts",
  icon: FiUserCheck,
  route: "/control-panel/user-verification",
},
{
  id: "organization-management",
  title: "Organization Management",
  description: "Administer organizational accounts and subscription lifecycle management",
  icon: FiBriefcase,
  route: "/control-panel/organization-management",
},
  {
    id: "Logs",
    title: "Logs",
    description: "View and manage logs",
    icon: FiActivity,
    route: "/control-panel/logs",
  },
  {
    id: "empty-slot",
    title: "Empty Slot",
    description: "Quota, cleanup, backup & restore",
    icon: FiDatabase,
    route: "/control-panel/storage",
  },
  {
    id: "empty-slot",
    title: "Empty Slot",
    description: "Theme, density, layout, accessibility",
    icon: FiSettings,
    route: "/control-panel/empty-slot",
  },
  {
    id: "empty-slot",
    title: "Empty Slot",
    description: "Access history, exports, admin actions",
    icon: FiActivity,
    route: "/control-panel/empty-slot",
  },
];

const ControlPanel = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    if (!route) return;
    navigate(route);
  };

  return (
    <div className=" bg-white flex flex-col">
      {/* Grid of setting cards */}
      <div className="flex-1 px-6 md:px-8 py-6">
        <div
          className="
            grid gap-4 md:gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
          {cards.map(({ id, title, description, icon: Icon, route }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleCardClick(route)}
              className="
                group
                flex items-start gap-4
                bg-white
                border border-[#bc91fd]
                rounded-xl
                px-4 py-4
                text-left
                shadow-sm
                transition
                hover:shadow-md
                hover:border-[#AF7BFD]
                hover:bg-[#A14FFC26]
                focus:outline-none
                focus:ring-2 focus:ring-[#d1b4fe]
              "
            >
              <div
                className="
                  flex-shrink-0 mt-1
                  w-10 h-10
                  rounded-full
                  border border-gray-200 
                  flex items-center justify-center
                  bg-[#dfdee1]
                  group-hover:bg-[#f5efff]
                "
              >
                <Icon className="w-5 h-5 text-[#AF7BFD]" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 mb-1">
                  {title}
                </span>
                <span className="text-xs text-gray-500 leading-snug">
                  {description}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
