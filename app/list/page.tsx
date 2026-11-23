import type { Metadata } from "next";
import { SharedList } from "@/components/SharedList";
import type { City } from "@/lib/types";

export const metadata: Metadata = { title: "Treatment shortlist — Aesthetic Guide NYC & Miami", robots: { index: false } };

type Props = { searchParams: Promise<{ ids?: string; city?: string }> };

export default async function ListPage({ searchParams }: Props) {
  const q = await searchParams;
  const city: City = q.city === "miami" ? "miami" : "nyc";
  return <SharedList city={city} ids={(q.ids ?? "").split(",").filter(Boolean)} />;
}
