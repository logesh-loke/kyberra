import React, { useState, useMemo } from "react";
import FreePlan from "./components/FreePlan";
import BasicPlan from "./components/BasicPlan";
import StandardPlan from "./components/StandardPlan";
import PremiumPlan from "./components/PremiumPlan";
import axiosInstance from "src/api/Api";
import { useQuery } from "@tanstack/react-query";
import PlanPopup from "./components/popup/PlanPopup";
import PremiumProPlan from "./components/PremiumProPlan";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PlansIndex = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const handleEdit = (plan) => {
    // console.log('plan', plan);
    setSelectedPlan(plan);
    
    setIsPopupOpen(true);
  };

  const planRequest = () => axiosInstance.get("/require/planings");

  const { data: planData, refetch: refetchPlanData } = useQuery({
    queryKey: ["plans"],
    queryFn: planRequest,
  });

    const {
    freePlan,
    basicPlan,
    standardPlan,
    premiumPlan,
    premiumProPlan,
  } = useMemo(() => {
    const list = planData?.data?.data || []; // <-- from your JSON

    return {
      freePlan: list.find((p) => p.plan_name === "free"),
      basicPlan: list.find((p) => p.plan_name === "basic"),
      standardPlan: list.find((p) => p.plan_name === "standard"),
      premiumPlan: list.find((p) => p.plan_name === "premium"),
      premiumProPlan: list.find((p) => p.plan_name === "premium pro"),
    };
  }, [planData]);

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 mb-4">
        <div className="px-4">
          <div className="flex items-center h-12 gap-3">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg
        text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <FiArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-slate-300"></div>

            <p className="text-sm text-slate-500">
              Edit, customize and manage plans — names, duration, limits, price
              and description.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-1 pb-6 bg-gray-50 h-[calc(100vh-125px)] overflow-auto">
        <main className="space-y-7">
          <FreePlan onEdit={handleEdit} freePlan={freePlan} />
          <BasicPlan onEdit={handleEdit} basicPlan={basicPlan} />
          <StandardPlan onEdit={handleEdit} standardPlan={standardPlan} />
          <PremiumPlan onEdit={handleEdit} premiumPlan={premiumPlan} />
          <PremiumProPlan onEdit={handleEdit} premiumProPlan={premiumProPlan} />
        </main>
      </div>

      {isPopupOpen && <PlanPopup refetchPlanData={refetchPlanData} selectedPlan={selectedPlan} onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
};

export default PlansIndex;
