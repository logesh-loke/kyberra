import React from "react";

const PremiumPlan = ({ onEdit, premiumPlan }) => {
  return (
    <div className="relative rounded-lg shadow-sm p-6 border border-yellow-300 bg-white w-full">
      <div className="absolute -top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 shadow-sm">
        Best value
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
          <div className="text-sm text-gray-500 mt-1">Enterprise • {premiumPlan?.duration || "Monthly"}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">₹{premiumPlan?.price || "0"}</div>
          <div className="text-xs text-gray-500">{premiumPlan?.user_limit || "0"} users</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Full feature set, SSO, dedicated support and advanced SLA for
        enterprises.
      </p>

    <ul className="mt-4 flex items-center flex-wrap gap-2 text-sm text-gray-600">
       <li className="bg-[#A14FFC26] text-[#AF7BFD] px-3 py-1 rounded-full">
    Dashboard Access & activity reports
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    End-to-end encrypted email sending
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    File upload limit: 10 MB
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Message size limit: 10,000 characters
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Priority support response within 12 hours
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Email history up to 30 year
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Advanced analytics & engagement insights
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Custom branding support
  </li>
</ul>


      <div className="mt-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onEdit?.(premiumPlan)}
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlan;
