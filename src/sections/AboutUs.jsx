import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";

export default function AboutUs() {
  return (
    <section id="about" className="py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
            </Card>
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
