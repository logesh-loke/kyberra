import React from "react";

const PremiumProPlan = ({ onEdit, premiumProPlan }) => {
  return (
    <div className="relative rounded-lg shadow-sm p-6 border border-purple-300 bg-white w-full">
      <div className="absolute -top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md bg-purple-50 text-purple-700 shadow-sm">
        Most Popular
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Premium Pro</h3>
          <div className="text-sm text-gray-500 mt-1">Enterprise • {premiumProPlan?.duration || "Monthly"}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">₹{premiumProPlan?.price || "0"}</div>
          <div className="text-xs text-gray-500">{premiumProPlan?.user_limit || "0"} users</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Advanced features, priority SSO support, custom integrations and premium
        SLA for large enterprise teams.
      </p>

      <ul className="mt-4 flex items-center flex-wrap gap-2 text-sm text-gray-600">
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Military-grade encrypted email sending
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          File upload limit: 25 MB
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Message size limit: 20,000 characters
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Priority support response within 2 hours
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Unlimited email history retention
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Unlimited device login
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Deep analytics (user behavior & performance)
        </li>
        <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
          Full custom branding & white-label options
        </li>
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onEdit?.(premiumProPlan)}
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumProPlan;
