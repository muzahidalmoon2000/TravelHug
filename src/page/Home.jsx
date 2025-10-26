import PromoBar from "../components/layout/PromoBar.jsx";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

import HeroPlanner from "../sections/HeroPlanner.jsx";
import PlanSection from "../sections/PlanSection.jsx";
import HowToGetIn from "../sections/HowToGetIn.jsx";
import AboutUs from "../sections/AboutUs.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import AppPromo from "../sections/AppPromo.jsx";
import BlogSection from "../sections/BlogSection.jsx";

export default function Home() {
  return (
    <main className="bg-white text-slate-900">
      <PromoBar />
      <Header />
      <HeroPlanner />
      <PlanSection />
      <HowToGetIn />
      <AboutUs />
      <Testimonials />
      <AppPromo />
      <BlogSection />
      <Footer />
    </main>
  );
}
