import { useState } from "react";
import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import PillButton from "../components/ui/PillButton.jsx";
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  Search,
  User,
  Minus,
  Plus,
} from "lucide-react";
import PalmTree from "../assets/PalmTree.jsx";

export default function HeroPlanner() {
  return (
    <div className="relative overflow-hidden bg-[#FFF3EA]">
      {/* palms */}
      <div className="pointer-events-none absolute -left-10 bottom-8 opacity-80 hidden lg:block">
        <PalmTree />
      </div>
      <div className="pointer-events-none absolute -right-10 bottom-8 opacity-80 hidden lg:block">
        <PalmTree flipped />
      </div>

      <Container>
        <div className="py-10 sm:py-14 flex flex-col items-center">
          {/* search + form */}
          <PlannerForm />

          {/* cartoony car */}
          <div className="mt-8">
            <CarDoodle />
          </div>
        </div>
      </Container>

      {/* grass strip */}
      <div className="h-8 bg-[#CDE8B0]" />
    </div>
  );
}

function PlannerForm() {
  const [people, setPeople] = useState(4);

  return (
    <div className="w-full max-w-2xl">
      {/* search bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input
          placeholder="Search …"
          className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-[#EDE8E3] shadow-sm placeholder:text-slate-400"
        />
      </div>

      <Card className="mt-3 p-3 sm:p-4 bg-transparent border-0 shadow-none">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* dates */}
          <Field icon={<Calendar size={18} />} label="Start date">
            <input
              type="date"
              className="w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] px-3"
            />
          </Field>

          <Field icon={<Calendar size={18} />} label="End date">
            <input
              type="date"
              className="w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] px-3"
            />
          </Field>

          {/* selects */}
          <SelectLike label="Choose Trip Type">
            <select className="appearance-none w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] pl-3 pr-9">
              <option>Leisure</option>
              <option>Business</option>
              <option>Backpacking</option>
            </select>
          </SelectLike>

          {/* people stepper */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-600"> </span>
            <div className="w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] px-2 flex items-center justify-between">
              <button
                type="button"
                className="p-2 rounded-full border border-[#EDE8E3] text-slate-700"
                onClick={() => setPeople((n) => Math.max(1, n - 1))}
                aria-label="decrease"
              >
                <Minus size={16} />
              </button>
              <div className="flex items-center gap-2 text-slate-700">
                <User size={18} className="text-slate-400" />
                <span className="font-medium">{people} Person</span>
              </div>
              <button
                type="button"
                className="p-2 rounded-full border border-[#EDE8E3] text-slate-700"
                onClick={() => setPeople((n) => n + 1)}
                aria-label="increase"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <SelectLike label="Choose Trip Budget">
            <select className="appearance-none w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] pl-3 pr-9">
              <option>Budget</option>
              <option>Mid-range</option>
              <option>Luxury</option>
            </select>
          </SelectLike>

          <SelectLike label="Preference">
            <select className="appearance-none w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] pl-3 pr-9">
              <option>Nature</option>
              <option>Culture</option>
              <option>Adventure</option>
            </select>
          </SelectLike>
        </form>

        {/* CTA */}
        <div className="flex justify-center mt-4">
          <PillButton className="bg-[#ED6F2E] hover:bg-[#e36522] h-12 rounded-[10px] w-72">
            Create Plan <ChevronRight size={18} />
          </PillButton>
        </div>
      </Card>
    </div>
  );
}

function Field({ icon, label, children }) {
  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-xs text-slate-600">{label}</label>
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

function SelectLike({ label, children }) {
  return (
    <div className="relative flex flex-col gap-1">
      <label className="text-xs text-slate-600">{label}</label>
      <div className="relative">
        {children}
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

/** simple doodle to echo the screenshot */
function CarDoodle() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="26" y="62" width="60" height="26" rx="6" fill="#55C3C8" stroke="#2F8D93" strokeWidth="3" />
      <rect x="38" y="50" width="24" height="12" rx="3" fill="#A6E7EA" stroke="#2F8D93" strokeWidth="3" />
      <rect x="64" y="50" width="14" height="12" rx="3" fill="#A6E7EA" stroke="#2F8D93" strokeWidth="3" />
      <circle cx="42" cy="92" r="9" fill="#2E2E2E" />
      <circle cx="42" cy="92" r="4" fill="#8C8C8C" />
      <circle cx="70" cy="92" r="9" fill="#2E2E2E" />
      <circle cx="70" cy="92" r="4" fill="#8C8C8C" />
      <rect x="52" y="37" width="28" height="10" rx="2" fill="#86BF3E" stroke="#5A8F23" strokeWidth="3" />
      <rect x="44" y="29" width="28" height="10" rx="2" fill="#F39C34" stroke="#C77717" strokeWidth="3" />
      <rect x="56" y="21" width="20" height="10" rx="2" fill="#E55B4D" stroke="#B43E34" strokeWidth="3" />
      <path d="M25 95c-5 0-8-2-9-4" stroke="#8C8C8C" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
