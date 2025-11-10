import PlanSection from "../sections/PlanSection";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function TravelPlan() {
  return (
    <>
    <Header />
    <main className="bg-white text-slate-900">
      <PlanSection />
    </main>
    <Footer />
    </>
  );
}

export default TravelPlan;