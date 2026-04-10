import { Link, Navigate, useParams } from "react-router-dom";
import { Badge, EmptyState, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";
import { formatTime } from "../lib/ui";

export function StudentQuizPage() {
  const { quizId } = useParams();
  const {
    auth,
    data,
    activeSession,
    startSessionForQuiz,
    setSessionAnswer,
    nextSessionQuestion,
    previousSessionQuestion,
    finishSession,
  } = useAppData();

  const quiz = data.quizzes.find((item) => item.id === quizId);
  if (!quiz) {
    return <Navigate to="/etudiant" replace />;
  }

  const sessionForQuiz =
    activeSession && activeSession.quizId === quiz.id ? activeSession : null;
  const currentQuestion = sessionForQuiz
    ? quiz.questions[sessionForQuiz.currentQuestionIndex ?? 0]
    : null;
  const isFirstQuestion = (sessionForQuiz?.currentQuestionIndex ?? 0) === 0;
  const isLastQuestion = sessionForQuiz
    ? (sessionForQuiz.currentQuestionIndex ?? 0) === quiz.questions.length - 1
    : false;
  const selectedOptionIndex =
    sessionForQuiz?.answers[sessionForQuiz?.currentQuestionIndex ?? 0];
  const selectedOption =
    selectedOptionIndex != null && currentQuestion
      ? currentQuestion.options[selectedOptionIndex]
      : null;

  return (
    <main className="grid gap-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-(--shadow-soft) lg:p-8">
        <SectionHeading kicker="Quiz" title={quiz.title} badge={quiz.subject} />
        <p className="text-slate-600">
          {quiz.description || "Aucune description pour ce quiz."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{quiz.questions.length} question(s)</span>
          <span>{quiz.duration} min</span>
          <span>
            {quiz.allowExplanations
              ? "Explications disponibles"
              : "Sans explications"}
          </span>
        </div>

        {!sessionForQuiz ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => startSessionForQuiz(quiz.id, "practice")}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Commencer en entrainement
            </button>
            <button
              type="button"
              onClick={() => startSessionForQuiz(quiz.id, "exam")}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
            >
              Commencer en examen
            </button>
            <Link
              to="/etudiant"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-clay hover:text-clay"
            >
              Retour a la liste
            </Link>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-(--shadow-soft) lg:p-8">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeading kicker="Passage" title="Quiz en cours" />
          {sessionForQuiz?.mode === "exam" && !sessionForQuiz?.completed ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-right">
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-clay">
                Temps restant
              </span>
              <span className="font-display text-3xl font-extrabold text-slate-900">
                {formatTime(sessionForQuiz.remainingSeconds)}
              </span>
            </div>
          ) : null}
        </div>

        {!sessionForQuiz ? (
          <EmptyState message="Cliquez sur un mode pour commencer ce quiz." />
        ) : null}

        {sessionForQuiz?.completed ? (
          <article className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h3 className="font-display text-3xl font-bold text-slate-900">
              Resultat enregistre
            </h3>
            <p className="mt-3 text-slate-700">
              <strong>{auth.name || "Etudiant"}</strong> a obtenu{" "}
              <strong>
                {sessionForQuiz.score}/{sessionForQuiz.total}
              </strong>
              .
            </p>
            <p className="mt-2 text-slate-600">
              {sessionForQuiz.forced
                ? "Le temps est arrive a zero."
                : "La copie a ete envoyee avec succes."}
            </p>
          </article>
        ) : null}

        {sessionForQuiz && !sessionForQuiz.completed && currentQuestion ? (
          <div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>Progression</span>
              <span>
                Question {(sessionForQuiz.currentQuestionIndex ?? 0) + 1} /{" "}
                {quiz.questions.length}
              </span>
            </div>

            <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <strong className="font-display text-xl">
                  Question {(sessionForQuiz.currentQuestionIndex ?? 0) + 1}
                </strong>
                <Badge mode={sessionForQuiz.mode}>
                  {sessionForQuiz.mode === "exam" ? "Examen" : "Entrainement"}
                </Badge>
              </div>
              <p className="text-slate-700">{currentQuestion.text}</p>

              <div className="mt-4 grid gap-3">
                {currentQuestion.options.map((option, answerIndex) => (
                  <label
                    key={`${option.text}-${answerIndex}`}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
                  >
                    <input
                      type="radio"
                      name={`question-${sessionForQuiz.currentQuestionIndex}`}
                      checked={
                        sessionForQuiz.answers[
                          sessionForQuiz.currentQuestionIndex
                        ] === answerIndex
                      }
                      onChange={() =>
                        setSessionAnswer(
                          sessionForQuiz.currentQuestionIndex,
                          answerIndex,
                        )
                      }
                      className="h-4 w-4 accent-clay"
                    />
                    <span className="text-slate-700">
                      {String.fromCharCode(65 + answerIndex)}. {option.text}
                    </span>
                  </label>
                ))}
              </div>

              {sessionForQuiz.showExplanations &&
              selectedOption?.explanation ? (
                <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">
                    Explication de la reponse choisie
                  </p>
                  <p className="mt-2 text-slate-800">
                    {selectedOption.explanation}
                  </p>
                </div>
              ) : null}
            </article>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previousSessionQuestion}
                disabled={isFirstQuestion}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-clay hover:text-clay disabled:cursor-not-allowed disabled:opacity-40"
              >
                Question precedente
              </button>
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={nextSessionQuestion}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Question suivante
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => finishSession()}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Terminer et corriger
                </button>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
