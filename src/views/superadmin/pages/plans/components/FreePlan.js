import React from "react";

const FreePlan = ({ freePlan, onEdit }) => {
  if (!freePlan) return null; // prevent crash until data loads

  return (
    <div className="relative rounded-lg shadow-sm p-6 border border-dashed border-gray-300 bg-white w-full">
      <div className="absolute -top-3 left-3 text-xs font-semibold px-2 py-1 rounded-md bg-white/90 shadow-sm">
        Free
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {freePlan?.plan_name}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            {freePlan?.duration}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            ₹{Number(freePlan?.price).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            {freePlan?.user_limit === -1 ? `1 user` : `${freePlan?.user_limit} users`}
          </div>
        </div>
      </div>

      {/* <p className="mt-4 text-sm text-gray-700">
        {freePlan.description || "Basic access for a single user — ideal for evaluation or personal usage."}
      </p> */}
       <p className="mt-4 text-sm text-gray-700">
        Small teams get access to core features and email support.
      </p>

      <ul className="mt-4 flex items-center flex-wrap gap-2 text-sm text-gray-600">
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">Basic encrypted email sending</li>
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">File upload limit: 3 MB</li>
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">Message size limit: 1,000 characters</li>
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">Customer support response within 72 hours</li>
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">View sent message history</li>
        <li className="bg-[#EEF2FF] text-[#6C72F3] px-3 py-1 rounded-full">No custom branding</li>
      </ul>

      {/* <div className="mt-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => onEdit?.("Free")}
            className="text-sm px-3 py-2 bg-white border rounded-md hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default FreePlan;
