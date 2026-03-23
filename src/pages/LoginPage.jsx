import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { inputClassName } from "../lib/ui";

export function LoginPage() {
  const { auth, data, login, isLoading } = useAppData();
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher");
  const [teacherName, setTeacherName] = useState("Mme Dupont");
  const [studentId, setStudentId] = useState(data.students[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!studentId && data.students[0]) {
      setStudentId(data.students[0].id);
    }
  }, [data.students, studentId]);

  if (auth.isAuthenticated) {
    return <Navigate to={auth.role === "teacher" ? "/enseignant" : "/etudiant"} replace />;
  }

  async function submitLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (role === "teacher") {
        const nextAuth = await login({ role: "teacher", name: teacherName.trim() || "Enseignant" });
        navigate(nextAuth.role === "teacher" ? "/enseignant" : "/etudiant", { replace: true });
        return;
      }

      const student = data.students.find((item) => item.id === studentId);
      if (!student) {
        window.alert("Veuillez choisir un etudiant.");
        return;
      }

      const nextAuth = await login({ role: "student", studentId: student.id });
      navigate(nextAuth.role === "teacher" ? "/enseignant" : "/etudiant", { replace: true });
    } catch (error) {
      window.alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-[min(1100px,calc(100%-24px))] items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-soft)] backdrop-blur xl:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-lagoon">Connexion</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-none md:text-6xl">
            Choisissez votre espace de travail.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Connectez-vous comme enseignant pour creer des quiz avec explications,
            ou comme etudiant pour les faire question par question avec ou sans aide.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="font-display text-2xl font-bold">Enseignant</h2>
              <p className="mt-2 text-slate-600">Creation de quiz, explications, gestion des etudiants et suivi des resultats.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="font-display text-2xl font-bold">Etudiant</h2>
              <p className="mt-2 text-slate-600">Passage des quiz dans un parcours simple, avec option d'explications quand elles sont disponibles.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <h2 className="font-display text-3xl font-bold">Se connecter</h2>
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
              <label className="grid gap-2 font-semibold text-slate-700">
                Nom de l'enseignant
                <input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} className={inputClassName} />
              </label>
            ) : (
              <label className="grid gap-2 font-semibold text-slate-700">
                Selectionner un etudiant
                <select value={studentId} onChange={(event) => setStudentId(event.target.value)} className={inputClassName} disabled={isLoading || !data.students.length}>
                  {data.students.map((student) => (
                    <option key={student.id} value={student.id}>{student.name} - {student.group || "sans groupe"}</option>
                  ))}
                </select>
              </label>
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
