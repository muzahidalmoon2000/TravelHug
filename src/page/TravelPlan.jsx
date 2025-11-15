import { useState, useEffect } from "react";
import PlanSection from "../sections/PlanSection";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PlansSidebar from "../sections/PlansSidebar";
import PromoBar from "../components/layout/PromoBar";

function TravelPlan() {
    const [showPlans, setShowPlans] = useState(false);
  
    // close on ESC
    useEffect(() => {
      const onKey = (e) => e.key === "Escape" && setShowPlans(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);
  return (
    <>
      <PromoBar />
    <Header onOpenPlans={() => setShowPlans(true)} />
    <main className="bg-white text-slate-900">
            {/* DRAWER */}
    <PlansSidebar open={showPlans} onClose={() => setShowPlans(false)} />
      <PlanSection />
    </main>
    <Footer />
    </>
  );
}

export default TravelPlan;