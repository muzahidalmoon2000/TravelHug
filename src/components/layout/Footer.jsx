import Container from "../ui/Container.jsx";
import { Phone } from "lucide-react";

function Col({ title, links }) {
  return (
    <div>
      <div className="font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-teal-100">
        {links.map((l) => (
          <li key={l}><a className="hover:underline" href="#">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-teal-50 pt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/src/assets/LogoWhite.svg" alt="TravelHug Logo" className="" />
            </div>
            <div className="mt-3 text-teal-100">Next-level getaways start here. Plan, book, and explore with confidence.</div>
            {/* <a href="tel:18002228888" className="mt-4 inline-flex items-center gap-2 font-semibold"><Phone size={18} /> 1-800-222-8888</a> */}
          </div>
          {/* <Col title="Support"  links={["Forum support","Help Center","Safety information","Security","Change logs"]} />
          <Col title="Company"  links={["About Us","Community Blog","Jobs & Careers","Contact Us","Our Awards"]} />
          <Col title="Services" links={["Tour Booking","Trip Planning","Hotel Booking","Rental Services"]} /> */}
          <div className="flex flex-col justify-center" id="contact">
            <div className="font-semibold mb-3">Contact Us</div>
            <ul className="space-y-2 text-teal-100">
              <li>Email: support@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-teal-600 mt-2 py-6 text-sm flex items-center justify-between">
          <span>© {new Date().getFullYear()} TravelHug. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
