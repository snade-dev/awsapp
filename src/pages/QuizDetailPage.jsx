import { Link, useParams } from "react-router-dom";
import { Badge, EmptyState, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function QuizDetailPage() {
  const { quizId } = useParams();
  const { data } = useAppData();
  const quiz = data.quizzes.find((item) => item.id === quizId);
  const relatedResults = data.results.filter((result) => result.quizTitle === quiz?.title);

  if (!quiz) {
    return (
      <main className="grid gap-6">
        <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
          <EmptyState message="Quiz introuvable." />
        </section>
      </main>
    );
  }

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading kicker="Quiz" title={quiz.title} badge="Fiche detaillee" />
          <Badge mode={quiz.mode}>{quiz.mode === "exam" ? "Examen par defaut" : "Entrainement par defaut"}</Badge>
        </div>

        <p className="text-slate-600">{quiz.description || "Sans description"}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{quiz.subject}</span>
          <span>{quiz.questions.length} question(s)</span>
          <span>{quiz.duration} min</span>
          <span>{quiz.allowExplanations ? "Explications autorisees en entrainement" : "Sans explications"}</span>
        </div>
        <div className="mt-5">
          <Link to="/enseignant/quiz" className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">
            Retour a la bibliotheque
          </Link>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Contenu" title="Questions du quiz" />
        <div className="grid gap-4">
          {quiz.questions.map((question, index) => (
            <article key={`${question.text}-${index}`} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <strong className="font-display text-xl">Question {index + 1}</strong>
              <p className="mt-2 text-slate-700">{question.text}</p>
              <div className="mt-4 grid gap-3">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={`rounded-2xl px-4 py-4 ${question.correctAnswer === optionIndex ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50"}`}>
                    <p className="font-semibold text-slate-800">{String.fromCharCode(65 + optionIndex)}. {option.text}</p>
                    <p className="mt-1 text-sm text-slate-600">{option.explanation || "Sans explication."}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Suivi" title="Resultats lies a ce quiz" />
        {relatedResults.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {relatedResults.map((result) => (
              <article key={result.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display text-xl font-bold">{result.studentName}</h3>
                <p className="mt-2 text-slate-600">{result.score}/{result.total} • {result.submittedAt}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Aucun resultat n'est encore rattache a ce quiz." />
        )}
      </section>
    </main>
  );
}
