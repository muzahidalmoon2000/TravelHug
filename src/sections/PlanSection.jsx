// src/sections/PlanSection.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import { getLastPlan } from "./HeroPlanner.jsx";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import ExtraInfoSection from "./ExtraInfoSection.jsx";
// import InfoModal from "./InfoModal.jsx";
import {
  Clock3,
  BadgeDollarSign,
  MapPin,
  Edit3,
  Sparkles,
  Landmark,
  Cloud,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Gauge,
  Eye,
  CloudRain,
  Thermometer
} from "lucide-react";

/** Design tokens */
const c = {
  bg: "#FFEFE5",
  card: "#FFFFFF",
  border: "#EFE7E1",
  borderSoft: "#E6E1DC",
  teal: "#0F766E",
  tealSoft: "#FEF6EE",
  tealSide: "#E7F8FB",
  tealSideBorder: "#BEE7F1",
  tealMustBorder: "#BDE6DE",
  orange: "#ED6F2E",
  pill: "#F6F2EE",
  text: "#0F172A",
  sub: "#475569",
};

const TABS = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
  { label: "Weather", value: "weather" },
];

/* ------------ API -> UI helpers ------------ */
function splitCards(block) {
  if (!block) return { must: [], side: [] };
  const must = (block.must_do || []).map((m) => ({
    kind: "must",
    title: m.title,
    blurb: m.activity,
    duration: m.duration,
    price: m.price || (m.is_free ? "Free" : undefined),
    map: m.map_location,
  }));
  const side = (block.side_activities || []).map((s) => ({
    kind: "side",
    title: s.title,
    blurb: s.activity,
    duration: s.duration,
    price: s.price || (s.is_free ? "Free" : undefined),
    map: s.map_location,
  }));
  return { must, side };
}

function dayLabel(idx) {
  return `Day ${idx + 1}`;
}
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ------------ Component ------------ */
export default function PlanSection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fromState = state?.plan ?? null;
  const fromStorage = !fromState ? safeParse(getLastPlan()) : null;
  const plan = fromState || fromStorage;

  useEffect(() => {
    if (!plan) navigate("/", { replace: true });
  }, [plan, navigate]);
  if (!plan) return null;

  // supports both shapes: {plan:{...}} or flat
  const root = plan?.plan ?? plan;

  const itinerary = root?.itinerary;
  const destination = itinerary?.destination || root?.preferences?.destination || "—";
  const days = itinerary?.days || [];
  const firstDayDate = days[0]?.day_date ? formatDate(days[0].day_date) : "";

  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState("morning");

  const underlineIndex = TABS.findIndex((t) => t.value === tab);
  const underlineLeft = `${(underlineIndex / TABS.length) * 100}%`;
  const underlineWidth = `${(1 / TABS.length) * 100}%`;

  const dayData = days[activeDay] || {};
  const morning = useMemo(() => splitCards(dayData.morning), [dayData]);
  const afternoon = useMemo(() => splitCards(dayData.afternoon), [dayData]);
  const evening = useMemo(() => splitCards(dayData.evening), [dayData]);
   const [extrasOpen, setExtrasOpen] = useState(false);
  const [activeExtra, setActiveExtra] = useState(null); // 'get_in' | 'core_insights' | 'local_events' | 'useful_links' | 'packing'
  const weather = dayData.weather;

  // Images for hero slider (supports both shapes just in case)
  const heroImages =
    Array.isArray(root?.destination_images) ? root.destination_images :
    Array.isArray(root?.itinerary?.destination_images) ? root.itinerary.destination_images :
    [];


  const intro =
    (tab === "morning" && dayData.morning?.description) ||
    (tab === "afternoon" && dayData.afternoon?.description) ||
    (tab === "evening" && dayData.evening?.description) ||
    itinerary?.title ||
    `Your personalized plan for ${destination}.`;

    const extras = {
    get_in: root?.get_in,
    core_insights: root?.core_insights,
    local_events: root?.local_events || [],
    useful_links: root?.useful_links || [],
    packing: root?.packing_recommendations,
  };


  const panelLeftTitle = "Food & Culture";
  const panelLeftBody =
    dayData.notes?.lunch_suggestion ||
    dayData.notes?.breakfast_suggestion ||
    "Local food & culture highlights for this day.";

  const panelRightTitle = tab === "weather" ? "Weather Tips" : "Travel Tips";
  const panelRightBody =
    (tab !== "weather" &&
      (dayData.morning?.weather_tips ||
        dayData.afternoon?.weather_tips ||
        dayData.evening?.weather_tips)) ||
    weatherTipsFrom(weather) ||
    "Carry water, sunscreen, and respect local customs.";

  // pick the right set for the tab
  const dataForTab =
    tab === "morning" ? morning : tab === "afternoon" ? afternoon : evening;

// Hero Images Start

// --- Drop-in replacement for HeroImageCarousel (4-across, infinite, draggable) ---
function HeroImageCarousel({ images = [], destination }) {
  const VISIBLE = 4; // how many tiles are visible at once
  const STEP = 1;    // move by 1 image

  const list = React.useMemo(
    () => images.filter(Boolean),
    [images]
  );

  // No images -> nothing to show
  if (!list.length) return null;

  // If <= 4 images, show static row (still with 20px gaps)
  if (list.length <= VISIBLE) {
    // pad to 4 so layout stays consistent
    const padded = [...list];
    while (padded.length < VISIBLE) padded.push(null);

    return (
      <div className="mt-2 w-full overflow-hidden rounded-2xl">
        <div className="flex">
          {padded.map((src, i) => (
            <div
              key={i}
              className="basis-1/4 shrink-0 grow-0 px-2.5"
            >
              <div className="h-40 md:h-56 overflow-hidden rounded-xl bg-neutral-200">
                {src && (
                  <img
                    src={src}
                    alt={`${destination || "Destination"} photo ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Infinite carousel setup: [last 4, ...list, first 4] ---
  const extended = React.useMemo(() => {
    const head = list.slice(0, VISIBLE);
    const tail = list.slice(-VISIBLE);
    return [...tail, ...list, ...head];
  }, [list]);

  const count = list.length;

  // index = left-most visible tile in `extended`
  const [index, setIndex] = React.useState(VISIBLE);
  const [transition, setTransition] = React.useState(true);

  // drag state
  const drag = React.useRef({
    active: false,
    startX: 0,
    dx: 0,
  });

  const containerRef = React.useRef(null);

  // --- Autoplay ---
  const AUTOPLAY_MS = 5000;
  const RESUME_DELAY_MS = 2500;
  const timerRef = React.useRef(null);
  const resumeRef = React.useRef(null);

  const stopAutoplay = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  }, []);

  const startAutoplay = React.useCallback(
    (delay = AUTOPLAY_MS) => {
      stopAutoplay();
      timerRef.current = setInterval(() => {
        setTransition(true);
        setIndex((i) => i + STEP);
      }, delay);
    },
    [stopAutoplay]
  );

  const pauseAndResume = React.useCallback(() => {
    stopAutoplay();
    resumeRef.current = setTimeout(
      () => startAutoplay(AUTOPLAY_MS),
      RESUME_DELAY_MS
    );
  }, [startAutoplay, stopAutoplay]);

  const go = React.useCallback(
    (delta, { user = true } = {}) => {
      if (user) pauseAndResume();
      setTransition(true);
      setIndex((i) => i + delta * STEP);
    },
    [pauseAndResume]
  );

  React.useEffect(() => {
    startAutoplay(AUTOPLAY_MS);

    const onVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay(AUTOPLAY_MS);
    };

    window.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopAutoplay();
      window.removeEventListener("visibilitychange", onVisibility);
    };
  }, [startAutoplay, stopAutoplay]);

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Handle seamless wrap when we cross into clones
  const onTransitionEnd = () => {
    if (index < VISIBLE) {
      // went into left clones -> jump right by `count`
      setTransition(false);
      setIndex(index + count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransition(true))
      );
    } else if (index >= count + VISIBLE) {
      // went into right clones -> jump left by `count`
      setTransition(false);
      setIndex(index - count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransition(true))
      );
    }
  };

  // --- Dragging with pointer events ---
  const onPointerDown = (e) => {
    pauseAndResume();
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.dx = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.startX;
    if (transition) setTransition(false);
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    const dx = drag.current.dx;
    drag.current.active = false;
    drag.current.dx = 0;
    setTransition(true);

    const threshold = 40; // px
    if (Math.abs(dx) > threshold) {
      go(dx < 0 ? 1 : -1);
    } else {
      setIndex((i) => i); // snap back
    }
  };

  // --- Transform calculation ---
  const containerWidth =
    containerRef.current?.offsetWidth || 1;

  const dragShiftPct =
    drag.current.active && containerWidth
      ? (drag.current.dx / containerWidth) * 100
      : 0;

  const style = {
    // each tile is 25% of width -> 100 / VISIBLE
    transform: `translateX(calc(-${
      index * (100 / VISIBLE)
    }% + ${dragShiftPct}%))`,
    transition: transition ? "transform 0.45s ease" : "none",
  };

  return (
    <div
      ref={containerRef}
      className="relative mt-2 w-full overflow-hidden rounded-2xl select-none"
      onMouseEnter={stopAutoplay}
      onMouseLeave={pauseAndResume}
      onFocus={stopAutoplay}
      onBlur={pauseAndResume}
    >
      {/* Track */}
      <div
        className="flex"
        style={style}
        onTransitionEnd={onTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {extended.map((src, i) => (
          <div
            key={i}
            className="basis-1/4 shrink-0 grow-0 px-2.5"
          >
            <div className="h-40 md:h-56 overflow-hidden rounded-xl bg-neutral-200">
              <img
                src={src}
                alt={`${destination || "Destination"} photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}


// Hero images End

  return (
    <section id="plan" style={{ background: c.bg }}>
      <Container>

        <div className="py-10">
        {heroImages.length > 0 && (
          <HeroImageCarousel images={heroImages} destination={destination} />
        )}
          {/* Title */}
          <h3
            className="text-[28px] sm:text-[32px] font-extrabold text-[#187A85]"
          >
            {destination
              ? `${destination} – ${days.length}-Day Travel Plan`
              : "Travel Plan"}
          </h3>
          <div
            className="mt-1 text-[18px] font-semibold"
            style={{ color: c.orange }}
          >
            {formatDate(dayData.day_date)}
          </div>
          {/* Days bar */}
          <div className="mt-5 w-full">
            <div
              className="rounded-[12px] border p-3 flex flex-wrap gap-3"
              style={{ borderColor: c.border, background: c.card }}
            >
              {days.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className="px-6 h-10 rounded-[5px] text-[15px] font-semibold border transition"
                  style={{
                    background: activeDay === i ? c.teal : c.pill,
                    color: activeDay === i ? "#fff" : "#0F172A",
                    borderColor: activeDay === i ? c.teal : c.borderSoft,
                  }}
                >
                  {dayLabel(i)}
                </button>
              ))}
            </div>
          </div>

          {/* Feature card (tabs + content) */}
          <div
            className="mt-4 rounded-[12px] border overflow-hidden"
            style={{ borderColor: c.border, background: c.card }}
          >
            {/* Sub-tabs */}
            <div className="px-6 pt-3">
              <div className="relative flex">
                {TABS.map((t) => {
                  const active = t.value === tab;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTab(t.value)}
                      className={`flex-1 py-3 text-[15px] font-semibold transition ${
                        active ? "text-[#0F766E]" : "text-[#94A3B8]"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
                <div
                  className="absolute left-0 right-0 bottom-0 h-[3px]"
                  style={{ background: c.border }}
                />
                <div
                  className="absolute bottom-0 h-[3px] rounded-full transition-all duration-200"
                  style={{
                    background: c.orange,
                    left: underlineLeft,
                    width: underlineWidth,
                  }}
                />
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-6 pb-6">
              {/* Intro */}
              <div>
                <div className="font-semibold" style={{ color: c.text }}>
                  {dayData.title || `Day ${activeDay + 1}`}
                </div>
                <p
                  className="mt-1 max-w-4xl leading-relaxed"
                  style={{ color: c.sub }}
                >
                  {intro}
                </p>
              </div>

              {tab === "weather" ? (
                <WeatherBoard
                  destination={destination}
                  date={dayData.day_date}
                  w={weather}
                />
              ) : (
                <>
                  {/* Must-Do row */}
                  <h4 className="mt-6 mb-2 text-slate-700 font-semibold flex items-center gap-2">
                    <Sparkles size={16} className="text-[#0F766E]" /> Must-Do
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dataForTab.must.length > 0 ? (
                      dataForTab.must.map((card, i) => (
                        <ActivityCard key={`must-${tab}-${i}`} {...card} />
                      ))
                    ) : (
                      <EmptyHint text="No must-do activities provided for this block." />
                    )}
                  </div>

                  {/* Side-Activities row */}
                  <h4 className="mt-6 mb-2 text-slate-700 font-semibold flex items-center gap-2">
                    <Landmark size={16} className="text-[#0F766E]" /> Side
                    Activities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dataForTab.side.length > 0 ? (
                      dataForTab.side.map((card, i) => (
                        <ActivityCard key={`side-${tab}-${i}`} {...card} />
                      ))
                    ) : (
                      <EmptyHint text="No side activities provided for this block." />
                    )}
                  </div>

                  {/* Panels */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Panel title={panelLeftTitle} body={panelLeftBody} />
                    <Panel title={panelRightTitle} body={panelRightBody} />
                  </div>
                </>
              )}
            </div>
          </div>
                    {/* NEW: Trip extras section */}
          <ExtraInfoSection
            destination={destination}
            extras={extras}
            open={extrasOpen}
            onToggle={() => setExtrasOpen((v) => !v)}
            onCardClick={(kind) => setActiveExtra(kind)}
          />
        </div>
      </Container>
            {/* NEW: modal for the extras cards */}
      {/* <InfoModal
        destination={destination}
        extras={extras}
        kind={activeExtra}
        onClose={() => setActiveExtra(null)}
      /> */}
    </section>
  );
}

/* ------------ Weather board (app-like) ------------ */
function WeatherBoard({ destination, date, w }) {
  if (!w) {
    return (
      <div className="mt-4 rounded-[12px] border border-[#EFE7E1] p-6 bg-[#F8FEFF]">
        <p className="text-slate-600">No weather data for this day.</p>
      </div>
    );
  }



  
  const hi = isNum(w.temp_max) ? Math.round(w.temp_max) : "—";
  const lo = isNum(w.temp_min) ? Math.round(w.temp_min) : "—";
  const rain = isNum(w.chance_rain) ? Math.round(w.chance_rain) : "—";
  const wind = isNum(w.wind_speed_kph) ? Math.round(w.wind_speed_kph) : "—";
  const humid = isNum(w.humidity) ? Math.round(w.humidity) : "—";
  const press = isNum(w.pressure_mb) ? Math.round(w.pressure_mb) : "—";
  const vis = isNum(w.visibility_km) ? Math.round(w.visibility_km) : "—";
  const cloud = isNum(w.cloud_cover) ? Math.round(w.cloud_cover) : "—";
  const precip = isNum(w.precip_mm) ? Math.round(w.precip_mm) : "—";

  return (
    <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Left: hero summary */}
      <div className="xl:col-span-1 rounded-[12px] border" style={{ borderColor: c.border, background: c.tealSoft }}>
        <div className="p-5">
          <div className="text-slate-600 text-sm">{destination} · {formatDate(date)}</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="rounded-2xl bg-white/70 p-3 border" style={{ borderColor: c.tealMustBorder }}>
              <Cloud size={42} className="text-[#0F766E]" />
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900">{hi}°C</div>
              <div className="text-slate-600">Low {lo}°C</div>
            </div>
          </div>
          <div className="mt-3 text-slate-700 font-medium">{w.summary || w.condition || "—"}</div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <MiniStat icon={<CloudRain size={16} />} label="Rain" value={`${rain}%`} />
            <MiniStat icon={<Droplets size={16} />} label="Humidity" value={`${humid}%`} />
            <MiniStat icon={<Wind size={16} />} label="Wind" value={`${wind} kph`} />
            <MiniStat icon={<Gauge size={16} />} label="Pressure" value={`${press} mb`} />
          </div>
        </div>
      </div>

      {/* Right: details grid */}
      <div className="xl:col-span-2 rounded-[12px] border bg-white" style={{ borderColor: c.border }}>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailTile icon={<Sunrise size={18} />} title="Sunrise" value={w.sunrise || "—"} />
          <DetailTile icon={<Sunset size={18} />} title="Sunset" value={w.sunset || "—"} />
          <DetailTile icon={<Thermometer size={18} />} title="Feels Like" value={isNum(w.feels_like_c) ? `${Math.round(w.feels_like_c)}°C` : "—"} />
          <DetailTile icon={<Eye size={18} />} title="Visibility" value={`${vis} km`} />
          <DetailTile icon={<Cloud size={18} />} title="Cloud Cover" value={`${cloud}%`} />
          <DetailTile icon={<CloudRain size={18} />} title="Precipitation" value={`${precip} mm`} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/70 border px-3 py-2" style={{ borderColor: c.tealMustBorder }}>
      <div className="text-[#0F766E]">{icon}</div>
      <div className="text-sm">
        <div className="text-slate-500">{label}</div>
        <div className="font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
function DetailTile({ icon, title, value }) {
  return (
    <div className="rounded-xl border p-3 bg-[#F9FAFB]" style={{ borderColor: c.border }}>
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <span className="text-[#0F766E]">{icon}</span> {title}
      </div>
      <div className="mt-1 text-slate-900 font-semibold">{value}</div>
    </div>
  );
}

/* ------------ Pieces (activity rows) ------------ */
function ActivityCard({ kind = "must", title, blurb, duration, price, map }) {
  const isMust = kind === "must";
  const bg = isMust ? c.tealSoft : c.tealSide;
  const border = isMust ? c.tealMustBorder : c.tealSideBorder;
  const Icon = isMust ? Sparkles : Landmark;

  return (
    <div
      className="rounded-[12px] overflow-hidden"
      style={{ background: bg }}
    >
      <div className="px-3 pt-3 flex items-center justify-between">
        {/* <div className="flex items-center gap-2 text-sm text-[#0B3F3B]">
          <Icon size={16} className="text-[#0F766E]" />
          <span className="font-semibold">{isMust ? "Must-Do" : "Side Activity"}</span>
        </div> */}
        {/* <button
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-white px-3 py-1 rounded-full"
          style={{ background: c.orange }}
        >
          <Edit3 size={14} /> Modify
        </button> */}
      </div>

      <div className="px-3 pb-3">
        <div className="mt-1 font-semibold" style={{ color: c.teal }}>
          {title}
        </div>
        {blurb && (
          <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
            {blurb}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} /> {duration || "1–2 hours"}
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeDollarSign size={14} /> {price || "Free or small entry fee"}
          </span>
          <span className="inline-flex items-center gap-1">
            {map ? (
              <a
                href={map}
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-1 bg-amber-600 p-2 rounded-full"
              >
                <MapPin size={14} color="white" />
              </a>
            ) : (
              <MapPin size={14} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, body }) {
  return (
    <div
      className="rounded-[12px] border bg.white"
      style={{ borderColor: c.border }}
    >
      <div className="px-4 py-3 flex items-center gap-2">
        {title?.toLowerCase().includes("weather") ? (
          <Cloud size={18} className="text-[#0F766E]" />
        ) : null}
        <span className="font-semibold" style={{ color: c.text }}>
          {title}
        </span>
      </div>
      <div
        className="px-4 pb-4 text-[14px] leading-relaxed"
        style={{ color: c.sub }}
      >
        {body}
      </div>
    </div>
  );
}

/* ------------ utils ------------ */
function isNum(n) {
  return typeof n === "number" && !isNaN(n);
}
function safeParse(s) {
  try {
    return JSON.parse(s || "null");
  } catch {
    return null;
  }
}

/** Build a friendly tip from the weather record (dynamic from plan data) */
function weatherTipsFrom(w) {
  if (!w) return null;

  const parts = [];

  if (isNum(w.temp_min) && isNum(w.temp_max)) {
    parts.push(`Temps ${Math.round(w.temp_min)}–${Math.round(w.temp_max)}°C`);
  }

  if (isNum(w.chance_rain)) {
    const chance = Math.round(w.chance_rain);
    parts.push(
      chance >= 40
        ? "Pack a light rain jacket/umbrella"
        : chance > 0
        ? "Low rain chance—bring a compact umbrella just in case"
        : "No rain expected"
    );
  }

  if (isNum(w.wind_speed_kph)) {
    const wind = Math.round(w.wind_speed_kph);
    parts.push(wind >= 20 ? "Windy—cap/hood helps" : "Light winds");
  }

  if (isNum(w.humidity)) {
    const h = Math.round(w.humidity);
    parts.push(h >= 75 ? "Humid—carry water" : "Comfortable humidity");
  }

  // Fall back to the API summary/condition
  if (w.summary || w.condition) parts.unshift(w.summary || w.condition);

  return parts.join(" · ");
}

/* ------------ small UI piece ------------ */
function EmptyHint({ text }) {
  return (
    <div className="rounded-lg border border-dashed p-4 text-sm text-slate-500 bg-[#FAFAFA]">
      {text}
    </div>
  );
}
