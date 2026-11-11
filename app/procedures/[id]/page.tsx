import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROCEDURES } from "@/lib/procedures";
import type { City } from "@/lib/types";
import { ProcedureDetail } from "@/components/ProcedureDetail";

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
  return <ProcedureDetail p={p} city={city} />;
}
