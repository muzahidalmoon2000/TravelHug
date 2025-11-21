import React from "react";
import ReactMarkdown from "react-markdown";
import {
  MapPin,
  Sparkles,
  Landmark,
  Cloud,
  Gauge
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

function ExtraInfoSection({ destination, extras }) {
  const { get_in, core_insights, local_events = [], useful_links = [], packing } =
    extras || {};

  const hasAny =
    get_in ||
    core_insights ||
    (local_events?.length ?? 0) > 0 ||
    (useful_links?.length ?? 0) > 0 ||
    packing;

  if (!hasAny) return null;

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-[#0F172A]">
            Trip extras &amp; practical info
          </h4>
          <p className="text-sm text-slate-500">
            Getting in, city context, events, useful links and packing advice – all tailored
            to this itinerary.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {get_in && (
          <SectionCard
            icon={<MapPin size={18} className="text-[#0F766E]" />}
            title={`Getting in & around ${destination}`}
            description="Arrival options, entry tips and how to move around once you land."
          >
            {renderGetIn(get_in)}
          </SectionCard>
        )}

        {core_insights && (
          <SectionCard
            icon={<Sparkles size={18} className="text-[#0F766E]" />}
            title={`${destination}: Core insight`}
            description="A short story of the city – past, present and future."
          >
            {renderCoreInsights(core_insights)}
          </SectionCard>
        )}

        {local_events.length > 0 && (
          <SectionCard
            icon={<Landmark size={18} className="text-[#0F766E]" />}
            title="Local events & festivals"
            description="Things happening in and around your travel window."
          >
            {renderLocalEvents(local_events)}
          </SectionCard>
        )}

        {useful_links.length > 0 && (
          <SectionCard
            icon={<Cloud size={18} className="text-[#0F766E]" />}
            title="Useful links"
            description="Official sites, passes and travel tools saved for this trip."
          >
            {renderUsefulLinks(useful_links)}
          </SectionCard>
        )}

        {packing && (
          <SectionCard
            icon={<Gauge size={18} className="text-[#0F766E]" />}
            title="Packing recommendations"
            description="What to bring based on your weather and activities."
          >
            {renderPacking(packing)}
          </SectionCard>
        )}
      </div>
    </div>
  );
}

/* ---------- small Markdown helper ---------- */

function MarkdownBlock({ source }) {
  if (!source || !String(source).trim()) return null;
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}

/* ---------- section wrappers ---------- */

function SectionCard({ icon, title, description, children }) {
  return (
    <div
      className="rounded-2xl bg-white"
    >
      <div
        className="border-b px-4 py-3 flex items-center gap-2"
        style={{ borderColor: c.borderSoft }}
      >
        <span className="rounded-full bg-[#E7F8FB] p-2">{icon}</span>
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="px-4 py-4 text-sm text-slate-700">{children}</div>
    </div>
  );
}

/* ---------- render helpers (now Markdown-aware) ---------- */

function renderCoreInsights(core_insights) {
  if (!core_insights) {
    return (
      <p className="text-sm text-slate-600">
        No core insight available for this destination.
      </p>
    );
  }

  // If backend sends GitHub MD text, render it directly
  if (typeof core_insights === "string") {
    return <MarkdownBlock source={core_insights} />;
  }

  // Fallback to old behavior (if it's not a string for some reason)
  const lines = String(core_insights).split("\n");
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-2" />;
        if (line.startsWith("## ")) {
          return (
            <h3
              key={idx}
              className="mt-2 text-base font-semibold text-slate-900"
            >
              {line.replace(/^##\s*/, "")}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="mt-3 text-lg font-bold text-slate-900"
            >
              {line.replace(/^#\s*/, "")}
            </h2>
          );
        }
        const cleaned = line.replace(/[*`_]/g, "");
        return <p key={idx}>{cleaned}</p>;
      })}
    </div>
  );
}

function renderGetIn(get_in) {
  if (!get_in) {
    return (
      <p className="text-sm text-slate-600">
        No arrival information available for this trip.
      </p>
    );
  }

  // If backend sends GitHub MD text, render it directly
  if (typeof get_in === "string") {
    return <MarkdownBlock source={get_in} />;
  }

  // Object-based structure: each field can also contain Markdown
  const sections = [
    { label: "Summary", value: get_in.summary },
    { label: "By air", value: get_in.by_air },
    { label: "By land", value: get_in.by_land },
    { label: "By sea", value: get_in.by_sea },
    { label: "Visa tips", value: get_in.visa_tips },
    { label: "Internal transfers", value: get_in.internal_transfers },
  ].filter((s) => s.value && s.value.trim().length);

  const points = (get_in.local_entry_points || []).filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-700">
      {sections.map((s) => (
        <div
          key={s.label}
          className="space-y-1 bg-[#f3f3f3] p-3 rounded-lg"
          style={{ borderColor: c.border }}
        >
          <h3 className="text-sm font-semibold text-slate-900">
            {s.label}
          </h3>

          {/* ⬇️ Render each field as GitHub-style Markdown */}
          <div className="mt-1 prose prose-sm max-w-none text-slate-700">
            <ReactMarkdown>{s.value}</ReactMarkdown>
          </div>
        </div>
      ))}

      {points.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Key entry points
          </h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {points.map((p, idx) => (
              <li key={idx}>
                <ReactMarkdown>{p}</ReactMarkdown>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


function renderLocalEvents(local_events) {
  const events = local_events || [];
  if (!events.length) {
    return (
      <p className="text-sm text-slate-600">
        No local events saved for this trip.
      </p>
    );
  }

  // If backend now returns a single Markdown string, handle that too
  if (typeof events === "string") {
    return <MarkdownBlock source={events} />;
  }

  // Existing card layout (unchanged)
  return (
    <div className="grid gap-4">
      {events.map((ev, idx) => (
        <div
          key={idx}
          className="rounded-xl border bg-[#F9FAFB] p-4"
          style={{ borderColor: c.border }}
        >
          <div className="text-sm font-semibold text-slate-900">
            {ev.name}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {ev.when} · {ev.where}
          </div>
          {ev.note && (
            <p className="mt-2 text-sm text-slate-700">{ev.note}</p>
          )}
          {ev.url && (
            <a
              href={ev.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-semibold text-[#0F766E] underline"
            >
              More details
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function renderUsefulLinks(useful_links) {
  const links = useful_links || [];
  if (!links.length) {
    return (
      <p className="text-sm text-slate-600">
        No links saved for this trip.
      </p>
    );
  }

  // If backend sends Markdown string instead of array
  if (typeof links === "string") {
    return <MarkdownBlock source={links} />;
  }

  // Existing list layout
  return (
    <ul className="space-y-3 text-sm">
      {links.map((ln, idx) => (
        <li
          key={idx}
          className="rounded-xl border bg-[#F9FAFB] p-3"
          style={{ borderColor: c.border }}
        >
          <a
            href={ln.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0F766E] underline"
          >
            {ln.title || ln.url}
          </a>
          {ln.url && (
            <div className="mt-1 break-all text-xs text-slate-500">
              {ln.url}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function renderPacking(packing) {
  if (!packing) {
    return (
      <p className="text-sm text-slate-600">
        No packing advice generated for this trip.
      </p>
    );
  }

  // If backend sends Markdown string, render directly
  if (typeof packing === "string") {
    return <MarkdownBlock source={packing} />;
  }

  // Existing grouped card layout
  const groups = [
    { key: "essentials", label: "Essentials", items: packing.essentials || [] },
    { key: "clothing", label: "Clothing", items: packing.clothing || [] },
    { key: "extras", label: "Extras", items: packing.extras || [] },
  ].filter((g) => g.items.length);

  return (
    <div className="space-y-5 text-sm leading-relaxed text-slate-700">
      {groups.map((group) => (
        <div key={group.key}>
          <h3 className="text-[15px] font-semibold text-slate-900">
            {group.label}
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {group.items.map((it, idx) => (
              <li
                key={idx}
                className="rounded-lg border bg-[#F9FAFB] px-3 py-2"
                style={{ borderColor: c.border }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#187A85]">
                    {it.item}
                  </span>
                  {/* {it.quantity && (
                    <span className="text-[11px] text-slate-500">
                      {it.quantity}
                    </span>
                  )} */}
                </div>
                {it.reason && (
                  <p className="mt-1 text-xs text-slate-600">
                    {it.reason}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ExtraInfoSection;
