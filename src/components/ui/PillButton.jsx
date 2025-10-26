export default function PillButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-white font-semibold bg-orange-500 hover:bg-orange-600 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
