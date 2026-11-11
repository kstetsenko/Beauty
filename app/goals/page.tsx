import type { Metadata } from "next";
import { GoalIndex } from "@/components/GoalGuide";

export const metadata: Metadata = { title: "Explore by goal — Aesthetic Guide NYC & Miami" };

export default function Goals() {
  return <GoalIndex />;
}
