import Container from "../ui/Container.jsx";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <Container className="flex items-center justify-between py-4">
        <Link to="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500" />
          <div className="text-xl font-black tracking-tight">TravelHug</div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-700">
          <a className="hover:text-teal-700" href="#">Home</a>
          <a className="hover:text-teal-700" href="#plan">Plan</a>
          <a className="hover:text-teal-700" href="#about">About</a>
          <a className="hover:text-teal-700" href="#testimonials">Testimonial</a>
          <a className="hover:text-teal-700" href="#blog">Blog</a>
          <a className="hover:text-teal-700" href="#contact">Contact</a>
        </nav>
      </Container>
    </header>
  );
}
