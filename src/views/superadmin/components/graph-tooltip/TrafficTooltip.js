import React from 'react'

const TrafficTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const sent = payload.find((p) => p.dataKey === "sent")?.value ?? 0;
  const received = payload.find((p) => p.dataKey === "received")?.value ?? 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-[11px]">
      <p className="font-semibold text-slate-800 mb-1">
        {label}
      </p>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#6366F1]" />
          <span className="text-slate-500">Sent:</span>
          <span className="font-medium text-slate-800">{sent}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
          <span className="text-slate-500">Received:</span>
          <span className="font-medium text-slate-800">{received}</span>
        </div>
      </div>
    </div>
  );
};


export default TrafficTooltip
