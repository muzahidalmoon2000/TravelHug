import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";

export default function AboutUs() {
  return (
    <section id="about" className="py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="overflow-hidden">
              <img src="src/assets/travel.png" alt="" />
            </div>
          </div>
          <div>
            <div className="mb-6">
              <div className="text-teal-700 text-sm font-semibold uppercase tracking-wide">About Us</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Travel Smarter — Hug the World with AI.</h2>
            </div>
            <p className="text-slate-600">
              We blend intelligent planning with a human touch. Personalize plans by preferences and budget, share with friends,
              and export to PDF.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
