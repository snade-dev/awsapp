import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, EmptyState, Field, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";
import { inputClassName } from "../lib/ui";

const steps = [
  { id: 1, label: "Informations" },
  { id: 2, label: "Questions" },
  { id: 3, label: "Validation" }
];

export function QuizzesPage() {
  const {
    data,
    quizForm,
    draftQuestion,
    draftQuestions,
    setDraftQuestion,
    updateQuizForm,
    updateDraftOption,
    addDraftOption,
    removeDraftOption,
    addDraftQuestion,
    removeDraftQuestion,
    submitQuiz,
    deleteQuiz
  } = useAppData();
  const [step, setStep] = useState(1);

  function goNextStep() {
    if (step === 1 && (!quizForm.title.trim() || !quizForm.subject.trim())) {
      window.alert("Veuillez d'abord renseigner les informations principales du quiz.");
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
  }

  function goPreviousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleSubmit(event) {
    await submitQuiz(event);
    setStep(1);
  }

  return (
    <main className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:col-span-2 lg:p-8">
        <SectionHeading kicker="Enseignant" title="Creer un quiz pas a pas" badge="Assistant de creation" />

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={`rounded-2xl px-4 py-4 text-left transition ${step === item.id ? "bg-clay text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.22em]">Etape {item.id}</span>
              <span className="mt-1 block font-display text-xl font-bold">{item.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titre du quiz"><input value={quizForm.title} onChange={(event) => updateQuizForm("title", event.target.value)} required className={inputClassName} /></Field>
              <Field label="Matiere"><input value={quizForm.subject} onChange={(event) => updateQuizForm("subject", event.target.value)} required className={inputClassName} /></Field>
              <Field label="Mode par defaut">
                <select value={quizForm.mode} onChange={(event) => updateQuizForm("mode", event.target.value)} className={inputClassName}>
                  <option value="practice">Entrainement</option>
                  <option value="exam">Examen</option>
                </select>
              </Field>
              <Field label="Duree (minutes)"><input type="number" min="1" value={quizForm.duration} onChange={(event) => updateQuizForm("duration", event.target.value)} required className={inputClassName} /></Field>
              <Field label="Description" className="md:col-span-2"><textarea rows="4" value={quizForm.description} onChange={(event) => updateQuizForm("description", event.target.value)} className={inputClassName} /></Field>
              <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
                <input
                  type="checkbox"
                  checked={quizForm.allowExplanations}
                  onChange={(event) => updateQuizForm("allowExplanations", event.target.checked)}
                  className="h-4 w-4 accent-[#b85d3d]"
                />
                <span className="font-semibold">Autoriser les explications en mode entrainement</span>
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 rounded-[26px] border border-slate-200 bg-sand/70 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="font-display text-2xl font-bold">Nouvelle question</h3>
                <button type="button" onClick={addDraftQuestion} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900/8 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">Ajouter la question au quiz</button>
              </div>

              <Field label="Enonce"><input value={draftQuestion.text} onChange={(event) => setDraftQuestion((current) => ({ ...current, text: event.target.value }))} className={inputClassName} /></Field>

              <div className="grid gap-4">
                {draftQuestion.options.map((option, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="font-display text-lg">Option {String.fromCharCode(65 + index)}</strong>
                      <button
                        type="button"
                        onClick={() => removeDraftOption(index)}
                        disabled={draftQuestion.options.length <= 2}
                        className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-900/12 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Supprimer l'option
                      </button>
                    </div>
                    <Field label="Texte de la reponse">
                      <input value={option.text} onChange={(event) => updateDraftOption(index, "text", event.target.value)} className={inputClassName} />
                    </Field>
                    <Field label="Explication associee">
                      <textarea rows="3" value={option.explanation} onChange={(event) => updateDraftOption(index, "explanation", event.target.value)} className={inputClassName} />
                    </Field>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={addDraftOption} className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2 font-semibold text-slate-700 transition hover:-translate-y-0.5">
                  Ajouter une option de reponse
                </button>
              </div>

              <Field label="Bonne reponse" className="md:max-w-xs">
                <select value={draftQuestion.correctAnswer} onChange={(event) => setDraftQuestion((current) => ({ ...current, correctAnswer: Number(event.target.value) }))} className={inputClassName}>
                  {draftQuestion.options.map((_, index) => (
                    <option key={index} value={index}>{String.fromCharCode(65 + index)}</option>
                  ))}
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
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display text-2xl font-bold">{quizForm.title || "Quiz sans titre"}</h3>
                <p className="mt-2 text-slate-600">{quizForm.description || "Sans description"}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{quizForm.subject || "Matiere non renseignee"}</span>
                  <span>{draftQuestions.length} question(s)</span>
                  <span>{quizForm.duration} min</span>
                  <span>{quizForm.allowExplanations ? "Explications autorisees" : "Sans explications"}</span>
                </div>
              </article>

              <div className="grid gap-3">
                {draftQuestions.length ? draftQuestions.map((question, index) => (
                  <article key={`${question.text}-review-${index}`} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                    <strong className="font-display text-xl">Question {index + 1}</strong>
                    <p className="mt-2 text-slate-700">{question.text}</p>
                  </article>
                )) : <EmptyState message="Ajoutez au moins une question avant de valider." />}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={goPreviousStep} disabled={step === 1} className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-900/8 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-900/12 disabled:cursor-not-allowed disabled:opacity-40">
              Etape precedente
            </button>
            {step < 3 ? (
              <button type="button" onClick={goNextStep} className="inline-flex min-h-12 items-center justify-center rounded-full bg-lagoon px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">
                Etape suivante
              </button>
            ) : (
              <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">
                Enregistrer le quiz
              </button>
            )}
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
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/enseignant/quiz/${quiz.id}`} className="inline-flex min-h-10 items-center justify-center rounded-full bg-lagoon px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5">
                  Voir la fiche quiz
                </Link>
                <button type="button" onClick={() => deleteQuiz(quiz.id)} className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">
                  Supprimer
                </button>
              </div>
            </article>
          )) : <EmptyState message="Aucun quiz enregistre." />}
        </div>
      </section>
    </main>
  );
}
