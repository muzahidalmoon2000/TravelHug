export default function Chip({ children, color = "slate" }) {
  const map = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${map[color]}`}>
      {children}
    </span>
  );
}
