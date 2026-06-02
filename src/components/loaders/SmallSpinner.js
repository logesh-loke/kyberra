import React from "react";

const SmallSpinner = () => {
  return (
    <div className="spinner-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 384"
        className="small-spinner"
      >
        <circle
          r="176"
          cy="192"
          cx="192"
          strokeWidth="28"
          fill="transparent"
          pathLength="360"
          className="small-spinner-active"
        ></circle>

        <circle
          r="176"
          cy="192"
          cx="192"
          strokeWidth="28"
          fill="transparent"
          pathLength="360"
          className="small-spinner-track"
        ></circle>
      </svg>
    </div>
  );
};

export default SmallSpinner;
