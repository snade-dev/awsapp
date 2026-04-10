import { Link } from "react-router-dom";
import { Badge, EmptyState, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function QuizzesPage() {
  const { data, deleteQuiz } = useAppData();

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-(--shadow-soft) backdrop-blur lg:p-8">
        <SectionHeading kicker="Bibliotheque" title="Quiz disponibles" />
        <div className="mb-4">
          <Link
            to="/enseignant/quiz/creation"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-clay px-5 py-2 font-semibold text-white transition hover:-translate-y-0.5"
          >
            Creer un quiz
          </Link>
        </div>

        <div className="grid gap-3">
          {data.quizzes.length ? (
            data.quizzes.map((quiz) => (
              <article
                key={quiz.id}
                className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold">
                      {quiz.title}
                    </h3>
                    <p className="mt-2 text-slate-600">
                      {quiz.description || "Sans description"}
                    </p>
                  </div>
                  <Badge mode={quiz.mode}>
                    {quiz.mode === "exam" ? "Examen" : "Entrainement"}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{quiz.subject}</span>
                  <span>{quiz.questions.length} question(s)</span>
                  <span>{quiz.duration} min</span>
                  <span>
                    {quiz.allowExplanations
                      ? "Explications activables"
                      : "Sans explications pendant le passage"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/enseignant/quiz/${quiz.id}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-lagoon px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Voir la fiche quiz
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteQuiz(quiz.id)}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState message="Aucun quiz enregistre." />
          )}
        </div>
      </section>
    </main>
  );
}
