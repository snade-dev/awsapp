import { Badge, EmptyState, Field, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";
import { formatTime, inputClassName } from "../lib/ui";

export function SessionPage() {
  const {
    auth,
    data,
    sessionConfig,
    setSessionConfig,
    activeSession,
    startSession,
    setSessionAnswer,
    nextSessionQuestion,
    previousSessionQuestion,
    finishSession
  } = useAppData();

  const activeStudent = data.students.find((item) => item.id === activeSession?.studentId);
  const activeQuiz = data.quizzes.find((item) => item.id === activeSession?.quizId);
  const currentQuestion = activeQuiz?.questions[activeSession?.currentQuestionIndex ?? 0];
  const isFirstQuestion = (activeSession?.currentQuestionIndex ?? 0) === 0;
  const isLastQuestion = activeQuiz ? (activeSession?.currentQuestionIndex ?? 0) === activeQuiz.questions.length - 1 : false;
  const selectedOptionIndex = activeSession?.answers[activeSession?.currentQuestionIndex ?? 0];
  const selectedOption = selectedOptionIndex != null && currentQuestion ? currentQuestion.options[selectedOptionIndex] : null;

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeading kicker="Etudiant" title="Lancer une session" />
          {activeSession?.mode === "exam" && !activeSession?.completed ? (
            <div className="rounded-3xl bg-rose-50 px-5 py-3 text-right">
              <span className="block text-xs font-bold uppercase tracking-[0.26em] text-rose-500">Temps restant</span>
              <span className="font-display text-3xl font-extrabold text-rose-600">{formatTime(activeSession.remainingSeconds)}</span>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Etudiant">
            <input value={auth.name || "Etudiant"} disabled className={`${inputClassName} bg-slate-50 text-slate-500`} />
          </Field>
          <Field label="Quiz choisi">
            <select value={sessionConfig.quizId} onChange={(event) => setSessionConfig((current) => ({ ...current, quizId: event.target.value }))} className={inputClassName}>
              {data.quizzes.length ? data.quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>{quiz.title}</option>) : <option value="">Ajoutez un quiz d'abord</option>}
            </select>
          </Field>
          <Field label="Mode choisi">
            <input
              value={sessionConfig.sessionMode === "exam" ? "Examen sans explications" : "Entrainement avec explications"}
              disabled
              className={`${inputClassName} bg-slate-50 text-slate-500 md:col-span-2`}
            />
          </Field>
          <div className="md:col-span-2">
            <button type="button" onClick={startSession} className="inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">Commencer</button>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Passage" title="Quiz en cours" />
        {!activeSession ? <EmptyState message="Aucune session en cours. Selectionnez un etudiant et un quiz pour commencer." /> : null}

        {activeSession?.completed ? (
          <article className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-display text-3xl font-bold text-emerald-800">Resultat enregistre</h3>
            <p className="mt-3 text-emerald-900"><strong>{activeSession.studentName}</strong> a obtenu <strong>{activeSession.score}/{activeSession.total}</strong> au quiz <strong>{activeSession.quizTitle}</strong>.</p>
            <p className="mt-2 text-emerald-800">{activeSession.forced ? "Le temps est arrive a zero." : "La copie a ete envoyee avec succes."}</p>
          </article>
        ) : null}

        {activeSession && !activeSession.completed && activeStudent && activeQuiz ? (
          <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-display text-3xl font-bold">{activeQuiz.title}</h3>
                <p className="mt-2 text-slate-600">{activeStudent.name} • {activeQuiz.subject} • {activeQuiz.questions.length} question(s)</p>
              </div>
              <Badge mode={activeQuiz.mode}>{activeQuiz.mode === "exam" ? "Examen sous chrono" : "Mode entrainement"}</Badge>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>Progression</span>
              <span>Question {(activeSession.currentQuestionIndex ?? 0) + 1} / {activeQuiz.questions.length}</span>
            </div>
            {currentQuestion ? (
              <article className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <strong className="font-display text-xl">Question {(activeSession.currentQuestionIndex ?? 0) + 1}</strong>
                <p className="mt-2 text-slate-700">{currentQuestion.text}</p>
                <div className="mt-4 grid gap-3">
                  {currentQuestion.options.map((option, answerIndex) => (
                    <label key={`${option.text}-${answerIndex}`} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
                      <input
                        type="radio"
                        name={`question-${activeSession.currentQuestionIndex}`}
                        checked={activeSession.answers[activeSession.currentQuestionIndex] === answerIndex}
                        onChange={() => setSessionAnswer(activeSession.currentQuestionIndex, answerIndex)}
                        className="h-4 w-4 accent-[#b85d3d]"
                      />
                      <span className="text-slate-700">{String.fromCharCode(65 + answerIndex)}. {option.text}</span>
                    </label>
                  ))}
                </div>
                {activeSession.showExplanations && selectedOption?.explanation ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Explication de la reponse choisie</p>
                    <p className="mt-2 text-amber-950">{selectedOption.explanation}</p>
                  </div>
                ) : null}
              </article>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={previousSessionQuestion}
                disabled={isFirstQuestion}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900/8 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-900/12 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Question precedente
              </button>
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={nextSessionQuestion}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
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
