interface Section {
  heading: string;
  body: React.ReactNode[];
}

interface LegalPageProps {
  title: string;
  updated?: string;
  sections: Section[];
}

export default function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container-site max-w-4xl">
        <h1 className="section-title">{title}</h1>
        {updated && <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>}
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.heading} className="card">
              <h2 className="text-lg font-semibold text-navy-900">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
