export default function PalmTree({ flipped = false }) {
  return (
    <svg width="180" height="180" viewBox="0 0 200 200" style={{ transform: flipped ? "scaleX(-1)" : undefined }} fill="none">
      <path d="M110 200c-10-40 0-90 0-90" stroke="#0f766e" strokeWidth="6" />
      <path d="M110 110c20-20 50-25 70-10-15 5-35 20-45 35" stroke="#065f46" strokeWidth="6" />
      <path d="M110 110c-20-20-50-25-70-10 15 5 35 20 45 35" stroke="#065f46" strokeWidth="6" />
    </svg>
  );
}
