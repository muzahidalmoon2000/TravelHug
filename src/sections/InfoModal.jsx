function InfoModal({ kind, extras, destination, onClose }) {
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
  if (!kind) return null;

  const { get_in, core_insights, local_events, useful_links, packing } =
    extras || {};

  let title = "";
  let description = "";

  if (kind === "get_in") {
    title = `Getting in & around ${destination}`;
    description =
      "Arrival options, entry tips and how to move around once you land.";
  } else if (kind === "core_insights") {
    title = `${destination}: Core insight`;
    description = "A short story of the city – past, present and future.";
  } else if (kind === "local_events") {
    title = "Local events & festivals";
    description = "Things happening in and around your travel window.";
  } else if (kind === "useful_links") {
    title = "Useful links";
    description = "Official sites, passes and travel tools saved for this trip.";
  } else if (kind === "packing") {
    title = "Packing recommendations";
    description = "What to bring based on your weather and activities.";
  }

  const renderCoreInsights = () => {
    if (!core_insights) {
      return (
        <p className="text-sm text-slate-600">
          No core insight available for this destination.
        </p>
      );
    }
    const lines = core_insights.split("\n");
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
  };

  const renderGetIn = () => {
    if (!get_in) {
      return (
        <p className="text-sm text-slate-600">
          No arrival information available for this trip.
        </p>
      );
    }
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
          <div key={s.label} className="space-y-1 bg-[#f5f5f5] p-3 rounded-lg" style={{ borderColor: c.border }}>
            <h3 className="text-sm font-semibold text-slate-900">
              {s.label}
            </h3>
            <p className="mt-1">{s.value}</p>
          </div>
        ))}
        {points.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Key entry points
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {points.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderLocalEvents = () => {
    const events = local_events || [];
    if (!events.length) {
      return (
        <p className="text-sm text-slate-600">
          No local events saved for this trip.
        </p>
      );
    }
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
  };

  const renderUsefulLinks = () => {
    const links = useful_links || [];
    if (!links.length) {
      return (
        <p className="text-sm text-slate-600">
          No links saved for this trip.
        </p>
      );
    }
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
  };

  const renderPacking = () => {
    if (!packing) {
      return (
        <p className="text-sm text-slate-600">
          No packing advice generated for this trip.
        </p>
      );
    }
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
                    <span className="font-semibold text-[#187A85]">{it.item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  let body = null;
  if (kind === "get_in") body = renderGetIn();
  else if (kind === "core_insights") body = renderCoreInsights();
  else if (kind === "local_events") body = renderLocalEvents();
  else if (kind === "useful_links") body = renderUsefulLinks();
  else if (kind === "packing") body = renderPacking();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div
          className="flex items-center justify-between border-b px-5 py-3"
          style={{ borderColor: c.border }}
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[76vh] overflow-y-auto px-5 py-4">
          {body}
        </div>
      </div>
    </div>
  );
}
export default InfoModal;