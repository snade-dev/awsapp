import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

const teacherLinks = [
  { to: "/enseignant", label: "Tableau de bord", end: true },
  { to: "/enseignant/quiz", label: "Quiz" },
  { to: "/enseignant/etudiants", label: "Etudiants" },
  { to: "/enseignant/resultats", label: "Resultats" },
];

const studentLinks = [{ to: "/etudiant", label: "Accueil", end: true }];

export function AppLayout({ role, title, description }) {
  const { data, auth, logout } = useAppData();
  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <div className="w-full px-4 py-6 md:px-8 md:py-8 xl:px-12">
      <header className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-(--shadow-soft) md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">
              {role === "teacher"
                ? "Plateforme enseignant"
                : "Plateforme etudiant"}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-none text-slate-900 md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Connecte:{" "}
                {auth.name || (role === "teacher" ? "Enseignant" : "Etudiant")}
              </span>
              {role === "teacher" ? (
                <Link
                  to="/etudiant"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-clay hover:text-clay"
                >
                  Aller a l'espace etudiant
                </Link>
              ) : null}
              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-clay hover:text-clay"
              >
                Se deconnecter
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
              <strong className="block font-display text-2xl text-clay">
                {data.quizzes.length}
              </strong>
              Quiz
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
              <strong className="block font-display text-2xl text-clay">
                {data.students.length}
              </strong>
              Etudiants
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
              <strong className="block font-display text-2xl text-clay">
                {data.results.length}
              </strong>
              Copies
            </div>
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 font-semibold transition ${
                  isActive
                    ? "bg-clay text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-clay hover:text-clay"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
