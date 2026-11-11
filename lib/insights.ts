/**
 * Evidence-based "core insights". Every dated entry links to its source.
 * Treatments whose first U.S. approval/clearance date we could not confirm
 * (e.g. HydraFacial, Halo, Moxi, PDO threads, Thermage, Sculptra, Emface)
 * are deliberately left off the timeline.
 */
import type { Procedure } from "./types";

export interface Milestone {
  year: string;
  title: string;
  detail: string;
  ids: string[];
  source: { label: string; url: string };
}

export const TIMELINE: Milestone[] = [
  { year: "2002", title: "Botox Cosmetic approved for frown lines", detail: "Dysport followed in 2009, Jeuveau in 2019 and long-acting Daxxify in 2022.", ids: ["botox"], source: { label: "Drugs.com — Daxxify approval (neuromodulator history)", url: "https://www.drugs.com/newdrugs/fda-approves-daxxify-daxibotulinumtoxina-lanm-temporary-improvement-moderate-severe-glabellar-lines-5894.html" } },
  { year: "2003", title: "First hyaluronic acid filler approved (Restylane)", detail: "Juvéderm followed in 2006 and Voluma for cheeks in 2013.", ids: ["cheek-filler"], source: { label: "MDedge — Update on hyaluronic acid fillers", url: "https://www.mdedge.com/content/update-hyaluronic-acid-fillers-facial-rejuvenation/page/0/1" } },
  { year: "2004", title: "Fractional laser resurfacing introduced (Fraxel)", detail: "Treating skin in tiny columns made resurfacing safer with shorter recovery.", ids: ["fraxel", "co2", "halo", "moxi", "clear-brilliant"], source: { label: "JCAD — Update on fractional laser technology", url: "https://jcadonline.com/aesthetic-update-update-on-fractional-laser-technology/" } },
  { year: "2006", title: "Radiesse approved", detail: "A calcium-based filler that also stimulates collagen.", ids: ["radiesse"], source: { label: "FDA summary — Radiesse", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf5/P050052s049b.pdf" } },
  { year: "2009", title: "Ultherapy cleared for a non-surgical brow lift", detail: "The first ultrasound device cleared for facial lifting.", ids: ["ultherapy"], source: { label: "BioSpace — Ulthera FDA clearance (2009)", url: "https://www.biospace.com/ulthera-receives-first-ever-fda-clearance-to-market-ultrasound-technology-for-facial-aesthetic-improvement" } },
  { year: "2012", title: "First picosecond aesthetic laser cleared (PicoSure)", detail: "Ultra-short pulses for pigment and tattoos; later cleared for wrinkles and acne scars.", ids: ["pico"], source: { label: "BioSpace — PicoSure FDA clearance", url: "https://www.biospace.com/cynosure-inc-receives-fda-clearance-for-picosure-and-0153" } },
  { year: "2019", title: "Sofwave first FDA-cleared", detail: "Parallel-beam ultrasound for lines and wrinkles; later cleared for more uses.", ids: ["sofwave"], source: { label: "FDA 510(k) K191421", url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K191421" } },
  { year: "2020", title: "Morpheus8 platform and body handpiece cleared", detail: "RF microneedling became widely marketed; FDA issued a safety communication on RF microneedling in 2025.", ids: ["morpheus8"], source: { label: "InMode — Morpheus8 platform announcement (2020)", url: "https://www.prnewswire.com/il/news-releases/inmode-introduces-the-morpheus8-platform-and-the-morpheus8-body-fractional-technology-301110212.html" } },
  { year: "2023", title: "Skinvive and the first under-eye filler approved", detail: "Skinvive for cheek smoothness; Restylane Eyelight for under-eye hollows.", ids: ["skinvive", "under-eye"], source: { label: "FDA — Skinvive approval", url: "https://www.fda.gov/medical-devices/recently-approved-devices/skinvive-juvederm-p110033s059" } },
  { year: "2024", title: "Botox Cosmetic approved for neck bands", detail: "The first neurotoxin approved for vertical platysma bands between the jaw and neck.", ids: ["botox"], source: { label: "Healio — FDA approves Botox Cosmetic for platysma bands", url: "https://cm.healio.com/news/dermatology/20241021/fda-approves-botox-cosmetic-for-platysma-bands" } },
];

/** Derived from our own data: recovery days and pain rating. */
export function intensity(p: Procedure): 1 | 2 | 3 {
  if (p.downtimeDays[1] >= 7 || p.pain >= 4) return 3;
  if (p.downtimeDays[1] <= 1 && p.pain <= 2) return 1;
  return 2;
}
export const INTENSITY = [
  "",
  "Light-touch — little or no recovery, mild discomfort",
  "Moderate — a few days of redness, swelling or bruising",
  "Intensive — a week or more of recovery or strong discomfort",
];

export interface Fact {
  fact: string;
  source: { label: string; url: string };
}

export const FACTS: Fact[] = [
  { fact: "Daily broad-spectrum SPF 30+ is the dermatologist's first step for wrinkles and spots — and keeps procedure results from fading.", source: { label: "AAD — How dermatologists treat sun-damaged skin", url: "https://www.aad.org/public/everyday-care/sun-protection/sun-damage-skin/wrinkles-sun-damage-can-be-treated" } },
  { fact: "Most fillers are temporary: hyaluronic acid lasts months to about a year; poly-L-lactic acid up to a few years.", source: { label: "AAD — Fillers: FAQs", url: "https://www.aad.org/public/cosmetic/wrinkles/fillers-faqs" } },
  { fact: "Botulinum toxin results usually appear in 3–7 days and last about 3–4 months.", source: { label: "AAD — Botulinum toxin: overview", url: "https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin-overview" } },
  { fact: "Ultrasound and radiofrequency tightening is gradual — the best results typically appear around 6 months.", source: { label: "AAD — Many ways to firm sagging skin", url: "https://www.aad.org/public/cosmetic/younger-looking/firm-sagging-skin" } },
  { fact: "Needle-free \"hyaluron pens\" are not FDA-approved for fillers and can cause permanent damage.", source: { label: "AAD — Needle-free fillers: the risks", url: "https://www.aad.org/public/cosmetic/safety/needle-free-filler-risks" } },
  { fact: "At-home microneedling and filler injections are among the trends dermatologists worry about most.", source: { label: "AAD — Five unsafe skin care trends", url: "https://www.aad.org/news/5-unsafe-skin-care-trends-to-avoid" } },
];
