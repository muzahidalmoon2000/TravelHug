// Header.jsx
import { useState } from "react";
import Container from "../ui/Container.jsx";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header({ onOpenPlans }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePlanClick = () => {
    onOpenPlans?.();
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <Container className="flex items-center justify-between py-3 md:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMobile}
        >
          <img
            src="/src/assets/Logo.svg"
            alt="TravelHug Logo"
            className="h-20 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-slate-700 text-md">
          <a className="hover:text-teal-700" href="/">
            Home
          </a>

          {/* Plan as button */}
          <button
            type="button"
            onClick={onOpenPlans}
            className="hover:text-teal-700 cursor-pointer"
          >
            Plan
          </button>

          <a className="hover:text-teal-700" href="/#about">
            About
          </a>
          {/* <a className="hover:text-teal-700" href="/#testimonials">
            Testimonial
          </a>
          <a className="hover:text-teal-700" href="/#blog">
            Blog
          </a> */}
          <a className="hover:text-teal-700" href="/#contact">
            Contact
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <Container className="py-3">
            <nav className="flex flex-col gap-2 text-sm text-slate-700">
              <a
                className="py-2 hover:text-teal-700"
                href="/"
                onClick={closeMobile}
              >
                Home
              </a>

              <button
                type="button"
                onClick={handlePlanClick}
                className="py-2 text-left hover:text-teal-700"
              >
                Plan
              </button>

              <a
                className="py-2 hover:text-teal-700"
                href="/#about"
                onClick={closeMobile}
              >
                About
              </a>
              <a
                className="py-2 hover:text-teal-700"
                href="/#testimonials"
                onClick={closeMobile}
              >
                Testimonial
              </a>
              <a
                className="py-2 hover:text-teal-700"
                href="/#blog"
                onClick={closeMobile}
              >
                Blog
              </a>
              <a
                className="py-2 hover:text-teal-700"
                href="/#contact"
                onClick={closeMobile}
              >
                Contact
              </a>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
