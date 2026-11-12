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

export const RESURFACING = new Set(["ultraclear", "co2", "erbium", "fraxel", "halo", "moxi", "clear-brilliant", "tixel", "pico", "peel"]);
export const LIGHT = new Set(["ultraclear", "co2", "erbium", "fraxel", "halo", "moxi", "clear-brilliant", "laser-genesis", "pico", "ipl", "pdl", "ktp"]);
export const ENERGY = new Set(["sofwave", "ultherapy", "thermage", "morpheus8", "emface", "tixel"]);

export function notesFor(p: Procedure, a: QuizAnswers): Note[] {
  const n: Note[] = [];
  const id = p.id;

  // Skin tone
  if (a.tone === "deep" && id === "ipl")
    n.push({ text: "IPL is generally advised against for deep brown or Black skin because of burn and dark-mark risk.", source: { label: "Review: PIH in skin of color", url: pmc("PMC11514325") } });
  else if (a.tone !== "light" && a.tone && LIGHT.has(id))
    n.push({ text: "Medium and deeper skin tones have a higher risk of dark marks after laser. Choose a provider experienced with your skin tone; lower settings are often used.", source: { label: "Review: lasers in skin of color", url: pm("36781686") } });

  // Conditions
  if (a.conditions?.includes("melasma") && LIGHT.has(id) && !["pdl", "laser-genesis"].includes(id))
    n.push({ text: "With melasma, laser and light results are often temporary and can rebound darker. Topical treatment and sun protection usually come first.", source: { label: "Meta-analysis: lasers for melasma", url: pmc("PMC13128289") } });
  if (a.conditions?.includes("melasma") && id === "peel")
    n.push({ text: "Peels have evidence for melasma, but it often returns without maintenance.", source: { label: "Meta-analysis: peels for melasma", url: pm("32947652") } });
  if (a.conditions?.includes("melasma") && id === "laser-toning")
    n.push({ text: "Used specifically for melasma. Meta-analyses find it helps, but melasma often returns, and many sessions can leave white spots.", source: { label: "Meta-analysis: low-fluence Nd:YAG for melasma", url: pm("36533794") } });
  if (a.conditions?.includes("rosacea") && id === "ipl")
    n.push({ text: "IPL and pulsed-dye laser both reduce rosacea redness in studies.", source: { label: "Meta-analysis: IPL & PDL for rosacea", url: pm("39240125") } });
  if (a.conditions?.includes("cold-sores") && RESURFACING.has(id))
    n.push({ text: "If you get cold sores, antiviral medicine before resurfacing is standard — mention it at your consult.", source: { label: "StatPearls (NIH): laser complications", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK532248/" } });

  // Accutane (2017 consensus)
  if (a.cautions.includes("isotretinoin") && ["peel", "fraxel", "halo", "moxi", "clear-brilliant"].includes(id))
    n.push({ text: "An expert consensus found no evidence to delay this while on isotretinoin (Accutane). Still tell your provider.", source: { label: "JAMA Dermatology consensus (2017)", url: pm("28658462") } });

  // Recent treatments
  if (a.recent?.includes("botox") && id === "botox")
    n.push({ text: "The label says repeat dosing more often than every 3 months hasn't been studied.", source: { label: "FDA label: Botox Cosmetic", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" } });
  if (a.recent?.includes("botox") && id === "ultherapy")
    n.push({ text: "In a small study, focused ultrasound near recent Botox injections reduced the Botox effect. Tell your provider when and where you had it.", source: { label: "Study: ultrasound after toxin", url: pmc("PMC11945533") } });
  if (a.recent?.includes("filler") && id === "ultherapy")
    n.push({ text: "In a small study, focused ultrasound within 2 weeks of filler reduced the filler; waiting 4 weeks did not.", source: { label: "Study: ultrasound after filler", url: pm("36374232") } });
  else if (a.recent?.includes("filler") && (ENERGY.has(id) || LIGHT.has(id)))
    n.push({ text: "Evidence on doing this soon after filler is mixed. Tell your provider where and when you had filler.", source: { label: "Review: energy devices and filler", url: pmc("PMC11024499") } });
  if (a.recent?.includes("energy") && ENERGY.has(id))
    n.push({ text: "There's no official repeat interval for these devices — clinics' advice varies. Ask your provider." });
  if ((a.recent?.includes("laser") || a.recent?.includes("peel")) && (RESURFACING.has(id) || id === "microneedling" || id === "morpheus8" || id === "prp"))
    n.push({ text: "You had a laser, peel or microneedling-type treatment recently — tell your provider so they can plan timing." });
  if (a.had?.includes(id))
    n.push({ text: "You had this in the last 6 months. Tell your provider the date and the result, so they can plan when to repeat it." });

  return n;
}

/** True if FDA authorizations don't cover this age band (fillers & microneedling devices: 22+). */
export function belowMinAge(p: Procedure, a: QuizAnswers) {
  return !!p.minAge && a.age === "18-21";
}
