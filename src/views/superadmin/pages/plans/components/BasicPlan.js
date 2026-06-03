import React from "react";

const BasicPlan = ({ onEdit, basicPlan }) => {
  return (
    <div className="relative rounded-lg shadow-sm p-6 border border-indigo-200 bg-white w-full">
      <div className="absolute -top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 shadow-sm">
        Popular
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{basicPlan?.plan_name || "Basic"}</h3>
          <div className="text-sm text-gray-500 mt-1">Team • {basicPlan?.duration || "Monthly"}</div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">₹{basicPlan?.price || "0"}</div>
          <div className="text-xs text-gray-500">{basicPlan?.user_limit || "0"} users</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Small teams get access to core features and email support.
      </p>

 <ul className="mt-4 flex items-center flex-wrap gap-2 text-sm text-gray-600">
   <li className="bg-[#A14FFC26] text-[#AF7BFD] px-3 py-1 py-1 rounded-full">
    Dashboard Access
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD] px-3 py-1 py-1 rounded-full">
    Standard encrypted email sending
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD] px-3 py-1 py-1 rounded-full">
    File upload limit: 5 MB
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Message size limit: 5,000 characters
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Support response within 48 hours
  </li>
  <li className="bg-[#A14FFC26] text-[#AF7BFD]  px-3 py-1 rounded-full">
    Email history up to 30 days
  </li>

  {/* <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">
    Multi-device login (2 devices)
  </li> */}
</ul>



      <div className="mt-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onEdit?.(basicPlan)}
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicPlan;
