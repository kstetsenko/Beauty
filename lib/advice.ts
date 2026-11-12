import type { Procedure, QuizAnswers } from "./types";

/**
 * Personal notes shown on a result card, based on quiz answers. Every rule
 * points to its evidence. If there is no published guidance, we say so
 * instead of inventing a rule.
 */
export interface Note {
  text: string;
  source?: { label: string; url: string };
}

const pm = (id: string) => `https://pubmed.ncbi.nlm.nih.gov/${id}/`;
const pmc = (id: string) => `https://pmc.ncbi.nlm.nih.gov/articles/${id}/`;

export const RESURFACING = new Set(["ultraclear", "co2", "erbium", "fraxel", "clear-brilliant", "tixel", "pico"]);
export const LIGHT = new Set(["ultraclear", "co2", "erbium", "fraxel", "clear-brilliant", "pico", "ipl", "pdl", "ktp"]);
export const ENERGY = new Set(["sofwave", "ultherapy", "thermage", "morpheus8", "emface", "tixel"]);

export function notesFor(p: Procedure, a: QuizAnswers): Note[] {
  const n: Note[] = [];
  const id = p.id;

  // Skin tone
  if (a.tone === "deep" && id === "ipl")
    n.push({ text: "A review reports a higher risk of burns and dark marks with IPL on deep brown or Black skin.", source: { label: "Review: PIH in skin of color", url: pmc("PMC11514325") } });
  else if (a.tone !== "light" && a.tone && LIGHT.has(id))
    n.push({ text: "A review reports a higher risk of dark marks after laser on medium and deeper skin tones.", source: { label: "Review: lasers in skin of color", url: pm("36781686") } });

  // Conditions
  if (a.conditions?.includes("melasma") && LIGHT.has(id) && !["pdl"].includes(id))
    n.push({ text: "A meta-analysis found that laser and light results for melasma are often temporary and that melasma can return darker.", source: { label: "Meta-analysis: lasers for melasma", url: pmc("PMC13128289") } });
  if (a.conditions?.includes("melasma") && id === "laser-toning")
    n.push({ text: "Meta-analyses found that it improves melasma, but melasma often returns, and many sessions can leave white spots.", source: { label: "Meta-analysis: low-fluence Nd:YAG for melasma", url: pm("36533794") } });
  if (a.conditions?.includes("rosacea") && id === "ipl")
    n.push({ text: "IPL and pulsed-dye laser both reduce rosacea redness in studies.", source: { label: "Meta-analysis: IPL & PDL for rosacea", url: pm("39240125") } });
  if (a.conditions?.includes("cold-sores") && RESURFACING.has(id))
    n.push({ text: "A reference on laser complications lists cold-sore flare-ups as a known risk after resurfacing.", source: { label: "StatPearls (NIH): laser complications", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK532248/" } });

  // Accutane (2017 consensus)
  if (a.cautions.includes("isotretinoin") && ["fraxel", "clear-brilliant"].includes(id))
    n.push({ text: "A 2017 expert consensus reviewed this treatment during isotretinoin (Accutane) use.", source: { label: "JAMA Dermatology consensus (2017)", url: pm("28658462") } });

  // Recent treatments
  if (a.recent?.includes("botox") && id === "botox")
    n.push({ text: "The label says repeat dosing more often than every 3 months hasn't been studied.", source: { label: "FDA label: Botox Cosmetic", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" } });
  if (a.recent?.includes("botox") && id === "ultherapy")
    n.push({ text: "In a small study, focused ultrasound near recent Botox injections reduced the Botox effect.", source: { label: "Study: ultrasound after toxin", url: pmc("PMC11945533") } });
  if (a.recent?.includes("filler") && id === "ultherapy")
    n.push({ text: "In a small study, focused ultrasound within 2 weeks of filler reduced the filler; waiting 4 weeks did not.", source: { label: "Study: ultrasound after filler", url: pm("36374232") } });
  else if (a.recent?.includes("filler") && (ENERGY.has(id) || LIGHT.has(id)))
    n.push({ text: "A review found mixed evidence on energy and light treatments soon after filler.", source: { label: "Review: energy devices and filler", url: pmc("PMC11024499") } });
  if (a.recent?.includes("energy") && ENERGY.has(id))
    n.push({ text: "We found no official repeat interval for these devices." });

  return n;
}

/** True if FDA authorizations don't cover this age band (fillers & microneedling devices: 22+). */
export function belowMinAge(p: Procedure, a: QuizAnswers) {
  return !!p.minAge && a.age === "18-21";
}
