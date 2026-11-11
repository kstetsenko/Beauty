import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoalGuide } from "@/components/GoalGuide";
import { GOAL_LABELS } from "@/lib/procedures";
import type { City, Goal } from "@/lib/types";

export function generateStaticParams() {
  return Object.keys(GOAL_LABELS).map((goal) => ({ goal }));
}

type Props = { params: Promise<{ goal: string }>; searchParams: Promise<{ city?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { goal } = await params;
  return GOAL_LABELS[goal] ? { title: `${GOAL_LABELS[goal]}: treatment options in NYC & Miami — Aesthetic Guide` } : {};
}

export default async function GoalPage({ params, searchParams }: Props) {
  const { goal } = await params;
  if (!GOAL_LABELS[goal]) notFound();
  const city: City = (await searchParams).city === "miami" ? "miami" : "nyc";
  return <GoalGuide goal={goal as Goal} city={city} />;
}
