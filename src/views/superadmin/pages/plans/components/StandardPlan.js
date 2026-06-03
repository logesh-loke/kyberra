import React from "react";

const StandardPlan = ({ onEdit, standardPlan }) => {
  return (
    <div className="relative rounded-lg shadow-sm p-6 border border-green-200 bg-white w-full">
      <div className="absolute -top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md bg-green-50 text-green-700 shadow-sm">
        Recommended
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Standard</h3>
          <div className="text-sm text-gray-500 mt-1">Business • {standardPlan?.duration || "Monthly"}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">₹{standardPlan?.price || "0"}</div>
          <div className="text-xs text-gray-500">{standardPlan?.user_limit || "0"} users</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        For growing businesses — analytics, integrations and phone support.
      </p>

 <ul className="mt-4 flex items-center flex-wrap gap-2 text-sm text-gray-600">
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Dashboard Access
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Advanced encrypted email sending
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    File upload limit: 8 MB
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Message size limit: 7,500 characters
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Support response within 24 hours
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Email history up to 30 days
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Basic analytics (open & delivery rates)
  </li>
</ul>


      <div className="mt-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onEdit?.(standardPlan)}
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandardPlan;
