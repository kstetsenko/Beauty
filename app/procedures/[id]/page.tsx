import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_LABELS, directoryLinks } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import type { City } from "@/lib/types";
import { ApproachTag, KeyFacts, MoreFacts } from "@/components/ProcedureFacts";

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ id: p.id }));
}

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ city?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = PROCEDURES.find((x) => x.id === id);
  return p ? { title: `${p.name} in NYC & Miami — Aesthetic Guide`, description: p.summary } : {};
}

export default async function ProcedurePage({ params, searchParams }: Props) {
  const { id } = await params;
  const p = PROCEDURES.find((x) => x.id === id);
  if (!p) notFound();
  const city: City = (await searchParams).city === "miami" ? "miami" : "nyc";
  const other: City = city === "nyc" ? "miami" : "nyc";
  const maps = directoryLinks(city, "", [p.name]).byProcedure[0];

  return (
    <article className="animate-in">
      <a href="/procedures" className="text-muted hover:text-ink text-sm">← All procedures</a>
      <div className="bg-white rounded-3xl border border-line p-6 mt-4">
        <ApproachTag p={p} />
        <h1 className="text-2xl font-semibold leading-snug">{p.name}</h1>
        <p className="text-sm text-muted mb-3">{p.what}</p>
        <p className="text-sm leading-relaxed mb-5">{p.summary}</p>
        <div className="flex gap-2 mb-3 text-sm">
          <span className="rounded-full bg-ink text-white px-3.5 py-1.5">{CITY_LABELS[city]}</span>
          <a href={`?city=${other}`} className="rounded-full border border-line px-3.5 py-1.5 hover:border-ink">{CITY_LABELS[other]}</a>
        </div>
        <div className="mb-6"><KeyFacts p={p} city={city} /></div>
        <MoreFacts p={p} />
      </div>
      <a href={maps.href} target="_blank" rel="noopener noreferrer" className="btn-main block text-center mt-4">
        Find {p.name} in {CITY_LABELS[city]} ↗
      </a>
      <p className="text-[11px] text-muted text-center mt-3">*Typical local estimate, not a quote. Choose a board-certified provider.</p>
    </article>
  );
}
