import React from "react";

const BarChartSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 h-48 sm:h-52 flex flex-col">

      {/* Header */}
      <div className="mb-3">
        <div className="h-4 w-44 rounded bg-slate-200 animate-pulse mb-1" />
        <div className="h-3 w-52 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative rounded-lg bg-slate-50 p-3 flex items-end justify-between">

        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 px-4 py-3">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border-t border-slate-200/60" />
          ))}
        </div>

        {/* Bars */}
        {["75%", "100%", "45%", "85%"].map((h, i) => (
          <div
            key={i}
            className="relative z-10 w-10 sm:w-12 bg-indigo-200 animate-pulse rounded-md"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
};

export default BarChartSkeleton;
