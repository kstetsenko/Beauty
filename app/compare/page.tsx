import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareView } from "@/components/CompareView";

export const metadata: Metadata = { title: "Compare treatments — Aesthetic Guide NYC & Miami" };

export default function Compare() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  );
}
