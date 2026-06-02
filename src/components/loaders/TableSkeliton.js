import React from "react";

const TableSkeleton = ({ rows = 8, columns = 6 }) => {
  const skeletonRows = Array.from({ length: rows });
  const skeletonCols = Array.from({ length: columns });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* Header skeleton */}
      <div
        className="grid gap-4 px-6 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {skeletonCols.map((_, i) => (
          <div
            key={i}
            className="h-3 w-20 rounded bg-slate-100 animate-pulse"
          />
        ))}
      </div>

      {/* Body skeleton */}
      <div className="divide-y divide-slate-100">
        {skeletonRows.map((_, i) => (
          <div
            key={i}
            className="grid items-center gap-4 px-6 py-4 animate-pulse"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {skeletonCols.map((_, c) => (
              <div
                key={c}
                className="h-3 w-full rounded bg-slate-100"
              />
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default TableSkeleton;
