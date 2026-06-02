import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "src/api/Api";
import Swal from "sweetalert2";
// import { startDashboardHeaderTour } from "src/onboarding/tours";
import { GoLinkExternal } from "react-icons/go";
import { Link } from "react-router-dom";
import TrafficTooltip from "./components/graph-tooltip/TrafficTooltip";
import WeeklyActiveTooltip from "./components/graph-tooltip/WeeklyActiveTooltip";
import EmailDistributionTooltip from "./components/graph-tooltip/EmailDistributionTooltip";
import CardSkeliton from "src/components/loaders/dashboard/CardSkeliton";
import LineChartSkeleton from "src/components/loaders/dashboard/LineChartSkeleton";
import BarChartSkeleton from "src/components/loaders/dashboard/BarChartSkeliton";
import PieChartSkeleton from "src/components/loaders/dashboard/PieChartSkeleton";
import TableSkeleton from "src/components/loaders/TableSkeliton";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444"];

const SuperAdminDashboard = () => {
  const QueryClient = useQueryClient();
//   useEffect(() => {
// const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
// const passkeyTour = localStorage.getItem("passkeyTour");
// if (userDetails.login_status === "true"|| passkeyTour === "true") return;
//     // small delay so Header + button are rendered
//     const t = setTimeout(() => {
//       startDashboardHeaderTour();
//     }, 500);

//     return () => clearTimeout(t);
//   }, []);

  const request = () => axiosInstance.get("/require/dashboard");
  const requestUser = () => axiosInstance.get("/require/dashboard-user");
  const dashboardPendingRequest = () =>
    axiosInstance.get("/require/dashboard-approved");
  const dashboardTotalSendRequest = () =>
    axiosInstance.get("/require/dashboard-send");
  const pendingApprovalsRequest = () =>
    axiosInstance.get("/require/not-approved");
  const activeRequest = (payload) =>
    axiosInstance.put("/require/approved", payload);

  const { data: dashboardData , isPending: isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: request,
  });

  const { data: dashboardUserData, isPending: userLoading } = useQuery({
    queryKey: ["dashboardUserData"],
    queryFn: requestUser,
  });

  const { data: dashboardPendingData, isPending: pendingLoading } = useQuery({
    queryKey: ["dashboardPendingData"],
    queryFn: dashboardPendingRequest,
  });

  const { data: dashboardTotalSendData, isPending: activeUserLoading } = useQuery({
    queryKey: ["dashboardTotalSendData"],
    queryFn: dashboardTotalSendRequest,
  });

  const { data: pendingApprovalsData, isPending: pendingApprovalsLoading } = useQuery({
    queryKey: ["pendingApprovalsData"],
    queryFn: pendingApprovalsRequest,
  });

  const {
    data: activeUserData,
    mutate: activeMutate,
    error: activateUserError,
  } = useMutation({
    mutationKey: ["approve-user"],
    mutationFn: activeRequest,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ["pendingApprovalsData"] });
    },
  });

  useEffect(() => {
    if (activeUserData || activateUserError) {
      if (activeUserData) {
        const message = activeUserData?.data?.message;
        if (message === "Success") {
          toast.success("User Activated Successfully");
        }
      }

      if (activateUserError) {
        const msg = activateUserError?.response?.data?.message;
        if (msg === "Internal Server Error") {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "We encountered an unexpected system issue while processing your request. Our technical team has been notified. Please try again in a few moments.",
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: "Understood",
            confirmButtonColor: "#6C72F3",
            backdrop: true,
          });
        }
      }
    }
  }, [activeUserData, activateUserError]);

  //  console.log('dashboarduserdata', dashboardUserData);
  //  console.log('dashboardpendingdata', dashboardPendingData);
  //  console.log('dashboardtotalsenddata', dashboardTotalSendData);
  //  console.log('pendingapprovalsdata', pendingApprovalsData);

  //  console.log('dashboarddata', dashboardData?.data?.data);

  const stats = [
    {
      label: "Total Users",
      value: dashboardUserData?.data?.data[0]?.allData || 0,
      subLabel: "All registered accounts",
      trend: <GoLinkExternal />,
      link: "/control-panel/user-management",
    },
    {
      label: "Pending Approvals",
      value: dashboardPendingData?.data?.data[0]?.unapprovedCount || 0,
      subLabel: "Waiting for review",
      trend: <GoLinkExternal />,
      link: "/control-panel/user-verification",
    },
    {
      label: "Active Users",
      value: dashboardTotalSendData?.data?.data[0]?.Active_Users || 0,
      subLabel: "All time",
      trend: <GoLinkExternal />,
      link: "/control-panel/user-management",
    },
       {
      label: "Empty Slot",
      value: "0",
      subLabel: "Available slots",
      trend: <GoLinkExternal />,
      link: "/control-panel/user-management",
    },
  ];

  const handleActiveUser = (userId) => {
    if (!userId) {
      return;
    }
    if (userId) {
      activeMutate({ user_id: [userId] });
    }
  };

  return (
    <div className="w-full h-[calc(100vh-51px)] overflow-auto bg-slate-50 p-2">
      {/* Top stats grid */}
      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 mb-5 sm:mb-6">
        {userLoading && pendingLoading && activeUserLoading ? 
        Array.from({ length: stats.length }).map((_, index) => (
        <CardSkeliton key={index} />
      )) : stats.map((card) => (
          <div
            key={card.label}
            className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-sm px-4 py-3 sm:px-5 sm:py-4 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>
                <p className="mt-1 text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>
              <Link
                to={card.link}
                className="inline-flex gap-1 items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 text-[10px] sm:text-[11px] font-medium text-indigo-600"
              >
                {card.trend} view
              </Link>
            </div>
            <p className="mt-2 text-[11px] sm:text-xs text-slate-500">
              {card.subLabel}
            </p>
          </div>
        ))}
      </section>

      {/* Charts section */}
      <section className="grid gap-4 lg:grid-cols-3 mb-5 sm:mb-6">
        {/* Email traffic line chart */}
        {isLoading ? <LineChartSkeleton /> : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Email Traffic (Sent vs Received)
              </h2>
              <p className="text-xs text-slate-500">
                Last 7 days, aggregated platform-wide
              </p>
            </div>
          </div>
          <div className="h-52 sm:h-64 lg:h-72 focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData?.data?.data?.trafficData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  horizontal={false}
                  stroke="#E5E7EB"
                />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<TrafficTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sent"
                  stroke="#6366F1"
                  strokeWidth={1}
                  dot={{ r: 2 }}
                  name="Sent"
                />
                <Line
                  type="monotone"
                  dataKey="received"
                  stroke="#22C55E"
                  strokeWidth={1}
                  dot={{ r: 2 }}
                  // strokeDasharray="5 5"
                  name="Received"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}

        {/* Active users + distribution */}
        <div className="flex flex-col gap-4">
          {isLoading ? <BarChartSkeleton /> : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Weekly Active Users <span className="text-xs text-gray-400">(last 4 weeks)</span> 
            </h2>
            <div className="h-32 sm:h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData?.data?.data?.activeUsersData}
                  margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} horizontal={false} />
                  <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip content={<WeeklyActiveTooltip />}   cursor={{ fill: "rgba(99, 102, 241, 0.12)" }} />
                  <Bar dataKey="users" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          )}

{/* <PieChartSkeleton /> */}
{ isLoading ? <PieChartSkeleton /> : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex-1">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Email Distribution
            </h2>
            <div className="h-32 sm:h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData?.data?.data?.emailDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={55}
                    innerRadius={28}
                    paddingAngle={3}
                  >
                    {dashboardData?.data?.data?.emailDistribution.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip content={<EmailDistributionTooltip />} />
                  <Legend
                    formatter={(val) => <span className="text-xs">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
) }
        </div>
      </section>

      {/* Pending approvals table */}
      <section className="grid gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                Pending User Approvals
              </h2>
              <p className="text-xs text-slate-500">
                Review and approve new registration requests
              </p>
            </div>
          </div>
          {pendingApprovalsLoading ? <TableSkeleton columns={5} rows={5} /> : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] sm:text-xs text-slate-500">
                  <th className="px-2 sm:px-3 py-2 font-medium">Name</th>
                  <th className="px-2 sm:px-3 py-2 font-medium">Email</th>
                  <th className="px-2 sm:px-3 py-2 font-medium">
                    Phone Number
                  </th>
                  <th className="px-2 sm:px-3 py-2 font-medium">Requested</th>
                  <th className="px-2 sm:px-3 py-2 font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovalsData?.data?.data?.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-2 sm:px-3 py-2 align-top">
                      <p className="font-medium text-slate-900 text-xs sm:text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                    </td>
                    <td className="px-2 sm:px-3 py-2 align-top">
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[140px] sm:max-w-[180px]">
                        {user.gmail}
                      </p>
                    </td>
                    <td className="px-2 sm:px-3 py-2 align-top">
                      <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-indigo-600">
                        {user.phone_number}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2 align-top">
                      {/* <p className="text-[11px] sm:text-xs text-slate-500">
                        {user.created_at}
                      </p> */}
                      <p className="text-[11px] sm:text-xs text-slate-500">
  {new Date(user.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</p>
                    </td>
                    <td className="px-2 sm:px-3 py-2 align-top text-right">
                      <div className="inline-flex gap-1 sm:gap-1.5">
                        <button
                          onClick={() => handleActiveUser(user.user_id)}
                          className="px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingApprovalsData?.data?.data?.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 sm:px-3 py-4 text-center text-xs text-slate-400"
                    >
                      No pending approvals at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}


        </div>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
