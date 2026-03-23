import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function StudentHomePage() {
  const { data, prepareStudentSession } = useAppData();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("title");

  const sortedQuizzes = useMemo(() => {
    const nextQuizzes = [...data.quizzes];
    nextQuizzes.sort((left, right) => {
      if (sortBy === "subject") {
        return left.subject.localeCompare(right.subject, "fr");
      }
      if (sortBy === "duration") {
        return left.duration - right.duration;
      }
      return left.title.localeCompare(right.title, "fr");
    });
    return nextQuizzes;
  }, [data.quizzes, sortBy]);

  function openSession(quizId, mode) {
    prepareStudentSession(quizId, mode);
    navigate("/etudiant/session");
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading kicker="Etudiant" title="Choisir un quiz" badge="Bibliotheque triee" />
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Trier par
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <option value="title">Titre</option>
              <option value="subject">Matiere</option>
              <option value="duration">Duree</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {sortedQuizzes.map((quiz) => (
            <article key={quiz.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold">{quiz.title}</h3>
                  <p className="mt-2 text-slate-600">{quiz.description || "Sans description"}</p>
                </div>
                <Badge mode={quiz.mode}>{quiz.mode === "exam" ? "Examen par defaut" : "Entrainement par defaut"}</Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{quiz.subject}</span>
                <span>{quiz.questions.length} question(s)</span>
                <span>{quiz.duration} min</span>
                <span>{quiz.allowExplanations ? "Explications disponibles" : "Sans explications"}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openSession(quiz.id, "practice")}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Mode entrainement
                </button>
                <button
                  type="button"
                  onClick={() => openSession(quiz.id, "exam")}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Mode examen
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
