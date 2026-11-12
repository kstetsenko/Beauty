import type { Goal } from "./types";

/**
 * FDA status of every treatment in the guide (only FDA-approved or FDA-cleared products and devices are listed).
 * Each entry: plain description, source link, and which of the guide's goals the approval/clearance covers.
 * A goal the treatment is listed for but not covered here is shown as "Its FDA clearance doesn't cover …".
 * Checked November 2026 against FDA records, FDA labels or the makers' clearance announcements (linked).
 */
export interface Basis { goals: Goal[]; text: string; url: string }

const fda510k = (k: string) => `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${k}`;

export const BASIS: Record<string, Basis[]> = {
  // Injectables
  botox: [{ goals: ["lines"], text: "FDA-approved for frown lines (2002), later also forehead and crow's-feet lines", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" }],
  "cheek-filler": [{ goals: ["volume"], text: "FDA-approved to restore cheek volume (Juvéderm Voluma, 2013)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S070D.pdf" }],
  "smile-filler": [{ goals: ["lines"], text: "FDA-approved for moderate to severe smile lines and folds (Restylane Refyne and Defyne, 2016; Juvéderm Vollure, 2017)", url: "https://cm.healio.com/news/dermatology/20170321/fda-approves-juvederm-vollure-xc-for-treating-nasolabial-folds-with-results-up-to-18-months" }],
  "under-eye": [{ goals: ["volume"], text: "FDA-approved for under-eye hollows (Restylane Eyelight, 2023)", url: "https://cm.healio.com/news/dermatology/20230605/fda-approves-restylane-eyelight-for-undereye-hollows" }],
  sculptra: [{ goals: ["lines", "volume"], text: "FDA-approved for smile lines, other facial wrinkles and contour loss (2009)", url: "https://drugs.com/newdrugs/fda-approves-sculptra-aesthetic-facial-injectable-correction-nasolabial-folds-other-facial-wrinkles-1517.html" }],
  radiesse: [{ goals: ["lines"], text: "FDA-approved for moderate to severe facial wrinkles and folds", url: "https://www.drugs.com/newdrugs/radiesse-bioform-medical-inc-moderate-severe-facial-wrinkles-4.html" }],
  skinvive: [{ goals: ["glow", "texture"], text: "FDA-approved to improve cheek skin smoothness (2023)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S059C.pdf" }],
  bellafill: [{ goals: ["acne"], text: "FDA-approved for rolling acne scars (2014)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf2/P020012S009c.pdf" }],
  threads: [{ goals: [], text: "Some PDO thread brands are FDA-cleared (for example PDO Max); ask which brand will be used", url: fda510k("K190245") }],
  // Lasers and light
  co2: [{ goals: ["lines", "texture"], text: "Fractional CO2 lasers are FDA-cleared for skin resurfacing and wrinkles", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf24/K244060.pdf" }],
  erbium: [{ goals: ["lines", "texture", "pigment"], text: "FDA-cleared for resurfacing, wrinkles and benign pigmented spots", url: fda510k("K173285") }],
  fraxel: [{ goals: ["texture", "lines", "acne", "pigment"], text: "FDA-cleared for resurfacing, wrinkles around the eyes, acne scars, sun spots and melasma (2024)", url: fda510k("K242142") }],
  "clear-brilliant": [{ goals: ["texture"], text: "FDA-cleared for skin resurfacing (2011)", url: fda510k("K110349") }],
  tixel: [{ goals: ["texture", "lines"], text: "FDA-cleared for skin resurfacing (2021) and wrinkles around the eyes (2023)", url: fda510k("K223033") }],
  ultraclear: [{ goals: ["lines", "texture", "pigment"], text: "FDA-cleared for resurfacing and wrinkles (2021), and for pigmented spots (2024)", url: fda510k("K210847") }],
  pico: [{ goals: ["pigment", "acne", "lines"], text: "FDA-cleared for pigmented spots (2012), and for acne scars and wrinkles (2014)", url: "https://practicaldermatology.com/news/20140924-cynosure_receives_expanded_fda_clearance_to_market_picosure_for_treatment_of_wrinkles/2459105/" }],
  ipl: [{ goals: ["pigment", "redness"], text: "FDA-cleared for pigmented and vascular skin lesions (2003)", url: fda510k("K032460") }],
  pdl: [{ goals: ["redness"], text: "FDA-cleared for vascular lesions (Vbeam)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf18/K180593.pdf" }],
  ktp: [{ goals: ["redness"], text: "FDA-cleared for vascular and pigmented lesions (Excel V)", url: fda510k("K153671") }],
  "laser-toning": [{ goals: ["pigment"], text: "FDA-cleared for benign pigmented spots and melasma (Spectra, 2012)", url: fda510k("K113588") }],
  aviclear: [{ goals: ["breakouts"], text: "FDA-cleared for mild to severe acne (2022)", url: fda510k("K213461") }],
  aerolase: [{ goals: [], text: "The device is FDA-cleared (2012); we couldn't confirm that acne is one of its cleared uses", url: fda510k("K120235") }],
  pdt: [{ goals: [], text: "FDA-approved for precancerous spots (actinic keratoses); use for acne or sun damage is off-label", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/020965s015lbl.pdf" }],
  led: [{ goals: ["lines"], text: "Some LED devices are FDA-cleared for wrinkles around the eyes", url: fda510k("K162106") }],
  // Ultrasound, radiofrequency and other devices
  sofwave: [
    { goals: ["lines"], text: "FDA-cleared to improve facial lines and wrinkles (2019)", url: fda510k("K191421") },
    { goals: ["lift"], text: "FDA-cleared to lift the brow and loose skin under the chin and on the neck (2023)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf23/K230820.pdf" },
  ],
  ultherapy: [{ goals: ["lift"], text: "FDA-cleared to lift the eyebrow (2009)", url: "https://www.biospace.com/ulthera-receives-first-ever-fda-clearance-to-market-ultrasound-technology-for-facial-aesthetic-improvement" }],
  thermage: [{ goals: ["lines"], text: "FDA-cleared for facial and around-the-eye wrinkles (2004)", url: fda510k("K040135") }],
  xerf: [{ goals: ["lift"], text: "FDA-cleared for skin tightening (2025, per the maker)", url: "https://www.businesswire.com/news/home/20250818405332/en/Cynosure-Lutronic-Announces-U.S.-Clearance-of-the-XERF-Device-Redefining-the-Future-of-Non-Invasive-Skin-Tightening" }],
  emface: [{ goals: ["lines"], text: "FDA-cleared for temporary reduction of facial wrinkles", url: fda510k("K253750") }],
  morpheus8: [{ goals: [], text: "FDA-cleared for soft-tissue contraction in skin procedures (2024)", url: "https://prnewswire.com/news-releases/morpheus8-secures-first-and-only-fda-clearance-for-soft-tissue-contraction-for-fractional-radiofrequency-microneedling-302198891.html" }],
  "sylfirm-x": [{ goals: [], text: "FDA-cleared (2020) for skin coagulation; melasma isn't part of its cleared use", url: fda510k("K200185") }],
  microneedling: [{ goals: ["acne"], text: "SkinPen is FDA-authorized to improve facial acne scars (2018)", url: "https://prnewswire.com/news-releases/crown-aesthetics-skinpen-precision-celebrates-5-year-anniversary-as-the-first-fda-cleared-microneedling-treatment-301762825.html" }],
  microcurrent: [{ goals: [], text: "Some microcurrent devices are FDA-cleared for facial stimulation (cosmetic use)", url: fda510k("K241102") }],
};

export function basisFor(id: string, goals: Goal[]): Basis | undefined {
  return BASIS[id]?.find((b) => b.goals.some((g) => goals.includes(g)));
}

/** The person's goals this treatment is listed for, but which its FDA approval/clearance doesn't cover. */
export function offLabelGoals(id: string, goals: Goal[]): Goal[] {
  const covered = new Set((BASIS[id] ?? []).flatMap((b) => b.goals));
  return goals.filter((g) => !covered.has(g));
}
