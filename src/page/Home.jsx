// Home.jsx
import { useState, useEffect } from "react";
import PromoBar from "../components/layout/PromoBar.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import HeroPlanner from "../sections/HeroPlanner.jsx";
import HowToGetIn from "../sections/HowToGetIn.jsx";
import AboutUs from "../sections/AboutUs.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import AppPromo from "../sections/AppPromo.jsx";
import BlogSection from "../sections/BlogSection.jsx";
import PlansSidebar from "../sections/PlansSidebar.jsx";
export default function Home() {
  const [showPlans, setShowPlans] = useState(false);

  // close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowPlans(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="bg-white text-slate-900">
      {/* <PromoBar /> */}
      {/* pass an opener into Header */}
      <Header onOpenPlans={() => setShowPlans(true)} />

      {/* rest of the page */}
      <HeroPlanner />
      <HowToGetIn />
      <AboutUs />
      <Testimonials />
      <AppPromo />
      <BlogSection />
      <Footer />

 <PlansSidebar open={showPlans} onClose={() => setShowPlans(false)} />
    </main>
  );
}

