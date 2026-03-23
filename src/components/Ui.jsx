export function StatsCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-teal-900/5 bg-white/80 p-5">
      <span className="block font-display text-4xl font-extrabold">{value}</span>
      <span className="text-slate-600">{label}</span>
    </div>
  );
}

export function SectionHeading({ kicker, title, badge }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-lagoon">{kicker}</p>
        <h2 className="mt-2 font-display text-3xl font-bold">{title}</h2>
      </div>
      {badge ? <span className="inline-flex w-fit items-center rounded-full bg-clay/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-clay">{badge}</span> : null}
    </div>
  );
}

export function Field({ label, className = "", children }) {
  return (
    <label className={`grid gap-2 font-semibold text-slate-700 ${className}`}>
      {label}
      {children}
    </label>
  );
}

export function Badge({ mode, children }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-bold ${mode === "exam" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
      {children}
    </span>
  );
}

export function EmptyState({ message, className = "" }) {
  return <div className={`rounded-3xl border border-dashed border-slate-300 px-5 py-6 text-center text-slate-500 ${className}`}>{message}</div>;
}
