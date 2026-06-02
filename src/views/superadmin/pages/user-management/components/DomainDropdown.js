import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const DomainFilterDropdown = ({ onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All domains");
  const ref = useRef(null);

  const options = [
    { key: "all", label: "All domains" },
    { key: "user", label: "crypsyn" },
    { key: "admin", label: "admin" },
    { key: "employee", label: "Other domains" },
    { key: "inactive", label: "Inactive domains" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option.label);
    setOpen(false);

    if(onChange){
      onChange(option);
    }

    // if (option.key === "other") {
    //   console.log("Other domains selected (custom text)");
    // } else {
    //   console.log("Filter:", option.key);
    // }
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-1.5
          text-xs
          px-3 py-1.5
          rounded-full
          border border-slate-200
          bg-white
          hover:bg-slate-50
          text-slate-600
          shadow-sm
        "
      >
        {selected}
        <FiChevronDown
          className={`w-3 h-3 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.key}
              onClick={() => handleSelect(opt)}
              className="
                px-3 py-2
                text-xs
                cursor-pointer
                hover:bg-slate-100
                text-slate-700
              "
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DomainFilterDropdown;
