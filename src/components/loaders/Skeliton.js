import React from "react";

const Skeleton = () => {
  return (
    <ul className="divide-y h-[calc(100vh-110px)] overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <li
          key={i}
          className="relative overflow-hidden grid grid-cols-[20px_20px_200px_1fr_auto] items-center gap-4 px-4 py-3"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/60 to-transparent animate-[shimmer_1.5s_infinite]" />

          <div className="w-[13px] h-[13px] rounded bg-gray-200" />
          <div className="w-[14px] h-[14px] rounded bg-gray-200" />

          <div className="w-24 h-3 bg-gray-200 rounded" />

          <div className="flex items-center gap-3">
            <div className="w-40 h-3 bg-gray-200 rounded" />
            <div className="w-96 h-3 bg-gray-200 rounded" />
          </div>

          <div className="w-10 h-3 bg-gray-200 rounded ml-auto" />
        </li>
      ))}
    </ul>
  );
};

export default Skeleton;
