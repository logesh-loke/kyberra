import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePathName = () => {
  const location = useLocation();
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/dashboard")) {
      setPathName("DASHBOARD");
    } else if (path.includes("/admindashboard")) {
      setPathName("DASHBOARD");
    } else if (path.includes("/inbox")) {
      setPathName("INBOX");
    } else if (path.includes("/sent")) {
      setPathName("SENT");
    } else if (path.includes("/drafts")) {
      setPathName("DRAFT'S");
    } else if (path.includes("/spam")) {
      setPathName("SPAM");
    } else if (path.includes("/trash")) {
      setPathName("TRASH");
    } else if (path.includes("/starred")) {
      setPathName("STARRED");
    } else if (path.includes("/archive")) {
      setPathName("ARCHIVE");
    }else if (path.includes("/profile")) {
      setPathName("PROFILE");
    }else if(path.includes("/senddetails")){
      setPathName("SENTDETAILS");
    }else if(path.includes("/plans")){
      setPathName("MEMBERSHIP PACKAGES");
    }else if(path.includes('/control-panel')){
      setPathName("CONTROL PANEL")
    }else if(path.includes('/admin-dashboard')){
      setPathName("DASHBOARD")
    }
     else if(path.includes('/manage-team')){
      setPathName("MANAGE TEAM")
    }
     else if(path.includes('/create-account/add-employee-details')){
      setPathName("CREATE EMPLOYEE")
    }
     else if(path.includes('/create-account/add-employee-credential')){
      setPathName("CREATE CREDENTIAL")
    }else if(path.includes('/membership-plan-history')){
      setPathName("MEMBERSHIP PLAN HISTORY")
    }else if(path.includes('/settings')){
      setPathName("SETTINGS")
    }else if(path.includes('/notifications')){
      setPathName("NOTIFICATIONS")
    }
     else {
      setPathName("");
    }
  }, [location]);

  return { pathName, setPathName };
};

export default usePathName;
