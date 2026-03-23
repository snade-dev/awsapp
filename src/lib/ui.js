export const inputClassName = "rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20";

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
