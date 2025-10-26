// src/sections/PlanSection.jsx
import { useMemo, useState } from "react";
import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import Chip from "../components/ui/Chip.jsx";
import {
  MapPin,
  Clock3,
  BadgeDollarSign,
  Wand2,
  Edit3,
} from "lucide-react";
import { sampleDays, sampleActivities, sampleTips } from "../data/itinerary.js";

export default function PlanSection() {
  const [activeDay, setActiveDay] = useState(0);
  const [slot, setSlot] = useState("morning"); // morning | evening | weather

  return (
    <section id="plan" className="bg-[#FFEFE5]">
      <Container>
        <div className="py-10">
          {/* Header */}
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Phuket, Thailand – 5-Day Travel Plan
              </h3>
              <div className="mt-1 text-[#ED6F2E] font-semibold">
                14 September 2025
              </div>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="mt-4 bg-white/80 rounded-xl border border-[#EFE7E1] p-2">
            <div className="flex flex-wrap gap-2">
              {sampleDays.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(i)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition border ${
                    activeDay === i
                      ? "bg-[#0F766E] text-white border-[#0F766E]"
                      : "bg-white text-slate-700 border-[#E6E1DC] hover:border-slate-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Slot tabs with underline slider */}
            <div className="mt-4 px-2">
              <div className="relative flex items-center text-sm font-semibold text-slate-500">
                {["Morming", "Morning", "Evening", "Weather"].map((label, idx) => (
                  <button
                    key={label}
                    onClick={() =>
                      setSlot(idx === 3 ? "weather" : idx === 2 ? "evening" : "morning")
                    }
                    className={`px-4 py-3 relative ${
                      (slot === "morning" && (idx === 1 || idx === 0)) ||
                      (slot === "evening" && idx === 2) ||
                      (slot === "weather" && idx === 3)
                        ? "text-[#0F766E]"
                        : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {/* underline */}
                <div
                  className="absolute bottom-0 h-[3px] bg-[#ED6F2E] rounded-full transition-all"
                  style={{
                    width:
                      slot === "morning" ? "88px" : slot === "evening" ? "76px" : "82px",
                    left:
                      slot === "morning" ? "96px" : slot === "evening" ? "196px" : "284px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="mt-6">
            <div className="text-slate-900 font-semibold">
              Discovering Phuket, Thailand
            </div>
            <p className="text-slate-600 mt-1 max-w-3xl">
              Start with a stroll through Old Town, where colorful Sino-Portuguese
              buildings, cafés, and the scent of fresh desserts fill the air.
              Listen to the quiet morning and the gentle hum of scooters waking the city.
            </p>
          </div>

          {/* Activity Grid */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getItemsFor(slot).map((it, i) => (
              <ActivityCard
                key={i + it.title}
                variant={i < 3 ? "must" : "side"}
                {...it}
              />
            ))}
          </div>

          {/* Bottom tips row */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel
              title="Food & Culture"
              body="Start with a Thai iced coffee and roti pancake from a local beach stall."
            />
            <Panel
              title="Weather Tips"
              body="As the evening cools down, bring a light jacket. Skies are clear; great for sunset photos."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Helpers */
function getItemsFor(slot) {
  if (slot === "weather") {
    // reuse tips as “cards”
    return sampleTips.map((t) => ({
      title: t.title,
      area: t.area,
      cost: "",
      duration: "",
    }));
  }
  // take 6 sample activities for morning/evening
  const list = slot === "evening" ? sampleActivities.slice(2) : sampleActivities;
  return list.slice(0, 6).map((x) => ({ ...x, duration: "1–2 hours" }));
}

/* UI Pieces */
function ActivityCard({ title, area, cost, duration, variant = "must" }) {
  const tone =
    variant === "must"
      ? "bg-[#E7FAF7] border-[#BDE6DE]"
      : "bg-[#E7F8FB] border-[#BEE7F1]";

  const label =
    variant === "must" ? (
      <>
        <Wand2 size={16} className="text-[#0F766E]" />
        <span className="font-semibold">Must-Do</span>
      </>
    ) : (
      <>
        <Wand2 size={16} className="text-[#0F766E]" />
        <span className="font-semibold">Side Activities</span>
      </>
    );

  return (
    <div className={`rounded-xl border ${tone} p-0 overflow-hidden`}>
      {/* Header */}
      <div className="px-3 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-800">{label}</div>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#ED6F2E] px-3 py-1 rounded-full">
          <Edit3 size={14} /> Modify
        </button>
      </div>

      {/* Body */}
      <div className="px-3 pb-3">
        <div className="mt-1 text-[#0F766E] font-semibold underline cursor-pointer">
          {title}
        </div>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
          Browse highlights and hidden gems around {area}. Perfect for this time
          slot — easy to reach and crowd-friendly.
        </p>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} />
            {duration || "1–2 hours"}
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeDollarSign size={14} />
            {cost || "Free, but donations are welcome"}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            Easy to access
          </span>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, body }) {
  return (
    <Card className="p-0 overflow-hidden">
      <details open className="group">
        <summary className="list-none flex items-center gap-2 px-4 py-3 bg-white">
          <span className="font-semibold">{title}</span>
        </summary>
        <div className="px-4 pb-4 text-slate-600">{body}</div>
      </details>
    </Card>
  );
}
