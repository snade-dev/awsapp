import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

const teacherLinks = [
  { to: "/enseignant", label: "Tableau de bord", end: true },
  { to: "/enseignant/quiz", label: "Quiz" },
  { to: "/enseignant/etudiants", label: "Etudiants" },
  { to: "/enseignant/resultats", label: "Resultats" }
];

const studentLinks = [
  { to: "/etudiant", label: "Accueil", end: true },
  { to: "/etudiant/session", label: "Passer un quiz" }
];

export function AppLayout({ role, title, description }) {
  const { data, auth, logout } = useAppData();
  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <div className="mx-auto w-[min(1200px,calc(100%-24px))] py-6 md:py-10">
      <header className="mb-6 rounded-[32px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-lagoon">{role === "teacher" ? "Plateforme enseignant" : "Plateforme etudiant"}</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-none md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-10 items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Connecte: {auth.name || (role === "teacher" ? "Enseignant" : "Etudiant")}
              </span>
              <Link
                to={role === "teacher" ? "/etudiant" : "/enseignant"}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/12"
              >
                {role === "teacher" ? "Aller a l'espace etudiant" : "Aller a l'espace enseignant"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/12"
              >
                Se deconnecter
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong className="block font-display text-2xl">{data.quizzes.length}</strong>Quiz</div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong className="block font-display text-2xl">{data.students.length}</strong>Etudiants</div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong className="block font-display text-2xl">{data.results.length}</strong>Copies</div>
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 font-semibold transition ${
                  isActive ? "bg-clay text-white" : "bg-slate-900/8 text-slate-700 hover:bg-slate-900/12"
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
