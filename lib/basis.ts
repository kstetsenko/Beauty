import type { Goal } from "./types";

/**
 * Official basis for listing a treatment under a goal, where one exists: the FDA approval or clearance that
 * covers that use. Shown as the first reason on the card. Every entry links to its source.
 * Treatments without an entry are listed because the studies cited for them (lib/research.ts) cover that goal.
 */
export interface Basis { goals: Goal[]; text: string; url: string }

const fda510k = (k: string) => `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${k}`;

export const BASIS: Record<string, Basis[]> = {
  sofwave: [
    { goals: ["lines"], text: "FDA-cleared to improve facial lines and wrinkles (2019)", url: fda510k("K191421") },
    { goals: ["lift"], text: "FDA-cleared to lift the brow and lax skin under the chin and neck (2023)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf23/K230820.pdf" },
  ],
  thermage: [{ goals: ["lines"], text: "FDA-cleared for facial and around-the-eye wrinkles (2004)", url: fda510k("K040135") }],
  emface: [{ goals: ["lines"], text: "FDA-cleared for temporary reduction of facial wrinkles", url: fda510k("K253750") }],
  botox: [{ goals: ["lines"], text: "FDA-approved for frown lines (2002), later also forehead and crow's-feet lines", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" }],
  "cheek-filler": [{ goals: ["volume"], text: "FDA-approved to restore cheek volume (Juvéderm Voluma, 2013)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S070D.pdf" }],
  skinvive: [{ goals: ["glow", "texture"], text: "FDA-approved to improve cheek skin smoothness (2023)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S059C.pdf" }],
  bellafill: [{ goals: ["acne"], text: "FDA-approved for rolling acne scars (2014)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf2/P020012S009c.pdf" }],
  aviclear: [{ goals: ["breakouts"], text: "FDA-cleared for mild to severe acne (2022)", url: fda510k("K213461") }],
  // Official status that doesn't cover the goals in this guide (shown under "FDA status", not as a reason to list it).
  pdt: [{ goals: [], text: "FDA-approved for precancerous spots (actinic keratoses); use for acne or sun damage is off-label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/020965s015lbl.pdf" }],
  xerf: [{ goals: ["lift"], text: "FDA-cleared for skin tightening (2025, per the maker)", url: "https://www.businesswire.com/news/home/20250818405332/en/Cynosure-Lutronic-Announces-U.S.-Clearance-of-the-XERF-Device-Redefining-the-Future-of-Non-Invasive-Skin-Tightening" }],
};

export function basisFor(id: string, goals: Goal[]): Basis | undefined {
  return BASIS[id]?.find((b) => b.goals.some((g) => goals.includes(g)));
}
