import type { Metadata } from "next";
import { ReportView } from "@/components/ReportView";

export const metadata: Metadata = { title: "Referral report", robots: { index: false, follow: false } };

export default function ReportPage() {
  return <ReportView />;
}
