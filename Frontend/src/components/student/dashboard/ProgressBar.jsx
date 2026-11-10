// src/components/student/dashboard/ProgressBar.jsx
export default function ProgressBar({ value = 0 }) {
  const persen = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <span
      className="sd-progress"
      role="progressbar"
      aria-valuenow={persen}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="sd-progress-fill" style={{ width: `${persen}%` }} />
    </span>
  );
}