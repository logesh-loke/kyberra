import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuthGuard from "src/guard/authguard/AuthGuard";
import GuestGuard from "src/guard/guestguard/GuestGuard";
const RouteComponent = () => {
  return (
    <>
      <Routes>
        {route.map((route, index) => {
          const Components = route.component;
          const Guard =
            route.guard === "guest"
              ? GuestGuard
              : route.guard === "auth"
              ? AuthGuard
              : React.Fragment;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Guard requiredRole={route.requiredRole}>
                  <Components />
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </>
  );
};

const route = [
  {
   path: "/",
   component: lazy(() => import ("../views/pages/landing/index")),
   guard: "guest",
  },
  {
    path: "/signin",
    component: lazy(() => import("../auth/Signin/Signin")),
    guard: "guest",
  },
    {
    path: "/register-portal/:token/:plan_id/:plan_name",
    component: lazy(() => import("../views/superadmin/pages/portal/index")),
    guard: "guest",
  },
  {
    path: "/test",
    component: lazy(() => import("../views/pages/test/Test")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/signup",
    component: lazy(() => import("../auth/Signup/Signup")),
    guard: "guest",
  },
  {
    path: "/forgetpassword",
    component: lazy(() => import("../auth/forgetpassword/ForgetPassword")),
    guard: "guest",
  },
  {
    path: "/forgettoken",
    component: lazy(() => import("../auth/forgettoken/ForgetToken")),
    guard: "guest",
  },
  {
    path: "/passwordandconfirmpassword",
    component: lazy(() => import("../auth/Signup/PassConfirmPass")),
    guard: "guest",
  },
  {
    path: "/newpasswordandconfirmpassword",
    component: lazy(() =>
      import("../auth/commonnewpassandconfirmpass/CommonNewPassAndConfirmPass")
    ),
    guard: "guest",
  },
  {
    path: "/otpvalidation",
    component: lazy(() => import("../auth/otpvalidation/OtpValidation")),
    guard: "guest",
  },
    {
    path: "/blog",
    component: lazy(() => import("../views/pages/landing/pages/PublicSetupGuide")),
    guard: "guest",
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../views/superadmin/index")),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/admin-dashboard",
    component: lazy(() => import("../views/admin/index")),
    guard: "auth",
    requiredRole: ["admin"],
  },
  {
    path: "/inbox",
    component: lazy(() => import("../views/pages/inbox/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/inboxdetails/:id",
    component: lazy(() =>
      import("../views/pages/inbox/inboxdetails/InboxDetails")
    ),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/drafts",
    component: lazy(() => import("../views/pages/draft/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/sent",
    component: lazy(() => import("../views/pages/send/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/senddetails/:id",
    component: lazy(() =>
      import("../views/pages/send/senddetails/SendDetails")
    ),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/starred",
    component: lazy(() => import("../views/pages/starred/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/starreddetails/:id",
    component: lazy(() =>
      import("../views/pages/starred/starreddetails/StarredDetails")
    ),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/archive",
    component: lazy(() => import("../views/pages/archive/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/archivedetails/:id",
    component: lazy(() =>
      import("../views/pages/archive/archivedetails/ArchiveDetails")
    ),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/trash",
    component: lazy(() => import("../views/pages/trash/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/trashdetails/:id",
    component: lazy(() =>
      import("../views/pages/trash/trashdetails/TrashDetails")
    ),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
   {
    path: "/settings",
    component: lazy(() => import("../views/pages/settings/index")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/profile",
    component: lazy(() => import("../views/pages/profile/Profile")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
    {
    path: "/notifications",
    component: lazy(() => import("../views/admin/notification/Notification")),
    guard: "auth",
    requiredRole: ["super_admin", "admin", "user", "employee"],
  },
  {
    path: "/control-panel/plans",
    component: lazy(() => import("../views/superadmin/pages/plans/index")),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel",
    component: lazy(() =>
      import("../views/superadmin/pages/control-panel/index")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel/create-company",
    component: lazy(() =>
      import("../views/superadmin/pages/create-account/CreateCompany")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel/create-admin",
    component: lazy(() =>
      import("../views/superadmin/pages/create-account/CreateAdmin")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel/user-management",
    component: lazy(() =>
      import("../views/superadmin/pages/user-management/index")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel/user-verification",
    component: lazy(() =>
      import("../views/superadmin/pages/user-verification/index")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/control-panel/organization-management",
    component: lazy(() =>
      import("../views/superadmin/pages/company-list/CompanyList")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
   {
    path: "/control-panel/logs",
    component: lazy(() =>
      import("../views/superadmin/pages/log-folder/Logs")
    ),
    guard: "auth",
    requiredRole: ["super_admin"],
  },
  {
    path: "/create-account/add-employee-details",
    component: lazy(() =>
      import("../views/admin/create-account/AddEmployeeDetails")
    ),
    guard: "auth",
    requiredRole: ["admin"],
  },
  {
    path: "/create-account/add-employee-credential",
    component: lazy(() =>
      import("../views/admin/create-account/AddEmployeeCredential")
    ),
    guard: "auth",
    requiredRole: ["admin"],
  },
  {
    path: "/manage-team",
    component: lazy(() => import("../views/admin/manage-team/ManageTeam")),
    guard: "auth",
    requiredRole: ["admin"],
  },
  {
    path: "/membership-plan-history",
    component: lazy(() =>
      import("../views/admin/membership-plan-history/MemberShipPlanHistory")
    ),
    guard: "auth",
    requiredRole: ["admin"],
  },
  {
    path: "*",
    component: lazy(() => import("../views/pages/notfound/NotFound")),
  },
];

export default RouteComponent;
