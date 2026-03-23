import { Badge, EmptyState, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";

export function ResultsPage() {
  const { data } = useAppData();

  return (
    <main className="grid gap-6">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Suivi" title="Resultats recents" />
        <div className="grid gap-3 md:grid-cols-2">
          {data.results.length ? data.results.map((result) => (
            <article key={result.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-display text-2xl font-bold">{result.studentName}</h3>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{result.quizTitle}</span>
                <span>{result.score}/{result.total}</span>
                <span>{result.submittedAt}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge mode={result.mode}>{result.mode === "exam" ? "Examen" : "Quiz"}</Badge>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{result.status}</span>
              </div>
            </article>
          )) : <EmptyState message="Aucun resultat pour l'instant. Lancez un quiz pour voir les copies remonter ici." className="md:col-span-2" />}
        </div>
      </section>
    </main>
  );
}
