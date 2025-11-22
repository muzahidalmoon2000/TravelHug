// PlanList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";           // 👈 add
import apiClient from "../api";
import { setLastPlan } from "../sections/HeroPlanner"; // 👈 for fallback storage

const PlanList = ({ onSelected }) => {                    // 👈 accept optional closer
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();                         // 👈 init router

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/api/v1/planner/plans");
        setPlans(res.data);
      } catch (e) {
        console.error("Error fetching plans:", e);
      }
    })();
  }, []);

 const openPlan = async (planId) => {
    try {
      const res = await apiClient.get(`/api/v1/planner/plan/${planId}`);
      const fullPlan = res.data;
      // 👇 set the module-scoped variable instead of localStorage
      setLastPlan(fullPlan);

      // also pass via router state for immediate render
      navigate("/plan", { state: { plan: fullPlan } });

      onSelected?.(); // close drawer if provided
    } catch (e) {
      console.error("Error fetching plan:", e);
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-3">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => openPlan(p.id)}
              className="text-left bg-white rounded-xl shadow-md hover:shadow-xl transition p-4"
            >
              <div className="flex items-start gap-1.5 flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                </div>
                <p className="text-xs rounded-full px-2 py-1 bg-slate-100 text-slate-600">
                  View
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanList;
