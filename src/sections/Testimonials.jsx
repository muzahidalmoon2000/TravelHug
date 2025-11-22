import React from "react";
import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Example data – replace with real testimonials if you have them
const TESTIMONIALS = [
  {
    id: 1,
    name: "User 1",
    role: "Traveler",
    text: "The best booking system. Helped me plan a perfect family trip.",
    avatar: "https://i.pravatar.cc/100?img=13",
    rating: 5,
  },
  {
    id: 2,
    name: "User 2",
    role: "Solo explorer",
    text: "Super smooth experience from search to final itinerary. Loved the suggestions.",
    avatar: "https://i.pravatar.cc/100?img=14",
    rating: 5,
  },
  {
    id: 3,
    name: "User 3",
    role: "Frequent flyer",
    text: "Smart, fast and easy to tweak. This has become my go-to trip planner.",
    avatar: "https://i.pravatar.cc/100?img=15",
    rating: 5,
  },
];

export default function Testimonials() {
  const items = TESTIMONIALS;
  const count = items.length;

  // If nothing or only one testimonial, just show a static card
  if (count <= 1) {
    const t = items[0];
    return (
      <section id="testimonials" className="py-12 bg-white">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              What people say about Us.
            </h2>
          </div>
          {t && (
            <Card className="max-w-xl mx-auto p-5">
              <TestimonialCard testimonial={t} />
            </Card>
          )}
        </Container>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-12 bg-white">
      <Container>
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What people say about Us.
          </h2>
        </div>
        <InfiniteTestimonialsSlider items={items} />
      </Container>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <>
      <div className="text-slate-700 text-sm sm:text-base">
        {testimonial.text}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={testimonial.avatar}
          alt={testimonial.name}
        />
        <div>
          <div className="text-sm font-semibold">{testimonial.name}</div>
          <div className="text-xs text-slate-500">{testimonial.role}</div>
        </div>
        <div className="ml-auto flex items-center gap-0.5 text-orange-500">
          {Array.from({ length: testimonial.rating }).map((_, j) => (
            <Star key={j} size={14} fill="currentColor" />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * Hook: how many cards should be visible based on screen width?
 * - 3 on desktop (>= 1024px)
 * - 2 on tablet (>= 640px)
 * - 1 on mobile (< 640px)
 */
function useVisibleCount() {
  const [visible, setVisible] = React.useState(1);

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisible(3);
      else if (w >= 640) setVisible(2);
      else setVisible(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return visible;
}

// --- Infinite slider (responsive: 1 / 2 / 3 visible, loop, autoplay) ---
function InfiniteTestimonialsSlider({ items }) {
  const baseVisible = useVisibleCount();
  const count = items.length;
  const visible = Math.min(baseVisible, count); // clamp if fewer items than slots

  // extended track: [last N, ...items, first N], where N = visible
  const extended = React.useMemo(() => {
    const tail = items.slice(-visible);
    const head = items.slice(0, visible);
    return [...tail, ...items, ...head];
  }, [items, visible]);

  const [index, setIndex] = React.useState(visible); // first real tile index
  const [transition, setTransition] = React.useState(true);

  // Reset index when visible count changes (e.g. resize from mobile -> desktop)
  React.useEffect(() => {
    setTransition(false);
    setIndex(visible);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setTransition(true))
    );
    return () => cancelAnimationFrame(id);
  }, [visible, count]);

  const AUTOPLAY_MS = 6000;
  const timerRef = React.useRef(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = React.useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setTransition(true);
      setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
  }, [clearTimer]);

  React.useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const go = (delta) => {
    clearTimer();
    setTransition(true);
    setIndex((i) => i + delta);
    startTimer();
  };

  const onTransitionEnd = () => {
    const firstReal = visible;
    const lastReal = visible + count - 1;

    if (index < firstReal) {
      // moved into left clones -> snap forward by count
      setTransition(false);
      setIndex(index + count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransition(true))
      );
    } else if (index > lastReal) {
      // moved into right clones -> snap back by count
      setTransition(false);
      setIndex(index - count);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransition(true))
      );
    }
  };

  // index of the "first visible real" item, for dots
  const currentRealIndex = React.useMemo(() => {
    if (!count) return 0;
    let real = (index - visible) % count;
    if (real < 0) real += count;
    return real;
  }, [index, visible, count]);

  const style = {
    transform: `translateX(-${(index * 100) / visible}%)`,
    transition: transition ? "transform 0.45s ease" : "none",
  };

  return (
    <div
      className="relative max-w-5xl mx-auto"
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <div className="overflow-hidden rounded-2xl">
        <div className="flex" style={style} onTransitionEnd={onTransitionEnd}>
          {extended.map((t, i) => (
            <div
              key={i}
              className="shrink-0 grow-0 px-2"
              style={{ flexBasis: `${100 / visible}%` }} // 1/visible width
            >
              <Card className="p-5 h-full flex flex-col justify-between">
                <TestimonialCard testimonial={t} />
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-[-18px] top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-[-18px] top-1/2 -translate-y-1/2 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-50"
        aria-label="Next testimonial"
      >
        <ChevronRight size={18} />
      </button>

      {/* dots */}
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, i) => {
          const active = i === currentRealIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                clearTimer();
                setTransition(true);
                setIndex(visible + i);
                startTimer();
              }}
              className={`h-2 rounded-full transition-all ${
                active ? "w-5 bg-slate-900" : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
