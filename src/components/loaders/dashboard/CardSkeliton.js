import React from 'react'

const CardSkeliton = () => {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
      {/* Top row: title + view button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
      </div>

      {/* Big number */}
      <div className="mb-2 h-8 w-10 rounded-full bg-slate-200 animate-pulse" />

      {/* Subtitle */}
      <div className="h-3 w-32 rounded-full bg-slate-200 animate-pulse" />
    </div>
  );
}

export default CardSkeliton
