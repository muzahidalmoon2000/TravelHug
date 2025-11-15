// src/sections/HeroPlanner.jsx
import { useState, useRef, useEffect } from "react";
import Container from "../components/ui/Container.jsx";
import {
  Calendar,
  Search,
  User,
  Minus,
  Plus,
  ChevronDown,
  Check,
} from "lucide-react";
import apiClient from "../api.js";
import heroBg from "../assets/image.png";
import { useNavigate } from "react-router-dom";

/** Static trip types */
const TRIP_MODES = ["solo", "family", "partner", "friends"];
let plans = null

export default function HeroPlanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#FFF3EA",
        backgroundImage: `url(${heroBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
        minHeight: "600px",
      }}
    >
      <Container>
        <div className="relative z-10 py-10 sm:py-14 flex flex-col items-center">
          <style>{`
            /* Hide the native calendar icon and placeholder text until value exists */
            .clean-date::-webkit-calendar-picker-indicator { display: none; }
            .clean-date.no-value::-webkit-datetime-edit { color: transparent; }
            .clean-date.no-value::-webkit-datetime-edit-year-field,
            .clean-date.no-value::-webkit-datetime-edit-month-field,
            .clean-date.no-value::-webkit-datetime-edit-day-field { color: transparent; }
            .clean-date.no-value { color: transparent; }
            .clean-date.has-value { color: #0f172a; }
          `}</style>
          <PlannerForm />
        </div>
      </Container>
      <div className="h-16 sm:h-20" />
    </section>
  );
}

function PlannerForm() {
  // values
  const [tripMode, setTripMode] = useState("");
  const [people, setPeople] = useState(4);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // meta
  const [travelTypes, setTravelTypes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [budgetId, setBudgetId] = useState("");
  const navigate = useNavigate();

  // preference (multi)
  const [selectedPrefIds, setSelectedPrefIds] = useState([]);
  const togglePref = (id) =>
    setSelectedPrefIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // place search
  const [query, setQuery] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const searchBoxRef = useRef(null);
  const debounceRef = useRef(null);


  // validation messages
  const [errs, setErrs] = useState({
    place: "",
    start: "",
    end: "",
    tripMode: "",
    budget: "",
  });

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errorOverlay, setErrorOverlay] = useState({
    show: false,
    message: "Something went wrong",
  });
  const lastBodyRef = useRef(null); // keep last request body for retry

  // today (yyyy-mm-dd) from LOCAL time (avoid UTC shift)
  const toLocalYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = toLocalYMD(new Date());

  // make end min = start (if set), otherwise today
  const endMin = start || todayStr;

  // adjust people control when trip type changes
  useEffect(() => {
    if (tripMode === "solo") setPeople(1);
    else if (tripMode === "partner") setPeople(2);
    else if (people < 1) setPeople(1);
  }, [tripMode]); // eslint-disable-line

  // load meta
  useEffect(() => {
    (async () => {
      try {
        const [{ data: t }, { data: b }] = await Promise.all([
          apiClient.get("/api/v1/meta/travel-types"),
          apiClient.get("/api/v1/meta/budgets"),
        ]);
        setTravelTypes(Array.isArray(t?.items) ? t.items : []);
        setBudgets(Array.isArray(b?.items) ? b.items : []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // debounced places
  useEffect(() => {
    if (!query || selectedPlace?.name === query) {
      setPlaceResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await apiClient.get(
          `/api/v1/places/search?q=${encodeURIComponent(query)}`
        );
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        setPlaceResults(list.slice(0, 10));
        setPlacesOpen(true);
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, selectedPlace]);

  // close suggestions on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target)) setPlacesOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // validate fields and return boolean
  const validate = () => {
    const next = { place: "", start: "", end: "", tripMode: "", budget: "" };

    if (!selectedPlace) next.place = "Please select a destination.";
    if (!start) next.start = "Please choose a start date.";
    else if (start < todayStr) next.start = "Start date cannot be in the past.";

    if (!end) next.end = "Please choose an end date.";
    else if (end < start) next.end = "End date cannot be before start date.";

    if (!tripMode) next.tripMode = "Please choose a trip type.";
    if (!budgetId) next.budget = "Please choose a trip budget.";

    setErrs(next);
    return Object.values(next).every((m) => !m);
  };

  // submit
  const onSubmit = async () => {
    setOkMsg("");
    if (!validate()) return;

    // if preferences exist, use first as travel_type; otherwise omit field
    const firstPref = travelTypes.find(
      (t) => String(t.id) === String(selectedPrefIds[0])
    );
    const budget = budgets.find((b) => String(b.id) === String(budgetId));

    const body = {
      travel_type: (firstPref?.slug || firstPref?.label || "")
        .toString()
        .toLowerCase(),
      budget_type: (budget?.slug || budget?.label || "")
        .toString()
        .toLowerCase(),
      person_count: tripMode === "solo" ? 1 : tripMode === "partner" ? 2 : people,
      start_date: start,
      end_date: end,
      destination: selectedPlace?.name || "",
      latitude: selectedPlace?.latitude ?? selectedPlace?.lat ?? null,
      longitude: selectedPlace?.longitude ?? selectedPlace?.lng ?? null,
    };
    console.log("Submitting plan:", body);
    lastBodyRef.current = body; // save for retry
    await createPlan(body);
  };

  const createPlan = async (body) => {
        try {
      setSubmitting(true);
      const response = await apiClient.post("/api/v1/planner/plan", body);
      setOkMsg("Plan created successfully.");

      const plan = response.data;

      // Save so /plan works even on hard refresh
      // localStorage.setItem("lastPlan", JSON.stringify(plan));

      plans = plan;
      console.log("Created plan:", plans);
      // Also pass via router state for immediate render
      navigate("/plan", { state: { plan }, replace: true });
    } catch (e) {
      console.log("Create plan:", body);
      console.log("Error response:",lastBodyRef.current);
      setOkMsg("");
      console.error(e?.response?.data || e.message);
    setErrorOverlay({
        show: true,
        message:
          "Something went wrong. Please try again.", // mask internal errors
      });
    } finally {
      setSubmitting(false);
    }
  }



    // retry handler for the overlay
  const handleRetry = async () => {
    setErrorOverlay((s) => ({ ...s, show: false }));
    if (lastBodyRef.current) {
      await createPlan(lastBodyRef.current);
    }
  };

  // UI helpers
  const stepperDisabled = tripMode === "solo" || tripMode === "partner";

  return (
    <>
      {/* Loader overlay shown WHILE creating plan */}
      <LoadingOverlay
        show={submitting}
        quoteTop="Good trips are planned."
        quoteBottom="Great trips are created."
        backgroundImage={heroBg}
      />

                  {/* Error overlay with Try Again */}
            <ErrorOverlay
              show={errorOverlay.show}
              message={errorOverlay.message}
              backgroundImage={heroBg}
              onRetry={handleRetry}
              onClose={() => setErrorOverlay((s) => ({ ...s, show: false }))}
            />

      <div className="w-full max-w-2xl">
        {/* Destination search */}
        <div className="relative" ref={searchBoxRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </div>
          <input
            value={selectedPlace ? selectedPlace.name : query}
            onChange={(e) => {
              setSelectedPlace(null);
              setQuery(e.target.value);
              if (errs.place) setErrs((s) => ({ ...s, place: "" }));
            }}
            onFocus={() => query && setPlacesOpen(true)}
            placeholder="Search …"
            className={`w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border ${
              errs.place ? "border-red-400" : "border-[#EDE8E3]"
            } placeholder:text-slate-400`}
          />
          {placesOpen && placeResults.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full bg-white border border-[#EDE8E3] rounded-[10px] max-h-64 overflow-auto shadow-sm">
              {placeResults.map((p, i) => (
                <li
                  key={`${p.id ?? p.name}-${i}`}
                  className="px-3 py-2 hover:bg-[#FFF3EA] cursor-pointer"
                  onClick={() => {
                    setSelectedPlace(p);
                    setQuery(p.name || "");
                    setPlacesOpen(false);
                    if (errs.place) setErrs((s) => ({ ...s, place: "" }));
                  }}
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errs.place && <p className="text-red-600 text-xs mt-1">{errs.place}</p>}

        <form
          className="mt-3 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <MergedDateRange
            onStartChange={(v) => {
              setStart(v);
              if (errs.start) setErrs((s) => ({ ...s, start: "" }));
              if (end && end < v) {
                setErrs((s) => ({
                  ...s,
                  end: "End date cannot be before start date.",
                }));
              } else if (errs.end) {
                setErrs((s) => ({ ...s, end: "" }));
              }
            }}
            onEndChange={(v) => {
              setEnd(v);
              if (start && v && v < start) {
                setErrs((s) => ({
                  ...s,
                  end: "End date cannot be before start date.",
                }));
              } else if (errs.end) {
                setErrs((s) => ({ ...s, end: "" }));
              }
            }}
            start={start}
            end={end}
            startMin={todayStr}
            endMin={endMin}
            errStart={errs.start}
            errEnd={errs.end}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Trip Type */}
            <SimpleSelect
              value={tripMode}
              onChange={(v) => {
                setTripMode(v);
                if (errs.tripMode) setErrs((s) => ({ ...s, tripMode: "" }));
              }}
              placeholder="Choose Trip Type"
              options={TRIP_MODES.map((m) => ({ value: m, label: capital(m) }))}
              error={errs.tripMode}
            />

            {/* People stepper (disabled for solo/partner) */}
            <div>
              <div
                className={`w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] px-2 flex items-center justify-between ${
                  stepperDisabled ? "opacity-60" : ""
                }`}
              >
                <button
                  type="button"
                  className="w-8 h-8 grid place-items-center rounded-full border border-[#EDE8E3] bg-[#EFEFEF]"
                  onClick={() =>
                    !stepperDisabled && setPeople((n) => Math.max(1, n - 1))
                  }
                  disabled={stepperDisabled}
                  aria-disabled={stepperDisabled}
                >
                  <Minus size={16} />
                </button>
                <div className="flex items-center gap-2 text-slate-700">
                  <User size={18} className="text-slate-400" />
                  <span className="font-medium">
                    {tripMode === "solo" ? 1 : tripMode === "partner" ? 2 : people}{" "}
                    Person
                  </span>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 grid place-items-center rounded-full border border-[#EDE8E3] bg-[#EFEFEF]"
                  onClick={() => !stepperDisabled && setPeople((n) => n + 1)}
                  disabled={stepperDisabled}
                  aria-disabled={stepperDisabled}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Budget */}
            <SimpleSelect
              value={budgetId}
              onChange={(v) => {
                setBudgetId(v);
                if (errs.budget) setErrs((s) => ({ ...s, budget: "" }));
              }}
              placeholder="Budget"
              options={budgets.map((b) => ({ value: b.id, label: b.label }))}
              error={errs.budget}
            />

            {/* Preference (optional multi) */}
            <PreferenceMulti
              items={travelTypes}
              value={selectedPrefIds}
              onToggle={togglePref}
              placeholder="Preference (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-[4px] bg-[#ED6F2E] hover:bg-[#e36522] disabled:opacity-70 text-white font-semibold mt-1"
          >
            {submitting ? "Creating…" : "Create Plan"}
          </button>

          {okMsg && <div className="text-green-700 text-sm mt-2">{okMsg}</div>}
        </form>
      </div>
    </>
  );
}

/* ---------- date range with inline errors ---------- */
function MergedDateRange({
  start,
  end,
  onStartChange,
  onEndChange,
  startMin,
  endMin,
  errStart,
  errEnd,
}) {
  const startRef = useRef(null);
  const endRef = useRef(null);
  const openPicker = (ref) => {
    if (!ref?.current) return;
    try {
      if (typeof ref.current.showPicker === "function") ref.current.showPicker();
      else ref.current.focus();
    } catch {
      ref.current.focus();
    }
  };

  return (
    <div>
      <div className="h-12 w-full rounded-[10px] bg-white border border-[#EDE8E3] overflow-hidden">
        <div className="relative h-full grid grid-cols-2">
          <div className="relative" onClick={() => openPicker(startRef)}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0723E] pointer-events-none">
              <Calendar size={18} />
            </div>
            {!start && (
              <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-700">
                Start date
              </span>
            )}
            <input
              ref={startRef}
              type="date"
              min={startMin}
              value={start}
              onChange={(e) => onStartChange(e.target.value)}
              className={`clean-date ${
                start ? "has-value" : "no-value"
              } w-full h-full pl-9 pr-3 bg-transparent outline-none border-0 pointer-events-none`}
            />
          </div>

          <div className="relative" onClick={() => openPicker(endRef)}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0723E] pointer-events-none">
              <Calendar size={18} />
            </div>
            {!end && (
              <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-slate-700">
                End date
              </span>
            )}
            <input
              ref={endRef}
              type="date"
              min={endMin}
              value={end}
              onChange={(e) => onEndChange(e.target.value)}
              className={`clean-date ${
                end ? "has-value" : "no-value"
              } w-full h-full pl-9 pr-3 bg-transparent outline-none border-0 pointer-events-none`}
            />
          </div>
        </div>
      </div>

      {(errStart || errEnd) && (
        <div className="grid grid-cols-2 gap-3 mt-1">
          <p className="text-red-600 text-xs">{errStart}</p>
          <p className="text-red-600 text-xs">{errEnd}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- simple select with error ---------- */
function SimpleSelect({ value, onChange, placeholder, options, error }) {
  return (
    <div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`appearance-none w-full h-12 rounded-[10px] bg-white border ${
            error ? "border-red-400" : "border-[#EDE8E3]"
          } pl-3 pr-9 text-slate-700`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ---------- preference multi (optional) ---------- */
function PreferenceMulti({ items, value, onToggle, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = items.filter((it) => value.includes(it.id));
  const count = selected.length;
  const labelText = count ? `${count} selected` : placeholder;
  const titleText = count ? selected.map((it) => it.label).join(", ") : "";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 rounded-[10px] bg-white border border-[#EDE8E3] pl-3 pr-9 text-left"
        title={titleText}
      >
        <span
          className={`${count ? "text-slate-700" : "text-slate-500"} block truncate`}
        >
          {labelText}
        </span>
      </button>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-[10px] border border-[#EDE8E3] bg-white shadow-sm">
          {items.map((it) => {
            const checked = value.includes(it.id);
            return (
              <label
                key={it.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#FFF3EA] cursor-pointer"
              >
                <input type="checkbox" checked={checked} onChange={() => onToggle(it.id)} />
                <span className="flex-1">{it.label}</span>
                {checked && <Check size={16} className="text-[#0F766E]" />}
              </label>
            );
          })}
          {items.length === 0 && (
            <div className="px-3 py-2 text-slate-500">No options</div>
          )}
        </div>
      )}
      {/* preference is optional → no error text */}
    </div>
  );
}

/* ---------- Loading Overlay (3-ball Newton's cradle) ---------- */
function LoadingOverlay({ show, quoteTop, quoteBottom, backgroundImage }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(255,243,234,0.92), rgba(255,243,234,0.92)), url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      {/* Animation styles */}
      <style>{`

        .ball{
            position: relative;
            transform-origin: 50% -100px;/* x axis y axis*/
        }

        .ball::before{
            content: '';
            position: absolute;
            width: 1px;
            height: 100px;
            background-color: white;
            top: -100px;
            left: 50%;
        }

        .ball--start{
            animation: start 0.8s infinite alternate;
        }
        .ball--end{
            animation: end 0.8s infinite 0.8s alternate;
        }
        @keyframes start {
            0%, 50%{
                transform: rotate(0);
            }
            100%{
                transform: rotate(30deg);
            }
        }
        @keyframes end {
            0%, 50%{
                transform: rotate(0);
            }
            100%{
                transform: rotate(-30deg);
            }
        }
      `}</style>

      <div className="flex flex-col items-center px-6 text-center">
          <div className="lan mb-2 w-[250px]">
          <div className="bar w-[100%] h-[10px] bg-amber-500 rounded-[8px]"></div>
          <div className="balls mt-[100px] flex">
            <div className="ball ball--start bg-amber-600 w-[50px] h-[50px] rounded-[50%]"></div>
            <div className="ball bg-amber-600 w-[50px] h-[50px] rounded-[50%]"></div>
            <div className="ball bg-amber-600 w-[50px] h-[50px] rounded-[50%]"></div>
            <div className="ball bg-amber-600 w-[50px] h-[50px] rounded-[50%]"></div>
            <div className="ball ball--end bg-amber-600 w-[50px] h-[50px] rounded-[50%]"></div>
          </div>
        </div>

        {/* Quote */}
        <p className="mt-6 text-slate-700 text-base sm:text-lg font-medium leading-snug">
          {quoteTop}<br />{quoteBottom}
        </p>
      </div>
    </div>
  );
}

/* ---------- Error Overlay with “Try Again” ---------- */
function ErrorOverlay({ show, message, onRetry, onClose, backgroundImage }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Request error"
      style={{
        backgroundImage: `linear-gradient(rgba(255,243,234,0.92), rgba(255,243,234,0.92)), url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm border border-[#F2E8E2] rounded-2xl shadow-lg w-[90%] max-w-md px-6 py-6 text-center">
        <h3 className="text-slate-800 font-extrabold text-xl">Something went wrong</h3>
        <p className="mt-2 text-slate-600">{message}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="h-11 px-5 rounded-[6px] bg-[#ED6F2E] hover:bg-[#e36522] text-white font-semibold"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="h-11 px-4 rounded-[6px] border border-[#E5DED8] text-slate-700 font-semibold bg-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


/* util */
function capital(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}



export function setLastPlan(plan) {
  plans = plan;
}

export function getLastPlan() {
  if (plans) {
    return JSON.stringify(plans);
  } else {
    return null;
  }
}