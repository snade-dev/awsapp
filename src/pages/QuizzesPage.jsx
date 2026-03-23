import { Badge, EmptyState, Field, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";
import { inputClassName } from "../lib/ui";

export function QuizzesPage() {
  const {
    data,
    quizForm,
    draftQuestion,
    draftQuestions,
    setDraftQuestion,
    updateQuizForm,
    updateDraftOption,
    addDraftQuestion,
    removeDraftQuestion,
    submitQuiz,
    deleteQuiz
  } = useAppData();

  return (
    <main className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:col-span-2 lg:p-8">
        <SectionHeading kicker="Enseignant" title="Creer un nouveau quiz" badge="Formulaire dedie" />
        <form onSubmit={submitQuiz} className="grid gap-4 md:grid-cols-2">
          <Field label="Titre du quiz"><input value={quizForm.title} onChange={(event) => updateQuizForm("title", event.target.value)} required className={inputClassName} /></Field>
          <Field label="Matiere"><input value={quizForm.subject} onChange={(event) => updateQuizForm("subject", event.target.value)} required className={inputClassName} /></Field>
          <Field label="Mode">
            <select value={quizForm.mode} onChange={(event) => updateQuizForm("mode", event.target.value)} className={inputClassName}>
              <option value="practice">Quiz d'entrainement</option>
              <option value="exam">Examen chronometre</option>
            </select>
          </Field>
          <Field label="Duree (minutes)"><input type="number" min="1" value={quizForm.duration} onChange={(event) => updateQuizForm("duration", event.target.value)} required className={inputClassName} /></Field>
          <Field label="Description" className="md:col-span-2"><textarea rows="3" value={quizForm.description} onChange={(event) => updateQuizForm("description", event.target.value)} className={inputClassName} /></Field>
          <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
            <input
              type="checkbox"
              checked={quizForm.allowExplanations}
              onChange={(event) => updateQuizForm("allowExplanations", event.target.checked)}
              className="h-4 w-4 accent-[#b85d3d]"
            />
            <span className="font-semibold">Autoriser les explications pendant le quiz d'entrainement</span>
          </label>

          <div className="grid gap-4 rounded-[26px] border border-slate-200 bg-sand/70 p-5 md:col-span-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="font-display text-2xl font-bold">Questions du quiz</h3>
              <button type="button" onClick={addDraftQuestion} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900/8 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">Ajouter la question</button>
            </div>

            <Field label="Enonce"><input value={draftQuestion.text} onChange={(event) => setDraftQuestion((current) => ({ ...current, text: event.target.value }))} className={inputClassName} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              {draftQuestion.options.map((option, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <Field label={`Reponse ${String.fromCharCode(65 + index)}`}>
                    <input value={option.text} onChange={(event) => updateDraftOption(index, "text", event.target.value)} className={inputClassName} />
                  </Field>
                  <Field label="Explication de cette option">
                    <textarea
                      rows="3"
                      value={option.explanation}
                      onChange={(event) => updateDraftOption(index, "explanation", event.target.value)}
                      className={inputClassName}
                    />
                  </Field>
                </div>
              ))}
            </div>
            <Field label="Bonne reponse" className="md:max-w-xs">
              <select value={draftQuestion.correctAnswer} onChange={(event) => setDraftQuestion((current) => ({ ...current, correctAnswer: Number(event.target.value) }))} className={inputClassName}>
                <option value={0}>A</option>
                <option value={1}>B</option>
                <option value={2}>C</option>
                <option value={3}>D</option>
              </select>
            </Field>

            <div className="grid gap-3">
              {draftQuestions.length ? draftQuestions.map((question, index) => (
                <article key={`${question.text}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <strong className="font-display text-lg">Question {index + 1}</strong>
                  <p className="mt-2 text-slate-700">{question.text}</p>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="font-semibold text-slate-800">{String.fromCharCode(65 + optionIndex)}. {option.text}</p>
                        <p className="mt-1 text-sm text-slate-600">{option.explanation || "Sans explication."}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <span>Bonne reponse: {String.fromCharCode(65 + question.correctAnswer)}</span>
                    <button type="button" onClick={() => removeDraftQuestion(index)} className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">Retirer</button>
                  </div>
                </article>
              )) : <EmptyState message="Aucune question ajoutee pour le moment." />}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">Enregistrer le quiz</button>
          </div>
        </form>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:col-span-2 lg:p-8">
        <SectionHeading kicker="Bibliotheque" title="Quiz disponibles" />
        <div className="grid gap-3">
          {data.quizzes.length ? data.quizzes.map((quiz) => (
            <article key={quiz.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold">{quiz.title}</h3>
                  <p className="mt-2 text-slate-600">{quiz.description || "Sans description"}</p>
                </div>
                <Badge mode={quiz.mode}>{quiz.mode === "exam" ? "Examen" : "Entrainement"}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{quiz.subject}</span>
                <span>{quiz.questions.length} question(s)</span>
                <span>{quiz.duration} min</span>
                <span>{quiz.allowExplanations ? "Explications activables" : "Sans explications pendant le passage"}</span>
              </div>
              <button type="button" onClick={() => deleteQuiz(quiz.id)} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">Supprimer</button>
            </article>
          )) : <EmptyState message="Aucun quiz enregistre." />}
        </div>
      </section>
    </main>
  );
}
