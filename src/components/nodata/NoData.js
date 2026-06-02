import React from "react";

const NoDataFound = ({
  title = "No Data Found",
  subtitle = "There’s nothing to display here.",
  iconSize = 60,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-10 text-gray-500 ${className}`}
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-gray-400 mb-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 17.5228 16.5228 21 12 21C7.47715 21 3 17.5228 3 12C3 6.47715 7.47715 3 12 3C16.5228 3 21 6.47715 21 12Z"
        />
      </svg>

      {/* Title */}
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default NoDataFound;
