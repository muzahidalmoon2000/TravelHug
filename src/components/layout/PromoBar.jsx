import Container from "../ui/Container.jsx";
import { Mail } from "lucide-react";

export default function PromoBar() {
  return (
    <div className="w-full bg-teal-800 text-white text-sm py-2">
      <Container className="flex items-center justify-between">
        <span>Deal of the week: up to 30% off ✨</span>
        <a href="mailto:hello@travelhug.com" className="inline-flex items-center gap-2 hover:underline">
          <Mail size={16} /> hello@travelhug.com
        </a>
      </Container>
    </div>
  );
}
