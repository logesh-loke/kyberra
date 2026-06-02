import React, {  useState } from "react";
import ProfileCard from "./components/ProfileCard";
import usePathName from "src/hooks/usePathName";
// import { Bell } from "lucide-react";
// import { setOnboardingStep, ONBOARDING_STEPS } from "src/onboarding/steps";
// import { startProfileMenuTour } from "src/onboarding/tours"; 


const Header = () => {
  const { pathName } = usePathName();
  const userdetails = localStorage.getItem("userDetails");
  const userdata = userdetails ? JSON.parse(userdetails) : {};
  const email = userdata?.email;
  const [isOpen, setIsOpen] = useState(false);

  const handletoggle = () => {
        // setOnboardingStep(ONBOARDING_STEPS.PROFILE_PASSKEY);
    setIsOpen((prev) => !prev);
  };

    //  when dropdown opens, start "Profile" tour
  // useEffect(() => {
  //   if (isOpen) {
  //     const t = setTimeout(() => {
  //       startProfileMenuTour();
  //     }, 200); // small delay so ProfileCard is rendered
  //     return () => clearTimeout(t);
  //   }
  // }, [isOpen]);

  return (
    <div className="bg-white px-4 py-[9.3px] border-b flex items-center justify-between">
      <p className="font-bold text-sm text-gray-800">{pathName}</p>

      <div className="flex items-center gap-4">
        {/* <button className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button> */}

        {/* <p className='text-sm'>{email}</p> */}
        <div className="relative">
          <button
          id="header-profile-button"
            onClick={handletoggle}
            onMouseDown={(e) => {
              e.stopPropagation(); // ⬅ stop outside-click listener
            }}
            className="border rounded-md bg-[#F6F0FF] text-[#260c41] font-semibold py-1 px-2.5 text-sm"
          >
            {email?.charAt(0)?.toUpperCase()}
          </button>
          {isOpen && <ProfileCard onClose={() => setIsOpen(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Header;
