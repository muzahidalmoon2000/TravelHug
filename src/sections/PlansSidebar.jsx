// PlansSidebar.jsx
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import apiClient from "../api";
import { setLastPlan } from "../sections/HeroPlanner.jsx";

/** Public component you render from pages */
export default function PlansSidebar({
  open,
  onClose,
  title = "Your Plans",
  accent = "from-teal-500 via-emerald-500 to-cyan-500",
  widthClass = "max-w-lg",
}) {
  return (
    <SideDrawer open={open} onClose={onClose} title={title} accent={accent} widthClass={widthClass}>
      <div className="-mx-4">
        <PlanList onSelected={onClose} />
      </div>
    </SideDrawer>
  );
}

/* ========================= Drawer (inline) ========================= */
function SideDrawer({ open, onClose, title, accent, widthClass, children }) {
  const panelRef = useRef(null);

  // esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  // focus on open
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // swipe to close (mobile)
  const drag = useRef({ startX: 0, dx: 0, active: false });
  const threshold = 80;
  const onTouchStart = (e) => {
    drag.current.active = true;
    drag.current.startX = e.touches[0].clientX;
    drag.current.dx = 0;
  };
  const onTouchMove = (e) => {
    if (!drag.current.active) return;
    drag.current.dx = Math.min(0, e.touches[0].clientX - drag.current.startX);
  };
  const onTouchEnd = () => {
    const shouldClose = Math.abs(drag.current.dx) > threshold;
    drag.current.active = false;
    drag.current.dx = 0;
    if (shouldClose) onClose?.();
  };
  const translate = drag.current.active ? `translateX(${drag.current.dx}px)` : undefined;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          open ? "opacity-100 backdrop-blur-[2px] bg-black/40" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
        className={`fixed right-0 top-0 z-[61] h-dvh w-full ${widthClass}
          bg-white/95 supports-[backdrop-filter]:backdrop-blur
          shadow-[0_10px_40px_-5px_rgba(0,0,0,0.35)]
          border-l border-slate-200 outline-none
          transition-transform duration-300 will-change-transform
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ transform: open ? translate : undefined }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* header */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${accent} opacity-10`} />
          <div className="flex items-center justify-between px-5 py-4">
            <h2 id="drawer-title" className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="group rounded-full border border-slate-200 bg-white/80 p-2 backdrop-blur hover:bg-white hover:shadow"
              aria-label="Close drawer"
              title="Close"
            >
              <X className="h-5 w-5 text-slate-700 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
          <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />
        </div>

        {/* content */}
        <div className="flex h-[calc(100dvh-64px)] flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        </div>

        {/* subtle edge glow */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-l from-transparent to-black/5" />
      </aside>
    </>
  );
}

/* ========================= Plan List (inline) ========================= */
function PlanList({ onSelected }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiClient.get("/api/v1/planner/plans");
        if (alive) setPlans(res.data || []);
      } catch (e) {
        console.error("Error fetching plans:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const openPlan = async (planId) => {
    try {
      const res = await apiClient.get(`/api/v1/planner/plan/${planId}`);
      const fullPlan = res.data;
      console.log(fullPlan);
      setLastPlan(fullPlan); // use your exported in-memory store
      navigate("/plan", { state: { plan: fullPlan } });
      onSelected?.(); // close the sidebar
    } catch (e) {
      console.error("Error fetching plan:", e);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <SkelCard />
        <SkelCard />
        <SkelCard />
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="p-6 text-center text-slate-500">
        No plans yet.
        <div className="mt-2 text-sm">Create one from the homepage to see it here.</div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50">
      <div className="px-4">
        <div className="grid grid-cols-1 gap-3">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => openPlan(p.id)}
              className="group text-left bg-gray-100 rounded-[8px] cursor-pointer hover:shadow-md transition p-4"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base text-[#187A85] font-semibold">{p.title || "Untitled Plan"}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-700" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* small helpers */
function SkelCard() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-16 rounded-lg bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
