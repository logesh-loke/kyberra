import React from "react";

const PieChartSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col">

      {/* Title */}
      <div className="mb-4">
        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Donut skeleton */}
      <div className="flex items-center justify-center h-32 sm:h-36">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-200 animate-pulse">
          <div className="absolute inset-4 sm:inset-5 bg-white rounded-full" />
        </div>
      </div>

      {/* Legend skeleton */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-3 w-14 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>

    </div>
  );
};

export default PieChartSkeleton;
