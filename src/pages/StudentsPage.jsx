import { EmptyState, Field, SectionHeading } from "../components/Ui";
import { useAppData } from "../context/AppDataContext";
import { inputClassName } from "../lib/ui";

export function StudentsPage() {
  const { data, studentForm, setStudentForm, submitStudent, deleteStudent } = useAppData();

  return (
    <main className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Administration" title="Ajouter un etudiant" />
        <form onSubmit={submitStudent} className="grid gap-4">
          <Field label="Nom complet"><input value={studentForm.name} onChange={(event) => setStudentForm((current) => ({ ...current, name: event.target.value }))} required className={inputClassName} /></Field>
          <Field label="Email"><input type="email" value={studentForm.email} onChange={(event) => setStudentForm((current) => ({ ...current, email: event.target.value }))} required className={inputClassName} /></Field>
          <Field label="Groupe"><input value={studentForm.group} onChange={(event) => setStudentForm((current) => ({ ...current, group: event.target.value }))} className={inputClassName} /></Field>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-clay px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">Ajouter l'etudiant</button>
        </form>
      </section>

      <section className="rounded-[30px] border border-white/60 bg-white/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur lg:p-8">
        <SectionHeading kicker="Liste" title="Etudiants enregistres" />
        <div className="grid gap-3">
          {data.students.length ? data.students.map((student) => (
            <article key={student.id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
              <strong className="font-display text-xl">{student.name}</strong>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{student.email}</span>
                <span>{student.group || "Groupe non renseigne"}</span>
              </div>
              <button type="button" onClick={() => deleteStudent(student.id)} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900/8 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900/12">Supprimer</button>
            </article>
          )) : <EmptyState message="Aucun etudiant ajoute." />}
        </div>
      </section>
    </main>
  );
}
