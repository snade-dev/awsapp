import { StatsCard, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function DashboardPage() {
  const { data } = useAppData();
  const exams = data.quizzes.filter((quiz) => quiz.mode === "exam").length;

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Accueil" title="Tableau de bord" badge="Navigation multi-pages" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard value={data.quizzes.length} label="quiz actifs" />
          <StatsCard value={data.students.length} label="etudiants suivis" />
          <StatsCard value={exams} label="examens configures" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
          <SectionHeading kicker="Parcours" title="Pages disponibles" />
          <div className="grid gap-3 text-slate-600">
            <p>`Quiz` pour creer et gerer les QCM.</p>
            <p>`Etudiants` pour administrer les apprenants.</p>
            <p>`Sessions` pour lancer un quiz ou un examen chronometre.</p>
            <p>`Resultats` pour suivre les copies remontees.</p>
          </div>
        </article>

        <article className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
          <SectionHeading kicker="Activite" title="Resume rapide" />
          <div className="grid gap-3 text-slate-600">
            <p>{data.results.length ? `${data.results.length} resultat(s) ont deja ete enregistres.` : "Aucun resultat pour le moment."}</p>
            <p>{data.quizzes.length ? `Le catalogue contient ${data.quizzes.length} quiz.` : "Aucun quiz n'est encore cree."}</p>
            <p>{data.students.length ? `${data.students.length} etudiant(s) sont suivis dans l'application.` : "Aucun etudiant n'est encore ajoute."}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
