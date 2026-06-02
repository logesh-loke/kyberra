import { useQuery } from "@tanstack/react-query";
import React from "react";
import axiosInstance from "src/api/Api";

const Logs = () => {
  const { data: logData } = useQuery({
    queryKey: ["logs"],
    queryFn: () => axiosInstance.get("/require/log"),
  });

  console.log("logsdata", logData);

  return (
    <div className="p-6">

      <div className="mt-10 flex flex-col items-center justify-center text-center border border-dashed border-slate-300 rounded-lg py-16 bg-slate-50">
        <p className="text-lg font-semibold text-slate-700">
          🚧 Logs Module Under Development
        </p>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          We’re currently building this section to help you track activity,
          events, and system logs in detail. Please check back soon.
        </p>
      </div>
    </div>
  );
};

export default Logs;
