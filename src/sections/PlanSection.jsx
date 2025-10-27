// src/sections/PlanSection.jsx
import { useState } from "react";
import Container from "../components/ui/Container.jsx";
import {
  Clock3,
  BadgeDollarSign,
  MapPin,
  Edit3,
  Sparkles,
  Landmark,
} from "lucide-react";

/** Design tokens */
const c = {
  bg: "#FFEFE5",
  card: "#FFFFFF",
  border: "#EFE7E1",
  borderSoft: "#E6E1DC",
  teal: "#0F766E",
  tealSoft: "#E7FAF7",
  tealSide: "#E7F8FB",
  tealSideBorder: "#BEE7F1",
  tealMustBorder: "#BDE6DE",
  orange: "#ED6F2E",
  pill: "#F6F2EE",
  text: "#0F172A",
  sub: "#475569",
};

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
const TABS = ["Mormimg", "Morning", "Evening", "Weather"];

/** Mock cards (swap with your data) */
const CARDS = [
  { kind: "must", title: "Notre-Dame Cathedral Visit", blurb: "Start your day with a visit to the historic Notre-Dame Cathedral, taking in its Gothic architecture and learning about its rich history. The clear morning light adds to the beauty of the cathedral’s stained glass windows." },
  { kind: "must", title: "Notre-Dame Cathedral Visit", blurb: "Start your day with a visit to the historic Notre-Dame Cathedral, taking in its Gothic architecture and learning about its rich history. The clear morning light adds to the beauty of the cathedral’s stained glass windows." },
  { kind: "must", title: "Notre-Dame Cathedral Visit", blurb: "Start your day with a visit to the historic Notre-Dame Cathedral, taking in its Gothic architecture and learning about its rich history. The clear morning light adds to the beauty of the cathedral’s stained glass windows." },
  { kind: "side", title: "Riverbank Bookstalls", blurb: "Browse the historic riverbank bookstalls, known as “bouquinistes”, which offer a wide range of books, souvenirs, and collectibles. The morning is a great time to avoid crowds." },
  { kind: "side", title: "Riverbank Bookstalls", blurb: "Browse the historic riverbank bookstalls, known as “bouquinistes”, which offer a wide range of books, souvenirs, and collectibles. The morning is a great time to avoid crowds." },
  { kind: "side", title: "Riverbank Bookstalls", blurb: "Browse the historic riverbank bookstalls, known as “bouquinistes”, which offer a wide range of books, souvenirs, and collectibles. The morning is a great time to avoid crowds." },
];

export default function PlanSection() {
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState("morning"); // morning | evening | weather

  // underline position (4 equal tabs → 25% each)
  const tabIndex = tab === "morning" ? 1 : tab === "evening" ? 2 : 3; // keep index 1 for "Morning"
  const underlineLeft = `${(tabIndex / 4) * 100}%`;
  const underlineWidth = "25%";

  return (
    <section id="plan" style={{ background: c.bg }}>
      <Container>
        <div className="py-10">
          {/* Title */}
          <h3 className="text-[28px] sm:text-[32px] font-extrabold" style={{ color: c.text }}>
            Phuket, Thailand – 5-Day Travel Plan
          </h3>
          <div className="mt-1 text-[18px] font-semibold" style={{ color: c.orange }}>
            14 September 2025
          </div>

          {/* DAYS BAR – full width */}
          <div className="mt-5 w-full">
            <div className="rounded-[12px] border p-3 flex flex-wrap gap-3" style={{ borderColor: c.border, background: c.card }}>
              {DAYS.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(i)}
                  className="px-6 h-10 rounded-full text-[15px] font-semibold border transition"
                  style={{
                    background: activeDay === i ? c.teal : c.pill,
                    color: activeDay === i ? "#fff" : "#0F172A",
                    borderColor: activeDay === i ? c.teal : c.borderSoft,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* FEATURE CARD – contains Morning/Evening/Weather tabs (full width) */}
          <div className="mt-4 rounded-[12px] border overflow-hidden" style={{ borderColor: c.border, background: c.card }}>
            {/* Sub-tabs header */}
            <div className="px-6 pt-3">
              <div className="relative flex">
                {TABS.map((label, i) => {
                  const target =
                    i === 3 ? "weather" : i === 2 ? "evening" : "morning";
                  const active =
                    (tab === "morning" && (i === 0 || i === 1)) ||
                    (tab === "evening" && i === 2) ||
                    (tab === "weather" && i === 3);
                return (
                  <button
                    key={label}
                    onClick={() => setTab(target)}
                    className={`flex-1 py-3 text-[15px] font-semibold transition ${
                      active ? "text-[#0F766E]" : "text-[#94A3B8]"
                    }`}
                  >
                    {label}
                  </button>
                )})}
                {/* gray line */}
                <div className="absolute left-0 right-0 bottom-0 h-px" style={{ background: c.border }} />
                {/* orange underline */}
                <div
                  className="absolute bottom-0 h-[3px] rounded-full transition-all duration-200"
                  style={{ background: c.orange, left: underlineLeft, width: underlineWidth }}
                />
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-6">
              {/* Intro */}
              <div>
                <div className="font-semibold" style={{ color: c.text }}>
                  Discovering Phuket, Thailand
                </div>
                <p className="mt-1 max-w-4xl leading-relaxed" style={{ color: c.sub }}>
                  Start with a stroll through Old Town, where colorful Sino-Portuguese buildings, cafés, and the scent of fresh desserts
                  fill the air. Listen to the quiet morning and the gentle hum of scooters waking the city.
                </p>
              </div>

              {/* Cards 3×2 */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCardsFor(tab).map((card, i) => (
                  <ActivityCard key={i} kind={card.kind} title={card.title} blurb={card.blurb} />
                ))}
              </div>

              {/* Bottom panels */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                <Panel title="Food & Culture" body="Start with a Thai iced coffee and roti pancake from a local beach stall." />
                <Panel
                  title="Weather Tips"
                  body="As the evening cools down, consider bringing a light jacket. Clear skies are perfect for sunset photos."
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Helpers */
function getCardsFor(tab) {
  if (tab === "weather") {
    return CARDS.slice(3, 6); // just show side-activity style under Weather (for symmetry)
  }
  if (tab === "evening") {
    return [...CARDS.slice(1, 3), ...CARDS.slice(3)]; // mix
  }
  return CARDS; // morning default
}

/* Pieces */
function ActivityCard({ kind = "must", title, blurb }) {
  const isMust = kind === "must";
  const bg = isMust ? c.tealSoft : c.tealSide;
  const border = isMust ? c.tealMustBorder : c.tealSideBorder;
  const Icon = isMust ? Sparkles : Landmark;

  return (
    <div className="rounded-[12px] border overflow-hidden" style={{ background: bg, borderColor: border }}>
      {/* header */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#0B3F3B]">
          <Icon size={16} className="text-[#0F766E]" />
          <span className="font-semibold">{isMust ? "Must-Do" : "Side Activities"}</span>
        </div>
        <button
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-white px-3 py-1 rounded-full"
          style={{ background: c.orange }}
        >
          <Edit3 size={14} /> Modify
        </button>
      </div>

      {/* content */}
      <div className="px-3 pb-3">
        <a className="mt-1 block font-semibold underline" style={{ color: c.teal }} href="#">
          {title}
        </a>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{blurb}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1"><Clock3 size={14} /> 1–2 hours</span>
          <span className="inline-flex items-center gap-1"><BadgeDollarSign size={14} /> Free, but donations are welcome</span>
          <span className="inline-flex items-center gap-1"><MapPin size={14} /> Easy to browse</span>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, body }) {
  return (
    <div className="rounded-[12px] border bg-white" style={{ borderColor: c.border }}>
      <div className="px-4 py-3 flex items-center gap-2">
        <span className="font-semibold" style={{ color: c.text }}>{title}</span>
      </div>
      <div className="px-4 pb-4 text-[14px] leading-relaxed" style={{ color: c.sub }}>{body}</div>
    </div>
  );
}
