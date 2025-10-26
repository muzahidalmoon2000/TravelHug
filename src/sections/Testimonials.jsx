import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-12 bg-white">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">What people say about Us.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="p-5">
              <div className="text-slate-700">The best booking system. Helped me plan a perfect family trip.</div>
              <div className="mt-4 flex items-center gap-3">
                <img className="w-10 h-10 rounded-full object-cover" src={`https://i.pravatar.cc/100?img=${i+12}`} />
                <div><div className="text-sm font-semibold">User {i}</div><div className="text-xs text-slate-500">Traveler</div></div>
                <div className="ml-auto flex items-center gap-0.5 text-orange-500">
                  {Array.from({length:5}).map((_,j)=><Star key={j} size={14} fill="currentColor" />)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
