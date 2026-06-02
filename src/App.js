import { Suspense, useEffect, useState } from "react";
import "./App.css";
import RouteComponent from "./routes/Route";
import PageLoader from "./components/loaders/PageLoader";
import Header from "./layouts/header/Header";
import Sidebar from "./layouts/sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import { useClickContext } from "./context/ClickContext";
import MailBox from "./components/mailbox/index";
import { useSession } from "src/context/SessionContext";
import SessionExpiredModal from "src/components/popups/SessionExpiredPopup";
import axiosInstance from "./api/Api";
import { useQuery } from "@tanstack/react-query";
import MembershipEndModal from "./components/popups/MembershipEndModal";
import SubscriptionExpired from "./components/popups/SubscriptionExpired";
import ScrollToTop from "./utils/ScrollToTop";
// import SnackBar from "./components/snackbar/SnackBar";

function App() {
  const location = useLocation();
  const { isOpen } = useClickContext();
  const { sessionExpired, setSessionExpired } = useSession();
  const token = localStorage.getItem("authToken");

  const isVisible =
    location.pathname !== "/" &&
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/404" &&
    location.pathname !== "/forgetpassword" &&
    location.pathname !== "/forgettoken" &&
    location.pathname !== "/passwordandconfirmpassword" &&
    location.pathname !== "/otpvalidation" &&
    location.pathname !== "/newpasswordandconfirmpassword" &&
    location.pathname !== "/test" &&
    !location.pathname.includes("/register-portal") &&
    location.pathname !== "/setup-demo";



  useEffect(() => {
    const show = () => setSessionExpired(true);
    window.addEventListener("SESSION_EXPIRED", show);
    return () => window.removeEventListener("SESSION_EXPIRED", show);
  }, [setSessionExpired]);

  // useEffect(() => {
  //   if (!localStorage.getItem("appLoaded")) {
  //     localStorage.setItem("appLoaded", "true");
  //   }
  // }, []);

  const request = () => axiosInstance.get("/require/subs-details");

  const { data: subscriptionData } = useQuery({
    queryKey: ["subs-details", token],
    queryFn: request,
      enabled: !!token,     //  VERY IMPORTANT (run if token exists)
  refetchOnMount: true,  // refetch on mount even if cache exists
  refetchOnWindowFocus: false,

  });


  // ===== NEW: membership / subscription modal state =====
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showSubscriptionExpired, setShowSubscriptionExpired] = useState(false);

  // helper to compute diffDays & flags
  const subscription = subscriptionData?.data?.data;
  const endDateStr = subscription?.end_date || null;
  let diffDays = null;
  let isExpiredToday = false;

  if (endDateStr) {
    const today = new Date();
    const end = new Date(endDateStr);

    const msPerDay = 1000 * 60 * 60 * 24;
    // strip time for both to avoid timezone glitches
    const todayMid = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endMid = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

    diffDays = Math.ceil((endMid - todayMid) / msPerDay);
    isExpiredToday = diffDays === 0;
  }

  // Decide when to show which modal
  useEffect(() => {
    if (!token) {
      setShowMembershipModal(false);
      setShowSubscriptionExpired(false);
      return;
    }

    if (!endDateStr || diffDays === null) return;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const remindDate = localStorage.getItem("membershipRemindDate");
    const expiredAck =
      localStorage.getItem("membershipExpiredAcknowledged") === "true";

    // Reset defaults
    let showMembership = false;
    let showExpired = false;

    if (diffDays > 0) {
      // Plan active, but may be expiring soon
      if (diffDays <= 3) {
        // only show if "remind me later" wasn't clicked today
        if (remindDate !== todayStr) {
          showMembership = true;
        }
      }
      // no SubscriptionExpired when plan still active
    } else if (diffDays === 0) {
      // Expiry day
      if (!expiredAck) {
        // first time today → show membership modal saying "Plan expired today"
        showMembership = true;
      } else {
        // user already clicked "Got it" on expiry day → show SubscriptionExpired from now
        showExpired = true;
      }
    } else {
      // diffDays < 0 → already expired
      showExpired = true;
    }

    setShowMembershipModal(showMembership);
    setShowSubscriptionExpired(showExpired);
  }, [token, endDateStr, diffDays]);

  // handlers for MembershipEndModal
  const handleMembershipRemindLater = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem("membershipRemindDate", todayStr);
    setShowMembershipModal(false);
  };

  const handleMembershipGotIt = () => {
    if (isExpiredToday) {
      // user acknowledged today's expiry → never show membership modal again for expiry
      localStorage.setItem("membershipExpiredAcknowledged", "true");
      setShowMembershipModal(false);
      setShowSubscriptionExpired(true);
    } else {
      setShowMembershipModal(false);
    }
  };

  return (
    <>
      <Suspense
        fallback={
          <PageLoader />
          // localStorage.getItem("appLoaded") === "true" ? null : <PageLoader />
        }
      >
        <ScrollToTop />
        <div>
          <Toaster />
        </div>
        <div>
          <ToastContainer />
        </div>
        <div className="flex">
          {isVisible && <Sidebar />}
          <div className="flex-1 min-w-0">
            {isVisible && <Header />}
            <RouteComponent />
          </div>
        </div>

{/* <SnackBar /> */}
        {isOpen && token && <MailBox />}
        {sessionExpired && <SessionExpiredModal />}

        {/* Membership expiring / expired today modal */}
        {showMembershipModal && (
          <MembershipEndModal
            onClose={handleMembershipGotIt}
            onRemindLater={handleMembershipRemindLater}
            isExpiredToday={isExpiredToday}
            daysLeft={diffDays}   //  pass number of days

          />
        )}

        {/* Fully expired subscription page */}
        {showSubscriptionExpired && <SubscriptionExpired />}
      </Suspense>
    </>
  );
}

export default App;
