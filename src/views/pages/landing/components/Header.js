import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "src/assets/images/kyberraLogo.png";
// import logo from "src/assets/images/crypsyn-full-logo.png";

/* ---------- Desktop-only popup ---------- */
const DesktopOnlyPopup = ({ open, onClose }) => {
  if (!open) return null;

  return (
   <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm px-4 sm:px-6">
  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-[90%] sm:max-w-md w-full text-center shadow-2xl transform transition-all">
    {/* Icon/Visual Element */}
    <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
      <svg 
        className="w-7 h-7 sm:w-8 sm:h-8 text-white" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
        />
      </svg>
    </div>

    {/* Title */}
    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 sm:mb-4">
      Desktop Required
    </h2>

    {/* Description */}
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-2 px-2">
      This feature is available only on desktop devices.
      Please open Crypsyn on a laptop or desktop computer.
    </p>
    
    {/* Coming Soon Badge */}
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-7">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </span>
      <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Mobile App Coming Soon!
      </span>
    </div>

    {/* Button */}
    <button
      onClick={onClose}
      className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] transform transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      Got it
    </button>
  </div>
</div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const isDesktop = () => window.innerWidth >= 1024;

  const handleDesktopOnlyNav = (path) => {
    if (isDesktop()) {
      navigate(path);
    } else {
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    {label: "Compliance", href: "#Compliance"},
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <header
      id='top'
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-[#46365b] to-[#46365b] shadow-sm border-b border-[#A14FFC85] "
            :"bg-gradient-to-r from-[#46365b] to-[#46365b]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center">
              <img src={logo} alt="Crypsyn" className="w-40 " /> 
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-white font-medium rounded-lg hover:bg-[#aca5b6] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2">

              <button
                onClick={() => handleDesktopOnlyNav("/signin")}
                className="px-4 py-2 text-white hover:text-white/80 font-medium rounded-lg hover:bg-[#9a94a1] transition-colors"
                >
                Sign In
              </button>

              <button
                onClick={() => handleDesktopOnlyNav("/signup")}
                className="px-4 py-2 rounded-lg bg-gradient-to-l from-[#AF7BFD] to-[#7c56b5] text-white font-medium hover:bg-[#AF7BFD] transition-all"
                >
                Sign Up
              </button>
                </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-white"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-14 bg-[#3B0764] border-t border-gray-200 py-4 h-[calc(100vh-56px)] overflow-y-auto">
              <div className="space-y-2 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:text-blue-600 rounded-lg hover:bg-[]"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3">

                   <Link
                   to="/signin"
                // onClick={() => handleDesktopOnlyNav("/signin")}
                className=" w-full px-4 py-2  text-white hover:text-white/80 font-medium rounded-lg hover:bg-[#9a94a1] transition-colors"
                >
                Sign In
              </Link>

              <Link
              to="/signup"
                // onClick={() => handleDesktopOnlyNav("/signup")}
                // className="px-4 py-2 text-center rounded-lg bg-gradient-to-r bg-[#356AB4] text-white font-medium  hover:bg-[#224f8f] transition-all"
                 className=" w-full px-4 py-2  rounded-lg bg-gradient-to-l from-[#AF7BFD] to-[#7c56b5] text-white font-medium hover:bg-[#AF7BFD] transition-all"

                >
                Sign Up
              </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Popup */}
      <DesktopOnlyPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
};

export default Header;
