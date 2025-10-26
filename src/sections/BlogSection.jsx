import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import Chip from "../components/ui/Chip.jsx";
import { ChevronRight } from "lucide-react";
import { BLOGS } from "../data/blog.js";

export default function BlogSection() {
  return (
    <section id="blog" className="py-12 bg-white">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">News, Tips & Guides</h2>
          <a className="text-sm font-semibold text-teal-700" href="#">View More</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BLOGS.map((b) => (
            <Card key={b.title} className="overflow-hidden">
              <div className="aspect-[16/10] bg-cover bg-center" style={{ backgroundImage: `url(${b.image})` }} />
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>{b.date}</span><span>•</span><span>{b.read} min read</span><span>•</span><span>{b.comments} comments</span>
                  </div>
                  <Chip color="teal">{b.tag}</Chip>
                </div>
                <h4 className="mt-2 font-bold text-slate-900">{b.title}</h4>
                <button className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                  Read More <ChevronRight size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
