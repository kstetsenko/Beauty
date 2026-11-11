import type { Metadata } from "next";
import { ClinicFinder } from "@/components/ClinicFinder";
import type { City } from "@/lib/types";

export const metadata: Metadata = { title: "Find a clinic — Aesthetic Guide NYC & Miami" };

type Props = { searchParams: Promise<{ t?: string; city?: string; area?: string }> };

export default async function ClinicsPage({ searchParams }: Props) {
  const q = await searchParams;
  const city: City = q.city === "miami" ? "miami" : "nyc";
  return <ClinicFinder key={`${q.t}-${city}-${q.area}`} treatment={q.t ?? ""} city={city} area={q.area ?? ""} />;
}
