import { Link } from "react-router-dom";
import { SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function StudentHomePage() {
  const { data } = useAppData();
  const examCount = data.quizzes.filter((quiz) => quiz.mode === "exam").length;

  return (
    <main className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:col-span-2 lg:p-8">
        <SectionHeading kicker="Etudiant" title="Bienvenue dans votre espace" badge="Parcours question par question" />
        <p className="max-w-3xl text-slate-600">
          Cet espace est reserve au passage des quiz. Vous choisissez un quiz, puis vous avancez
          une question a la fois jusqu'a la validation finale.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/etudiant/session" className="inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">
            Commencer une session
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Catalogue" title="Quiz disponibles" />
        <div className="grid gap-3 text-slate-600">
          <p>{data.quizzes.length} quiz sont actuellement accessibles.</p>
          <p>{examCount} quiz sont configures en mode examen avec chrono.</p>
          <p>{data.students.length} etudiant(s) sont presents dans l'application.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Consignes" title="Comment se passe un quiz" />
        <div className="grid gap-3 text-slate-600">
          <p>Vous choisissez votre nom et le quiz a passer.</p>
          <p>Chaque ecran affiche une seule question pour favoriser la concentration.</p>
          <p>Vous pouvez revenir a la question precedente avant de terminer.</p>
        </div>
      </section>
    </main>
  );
}
