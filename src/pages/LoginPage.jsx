import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { inputClassName } from "../lib/ui";

export function LoginPage() {
  const { auth, login, isLoading } = useAppData();
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher");
  const [teacherForm, setTeacherForm] = useState({
    email: "dupont@quizcampus.fr",
    password: "prof1234"
  });
  const [studentForm, setStudentForm] = useState({
    email: "sarah.martin@campus.fr",
    password: "etud1234"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (auth.isAuthenticated) {
    return <Navigate to={auth.role === "teacher" ? "/enseignant" : "/etudiant"} replace />;
  }

  async function submitLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = role === "teacher"
        ? { role: "teacher", ...teacherForm }
        : { role: "student", ...studentForm };
      const nextAuth = await login(payload);
      navigate(nextAuth.role === "teacher" ? "/enseignant" : "/etudiant", { replace: true });
    } catch (error) {
      window.alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-[min(1180px,calc(100%-24px))] items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-soft)] backdrop-blur xl:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-lagoon">Connexion securisee</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-none md:text-6xl">
            Accedez a votre espace QuizCampus.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Les enseignants construisent leurs quiz dans un assistant pas a pas.
            Les etudiants choisissent un quiz trie, puis le passent en mode entrainement
            avec explications ou en mode examen sans aide.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="font-display text-2xl font-bold">Compte enseignant de demo</h2>
              <p className="mt-2 text-slate-600">Email: `dupont@quizcampus.fr`</p>
              <p className="text-slate-600">Mot de passe: `prof1234`</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="font-display text-2xl font-bold">Compte etudiant de demo</h2>
              <p className="mt-2 text-slate-600">Email: `sarah.martin@campus.fr`</p>
              <p className="text-slate-600">Mot de passe: `etud1234`</p>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <h2 className="font-display text-3xl font-bold">Se connecter</h2>
          <p className="mt-2 text-slate-600">Choisissez votre role puis entrez vos identifiants.</p>

          <form onSubmit={submitLogin} className="mt-6 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 font-semibold transition ${role === "teacher" ? "bg-clay text-white" : "bg-slate-900/8 text-slate-700 hover:bg-slate-900/12"}`}
              >
                Enseignant
              </button>
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 font-semibold transition ${role === "student" ? "bg-lagoon text-white" : "bg-slate-900/8 text-slate-700 hover:bg-slate-900/12"}`}
              >
                Etudiant
              </button>
            </div>

            {role === "teacher" ? (
              <>
                <label className="grid gap-2 font-semibold text-slate-700">
                  Email
                  <input value={teacherForm.email} onChange={(event) => setTeacherForm((current) => ({ ...current, email: event.target.value }))} className={inputClassName} />
                </label>
                <label className="grid gap-2 font-semibold text-slate-700">
                  Mot de passe
                  <input type="password" value={teacherForm.password} onChange={(event) => setTeacherForm((current) => ({ ...current, password: event.target.value }))} className={inputClassName} />
                </label>
              </>
            ) : (
              <>
                <label className="grid gap-2 font-semibold text-slate-700">
                  Email etudiant
                  <input value={studentForm.email} onChange={(event) => setStudentForm((current) => ({ ...current, email: event.target.value }))} className={inputClassName} />
                </label>
                <label className="grid gap-2 font-semibold text-slate-700">
                  Mot de passe
                  <input type="password" value={studentForm.password} onChange={(event) => setStudentForm((current) => ({ ...current, password: event.target.value }))} className={inputClassName} />
                </label>
              </>
            )}

            <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              Entrer dans l'application
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
