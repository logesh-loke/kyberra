import React from 'react'

const LineChartSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 lg:col-span-2 flex flex-col">
      
      {/* Header */}
      <div className="mb-4">
        <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mb-2" />
        <div className="h-3 w-64 rounded bg-slate-200 animate-pulse" />
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative mt-4 rounded-lg bg-slate-50 overflow-hidden">

        {/* Fake grid lines */}
        <div className="absolute inset-0 grid grid-rows-4 gap-6 px-4 py-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-t border-slate-200/70"
            />
          ))}
        </div>

        {/* Fake chart lines */}
        <svg
          viewBox="0 0 400 170"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 10 130 L 80 90 L 150 110 L 220 70 L 300 95 L 380 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M 10 150 L 80 120 L 150 90 L 220 115 L 300 70 L 380 95"
            fill="none"
            stroke="#c7d2fe"
            strokeWidth="3"
          />
        </svg>

        {/* Pulse overlay */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* X-Axis labels */}
        <div className="absolute bottom-0 w-full flex justify-between px-4 pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <div
              key={d}
              className="h-2 w-6 rounded bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChartSkeleton;

