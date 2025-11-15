import {
  MapPin,
  Sparkles,
  Landmark,
  Cloud,
  Gauge
} from "lucide-react";

function ExtraInfoSection({ destination, extras, open, onToggle, onCardClick }) {
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
  const hasAny =
    extras?.get_in ||
    extras?.core_insights ||
    (extras?.local_events?.length ?? 0) > 0 ||
    (extras?.useful_links?.length ?? 0) > 0 ||
    extras?.packing;

  if (!hasAny) return null;

  const cards = [
    {
      key: "get_in",
      title: "Getting in & around",
      label: destination,
      hint:
        extras.get_in?.summary ||
        extras.get_in?.by_air ||
        "How to reach the city and move around once you’re there.",
      icon: <MapPin size={18} className="text-[#0F766E]" />,
      disabled: !extras.get_in,
    },
    {
      key: "core_insights",
      title: "Core insight",
      label: destination,
      hint: "A quick story of the city: past, present and what’s changing.",
      icon: <Sparkles size={18} className="text-[#0F766E]" />,
      disabled: !extras.core_insights,
    },
    {
      key: "local_events",
      title: "Local events",
      label: `${extras.local_events?.length || 0} suggestions`,
      hint:
        extras.local_events?.[0]?.name ||
        "What’s happening around your travel dates.",
      icon: <Landmark size={18} className="text-[#0F766E]" />,
      disabled: (extras.local_events?.length || 0) === 0,
    },
    {
      key: "useful_links",
      title: "Useful links",
      label: `${extras.useful_links?.length || 0} saved`,
      hint:
        extras.useful_links?.[0]?.title ||
        "Official transport, passes & travel tools.",
      icon: <Cloud size={18} className="text-[#0F766E]" />,
      disabled: (extras.useful_links?.length || 0) === 0,
    },
    {
      key: "packing",
      title: "Packing list",
      label: "Essentials, clothing & extras",
      hint: "What to bring for this weather and itinerary.",
      icon: <Gauge size={18} className="text-[#0F766E]" />,
      disabled: !extras.packing,
    },
  ];

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-[#0F172A]">
            You've unlocked the next chapter of your journey
          </h4>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="mt-2 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold text-[#0F766E] shadow-sm bg-white hover:bg-slate-50"
        >
          {open ? "Hide" : "See more"}
        </button>
      </div>

      {open && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <button
              key={card.key}
              type="button"
              disabled={card.disabled}
              onClick={() => !card.disabled && onCardClick(card.key)}
              className={`group flex flex-col items-start rounded-2xl border bg-white px-4 py-3 text-left transition hover:shadow-md ${
                card.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              style={{ borderColor: c.border }}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E7F8FB] p-2">
                  {card.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


export default ExtraInfoSection;