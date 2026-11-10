import type { Metadata } from "next";
import { ProcedureBrowser } from "@/components/ProcedureBrowser";

export const metadata: Metadata = { title: "All procedures — Aesthetic Guide NYC & Miami" };

export default function Procedures() {
  return <ProcedureBrowser />;
}
