// Header.jsx
import Container from "../ui/Container.jsx";
import { Link } from "react-router-dom";

export default function Header({ onOpenPlans }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <Container className="flex items-center justify-between py-4">
        <Link to="#" className="flex items-center gap-2">
          <img src="/src/assets/Logo.svg" alt="TravelHug Logo" className="" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-slate-700">
          <a className="hover:text-teal-700" href="#">Home</a>

          {/* CHANGED: Plan -> button */}
          <button
            type="button"
            onClick={onOpenPlans}
            className="hover:text-teal-700"
          >
            Plan
          </button>

          <a className="hover:text-teal-700" href="#about">About</a>
          <a className="hover:text-teal-700" href="#testimonials">Testimonial</a>
          <a className="hover:text-teal-700" href="#blog">Blog</a>
          <a className="hover:text-teal-700" href="#contact">Contact</a>
        </nav>
      </Container>
    </header>
  );
}
