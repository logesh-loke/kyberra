import React from 'react'

const EmailDistributionTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value } = payload[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-[11px]">
      <p className="font-semibold text-slate-800">{name}</p>
      <p className="text-slate-600">
        Emails:{" "}
        <span className="font-semibold text-slate-900">
          {value?.toLocaleString()}
        </span>
      </p>
    </div>
  );
};


export default EmailDistributionTooltip
