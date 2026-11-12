import type { Goal } from "./types";

/**
 * Patient-education pages from the American Academy of Dermatology (AAD) and
 * the American Society of Plastic Surgeons (ASPS). Checked November 2026.
 * No videos are listed yet: only add videos published by medical
 * organizations (e.g. AAD, ASPS), never clinic marketing.
 */
export interface Link {
  label: string;
  url: string;
}

const AAD = {
  botoxOverview: { label: "AAD — Botulinum toxin: overview", url: "https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin-overview" },
  botoxFaq: { label: "AAD — Botulinum toxin: FAQs", url: "https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin-faqs" },
  fillersOverview: { label: "AAD — Fillers: overview", url: "https://www.aad.org/public/cosmetic/wrinkles/fillers-overview" },
  fillersFaq: { label: "AAD — Fillers: FAQs", url: "https://www.aad.org/public/cosmetic/wrinkles/fillers-faqs" },
  fillersPrep: { label: "AAD — Fillers: how to prepare", url: "https://www.aad.org/public/cosmetic/wrinkles/fillers-preparation" },
  needleFree: { label: "AAD — Needle-free fillers: the risks", url: "https://www.aad.org/public/cosmetic/safety/needle-free-filler-risks" },
  firm: { label: "AAD — Many ways to firm sagging skin", url: "https://www.aad.org/public/cosmetic/younger-looking/firm-sagging-skin" },
  sunDamage: { label: "AAD — How dermatologists treat sun-damaged skin", url: "https://www.aad.org/public/everyday-care/sun-protection/sun-damage-skin/wrinkles-sun-damage-can-be-treated" },
  acneScars: { label: "AAD — Acne scars: consultation and treatment", url: "https://www.aad.org/public/diseases/acne/derm-treat/scars/treatment" },
  acneLights: { label: "AAD — Lasers and lights: how well do they treat acne?", url: "https://www.aad.org/public/diseases/acne-and-rosacea/lasers-and-lights-how-well-do-they-treat-acne" },
  ak: { label: "AAD — Actinic keratosis treatment (explains PDT)", url: "https://www.aad.org/public/diseases/skin-cancer/actinic-keratosis-treatment" },
  acne: { label: "AAD — Acne: diagnosis and treatment", url: "https://www.aad.org/public/diseases/acne/derm-treat/treat" },
  rosaceaLasers: { label: "AAD — Lasers and lights for rosacea", url: "https://www.aad.org/public/diseases/rosacea/treatment/lasers-lights" },
  lasersTreat: { label: "AAD — Skin conditions lasers can treat", url: "https://www.aad.org/public/diseases/a-z/skin-conditions-lasers-treat" },
  needling: { label: "AAD — Microneedling can fade scars and uneven tone", url: "https://www.aad.org/public/cosmetic/scars-stretch-marks/microneedling-fade-scars" },
  prp: { label: "AAD — Is PRP the secret to younger-looking skin?", url: "https://www.aad.org/public/cosmetic/younger-looking/platelet-rich-plasma-secret-to-younger-skin" },
  peelsOverview: { label: "AAD — Chemical peels: overview", url: "https://www.aad.org/public/cosmetic/younger-looking/chemical-peels-overview" },
  peelsFaq: { label: "AAD — Chemical peels: FAQs", url: "https://www.aad.org/public/cosmetic/younger-looking/chemical-peels-faqs" },
  younger: { label: "AAD — Younger-looking skin", url: "https://www.aad.org/public/cosmetic/younger-looking" },
  wrinkles: { label: "AAD — Wrinkles", url: "https://www.aad.org/public/cosmetic/wrinkles" },
  melasma: { label: "AAD — Melasma: diagnosis and treatment", url: "https://www.aad.org/public/diseases/a-z/melasma-treatment" },
  unsafe: { label: "AAD — Five unsafe skin care trends to avoid", url: "https://www.aad.org/news/5-unsafe-skin-care-trends-to-avoid" },
};
const ASPS = {
  threads: { label: "ASPS — Thread lift", url: "https://www.plasticsurgery.org/cosmetic-procedures/thread-lift" },
};

const FILLERS = [AAD.fillersOverview, AAD.fillersFaq, AAD.fillersPrep];

export const LEARN: Record<string, Link[]> = {
  "smile-filler": FILLERS,
  xerf: [AAD.firm],
  "sylfirm-x": [AAD.melasma, AAD.needling],
  ultraclear: [AAD.sunDamage, AAD.lasersTreat],
  aviclear: [AAD.acneLights, AAD.acne],
  bellafill: [AAD.fillersOverview, AAD.acneScars],
  aerolase: [AAD.acneLights, AAD.acne],
  "laser-toning": [AAD.melasma, AAD.lasersTreat],
  pdt: [AAD.acneLights, AAD.ak],
  ktp: [AAD.rosaceaLasers, AAD.lasersTreat],
  microcurrent: [AAD.younger],
  botox: [AAD.botoxOverview, AAD.botoxFaq],
  "cheek-filler": FILLERS,
  "under-eye": FILLERS,
  radiesse: FILLERS,
  skinvive: FILLERS,
  sculptra: FILLERS,
  sofwave: [AAD.firm],
  ultherapy: [AAD.firm],
  thermage: [AAD.firm],
  morpheus8: [AAD.firm, AAD.acneScars],
  co2: [AAD.firm, AAD.sunDamage, AAD.acneScars],
  fraxel: [AAD.sunDamage, AAD.acneScars],
  "clear-brilliant": [AAD.sunDamage, AAD.lasersTreat],
  tixel: [AAD.sunDamage],
  led: [AAD.younger],
  pico: [AAD.lasersTreat, AAD.sunDamage],
  ipl: [AAD.rosaceaLasers, AAD.sunDamage],
  pdl: [AAD.rosaceaLasers, AAD.lasersTreat],
  microneedling: [AAD.needling, AAD.acneScars],
  threads: [ASPS.threads],
  erbium: [AAD.firm, AAD.sunDamage],
  emface: [AAD.firm],
};

/** Plain-language starting point for each goal, as a dermatologist would frame it. */
export const GOAL_GUIDE: Record<Goal, { intro: string; learn: Link[] }> = {
  lines: {
    intro: "Lines that appear when you move (frown, forehead, crow's feet) are treated with neuromodulators such as Botox. Folds and lines at rest are treated with filler, resurfacing or collagen-building treatments.",
    learn: [AAD.wrinkles, AAD.sunDamage],
  },
  lift: {
    intro: "Ultrasound and radiofrequency tighten gradually, with the best results around 6 months. Laser resurfacing tightens more but needs downtime. A board-certified dermatologist or plastic surgeon can tell you whether a non-surgical option can give the result you expect.",
    learn: [AAD.firm],
  },
  texture: {
    intro: "Resurfacing lasers and microneedling renew the skin's surface. Gentle options need several sessions; stronger ones need downtime.",
    learn: [AAD.sunDamage, AAD.younger],
  },
  volume: {
    intro: "Hyaluronic acid fillers add volume right away and can be dissolved. Collagen-stimulating injectables (Sculptra, Radiesse) build gradually and last longer.",
    learn: [AAD.fillersOverview, AAD.fillersFaq],
  },
  pigment: {
    intro: "Lasers and IPL lighten sun spots. Melasma behaves differently: dermatologists usually start with medical treatment, and studies show some lasers can make it worse.",
    learn: [AAD.sunDamage, AAD.melasma],
  },
  redness: {
    intro: "Pulsed dye laser, KTP laser and IPL reduce persistent redness and visible vessels over a few sessions. A dermatologist can confirm whether it is rosacea.",
    learn: [AAD.rosaceaLasers],
  },
  acne: {
    intro: "Microneedling, RF microneedling, lasers and Bellafill (for rolling scars) can soften acne scars. Most need several sessions.",
    learn: [AAD.acneScars, AAD.needling],
  },
  glow: {
    intro: "Gentle lasers, LED and skin boosters such as SkinVive add glow with little or no downtime. Some have little research, and we say so on each one.",
    learn: [AAD.younger, AAD.sunDamage],
  },
  breakouts: {
    intro: "Acne is first treated with medicine by a dermatologist. In-office options such as AviClear, PDT and Aerolase are used alongside it. The AAD's acne guideline found the evidence too limited to formally recommend these procedures, and they rarely clear acne on their own.",
    learn: [AAD.acneLights, AAD.acne, { label: "AAD — Updated guidelines for acne management", url: "https://www.aad.org/news/updated-guidelines-acne-management" }],
  },
};

/** Order options from least to most involved, the way a dermatologist would build a plan. */
export const APPROACH_ORDER = ["toxin", "ha", "skin", "biostim", "laser", "energy", "threads"] as const;

export const UNSAFE_TRENDS: Link = AAD.unsafe;
