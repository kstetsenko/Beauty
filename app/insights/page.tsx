import type { Metadata } from "next";
import { Insights } from "@/components/Insights";

export const metadata: Metadata = { title: "Core insights — Aesthetic Guide NYC & Miami" };

export default function InsightsPage() {
  return <Insights />;
}
