import React from 'react'

const WeeklyActiveTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const users = payload[0]?.value ?? 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-[11px]">
      <p className="font-semibold text-slate-800 mb-1">
        {label}
      </p>
      <p className="text-slate-600">
        Active users:{" "}
        <span className="font-semibold text-slate-900">
          {users.toLocaleString()}
        </span>
      </p>
    </div>
  );
};


export default WeeklyActiveTooltip
