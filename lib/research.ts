import type { City } from "./types";

/**
 * Research and price sources for each procedure, checked November 2026.
 *
 * PRICES: `prices` lists only pages that publish a price (clinic price lists
 * or RealSelf patient-reported averages). A city with no listed source shows
 * as an estimate in the app.
 *
 * STUDIES: every study is indexed on PubMed (or PubMed Central). Links go to
 * the abstract. Titles are copied from the index. Many studies are small or
 * funded by the maker of the device or drug; the summary says so where that
 * applies. Never add a study you have not found on PubMed yourself.
 */

export const CHECKED = "November 2026";

export interface Source {
  label: string;
  url: string;
  /** City the price applies to. Omit for national averages. */
  city?: City;
}

export interface Study {
  title: string;
  url: string;
  kind: "Systematic review" | "Meta-analysis" | "Randomized trial" | "Clinical study" | "Review" | "Lab study" | "Expert consensus";
}

export interface Research {
  resultsIn: string;
  sideEffects: string;
  /** Optional per-unit price people search for (e.g. Botox per unit). */
  unitPrice?: Record<City, string>;
  prices: Source[];
  /** 1 limited, 2 some, 3 strong. */
  evidence: 1 | 2 | 3;
  evidenceNote: string;
  studies: Study[];
}

const pm = (id: string) => `https://pubmed.ncbi.nlm.nih.gov/${id}/`;
const pmc = (id: string) => `https://www.ncbi.nlm.nih.gov/pmc/articles/${id}/`;

export const RESEARCH: Record<string, Research> = {
  sofwave: {
    resultsIn: "Gradually over about 3 months",
    sideEffects: "Temporary redness, mild swelling or tenderness",
    prices: [
      { label: "Tribeca Park Dermatology — price list", url: "https://triparkderm.com/treatments/sofwave/", city: "nyc" },
      { label: "Manhattan Aesthetics — Sofwave pricing", url: "https://www.manhattan-aesthetics.com/how-much-does-sofwave-cost-nyc/", city: "nyc" },
    ],
    evidence: 1,
    evidenceNote: "Small studies show tightening and new collagen; most are linked to the device maker. No large randomized trials yet.",
    studies: [
      { title: "High-Intensity, Parallel Ultrasound Tightening of Facial Skin: Clinical and Pathologic Results", url: pmc("PMC11845918"), kind: "Clinical study" },
      { title: "Synchronous Parallel Ultrasound Induces Long-Term Extracellular Matrix Remodeling of Human Skin", url: pm("41405933"), kind: "Lab study" },
    ],
  },
  ultherapy: {
    resultsIn: "Gradually over 2–3 months, up to 6",
    sideEffects: "Redness, swelling, tenderness; rarely temporary bruising or numbness",
    prices: [
      { label: "RealSelf — Ultherapy cost by city (NYC average)", url: "https://www.realself.com/nonsurgical/ultherapy/cost", city: "nyc" },
      { label: "Manhattan practice prices quoted in AOL feature", url: "https://www.aol.com/tried-noninvasive-treatment-snatched-jawline-143500389.html", city: "nyc" },
      { label: "RealSelf — Ultherapy in Miami", url: "https://www.realself.com/Ultherapy/cost/Florida/Miami", city: "miami" },
    ],
    evidence: 2,
    evidenceNote: "A systematic review supports modest lifting and tightening, e.g. small brow lifts measured in millimeters.",
    studies: [
      { title: "A Systematic Review of the Efficacy of Microfocused Ultrasound for Facial Skin Tightening", url: pmc("PMC9861614"), kind: "Systematic review" },
      { title: "Retrospective evaluation of micro-focused ultrasound for lifting and tightening the face and neck", url: pm("24689931"), kind: "Clinical study" },
    ],
  },
  thermage: {
    resultsIn: "Some tightening right away; most over 2–6 months",
    sideEffects: "Redness and mild swelling; rare burns",
    prices: [
      { label: "Michele Green MD (NYC) — Thermage cost", url: "https://www.michelegreenmd.com/how-much-does-thermage-cost", city: "nyc" },
      { label: "RealSelf — Thermage cost (national)", url: "https://www.realself.com/nonsurgical/thermage/cost" },
    ],
    evidence: 1,
    evidenceNote: "Mild tightening reported, mostly in older or retrospective studies.",
    studies: [
      { title: "Monopolar radiofrequency facial tightening: a retrospective analysis of efficacy and safety in over 600 treatments", url: pm("16989184"), kind: "Clinical study" },
      { title: "Thermage: the nonablative radiofrequency for rejuvenation", url: pm("18940540"), kind: "Review" },
    ],
  },
  morpheus8: {
    resultsIn: "Over 1–3 months after each session",
    sideEffects: "Redness, swelling and grid marks for a few days",
    prices: [{ label: "RealSelf — Morpheus8 cost (national average)", url: "https://www.realself.com/nonsurgical/morpheus8/cost" }],
    evidence: 2,
    evidenceNote: "Systematic reviews find RF microneedling likely effective for acne scars; studies are mostly small.",
    studies: [
      { title: "Fractional Radiofrequency Microneedling as a Monotherapy in Acne Scar Management: A Systematic Review of Current Evidence", url: pm("39781098"), kind: "Systematic review" },
      { title: "Meta-analysis of fractional radiofrequency treatment for acne and/or acne scars", url: pm("36062400"), kind: "Meta-analysis" },
    ],
  },
  co2: {
    resultsIn: "After healing (about 2 weeks), improving for months",
    sideEffects: "Redness for weeks, swelling, crusting; risk of pigment changes, infection or scarring",
    prices: [{ label: "RealSelf — CO2 laser cost (national)", url: "https://www.realself.com/nonsurgical/co2-laser/cost" }],
    evidence: 2,
    evidenceNote: "Studies show improvement in wrinkles and sun damage; most are small and uncontrolled.",
    studies: [
      { title: "Fractional carbon dioxide laser for facial rejuvenation: A prospective study to evaluate the efficacy and the safety", url: pm("28759274"), kind: "Clinical study" },
      { title: "Expert Consensus on Clinical Recommendations for Fractional Ablative CO2 Laser, in Facial Skin Rejuvenation Treatment", url: pm("39434507"), kind: "Expert consensus" },
    ],
  },
  fraxel: {
    resultsIn: "After 1–2 sessions; best about 3 months after the series",
    sideEffects: "Redness, swelling, bronzing and flaking for several days",
    prices: [
      { label: "Skinly Aesthetics (NYC) — Fraxel pricing", url: "https://skinlyaesthetics.com/?p=2838", city: "nyc" },
      { label: "Dr. Debra Jaliman (NYC) — Fraxel review & cost", url: "https://www.dermatologist-nyc.com/blog/fraxel-laser-a-dermatologists-honest-review-47478", city: "nyc" },
      { label: "RealSelf — Fraxel in Miami", url: "https://www.realself.com/Fraxel-Laser/cost/Florida/Miami", city: "miami" },
    ],
    evidence: 2,
    evidenceNote: "Randomized split-face trials show improvement in acne scars.",
    studies: [
      { title: "Comparative study on efficacy and safety of 1550 nm Er:Glass fractional laser and fractional radiofrequency microneedle device for facial atrophic acne scar", url: pm("25810322"), kind: "Randomized trial" },
      { title: "Combined Fractional Treatment of Acne Scars Involving Non-ablative 1,550-nm Erbium-glass Laser and Micro-needling Radiofrequency: A 16-week Prospective, Randomized Split-face Study", url: pm("28512669"), kind: "Randomized trial" },
    ],
  },
  halo: {
    resultsIn: "Glow in about a week; more over the following months",
    sideEffects: "Redness, swelling, tiny dark dots that flake off",
    prices: [{ label: "RealSelf — Halo laser cost (national)", url: "https://www.realself.com/nonsurgical/halo-laser/cost" }],
    evidence: 1,
    evidenceNote: "Few published studies. One comparison found CO2 more effective, but patients preferred Halo's easier recovery.",
    studies: [
      { title: "Hybrid fractional laser treatment for photodamaged facial skin rejuvenation 6 years following fractional CO2: Comparison of clinical outcome and patients' satisfaction", url: pm("35819131"), kind: "Clinical study" },
    ],
  },
  moxi: {
    resultsIn: "Within about a week",
    sideEffects: "Mild redness and a sandpaper feel for a few days",
    prices: [
      { label: "Dr. Debra Jaliman (NYC) — Clear + Brilliant", url: "https://www.dermatologist-nyc.com/clear-brilliant/", city: "nyc" },
      { label: "Deep Blue Med Spa (NYC) — Clear + Brilliant", url: "https://www.deepbluemedspa.com/locations/nyc/clear-brilliant/", city: "nyc" },
    ],
    evidence: 1,
    evidenceNote: "Small studies of gentle 1927 nm lasers show improvement in sun spots and tone.",
    studies: [
      { title: "Prospective study of efficacy and safety of non-ablative 1927 nm fractional thulium fiber laser in Asian skin photoaging", url: pmc("PMC10025463"), kind: "Clinical study" },
      { title: "A randomized, single-blind, study evaluating a 755-nm picosecond pulsed Alexandrite laser vs. a non-ablative 1927-nm fractionated thulium laser for the treatment of facial photopigmentation and aging", url: pm("30019970"), kind: "Randomized trial" },
    ],
  },
  microneedling: {
    resultsIn: "Gradually over the series",
    sideEffects: "Redness, dryness, pinpoint bleeding for 1–3 days",
    prices: [
      { label: "Skinly Aesthetics (NYC) — microneedling", url: "https://skinlyaesthetics.com/microneedling-nyc", city: "nyc" },
      { label: "RealSelf — microneedling cost (national)", url: "https://www.realself.com/nonsurgical/microneedling/cost" },
    ],
    evidence: 1,
    evidenceNote: "Reviews are favorable for acne scars, but high-quality controlled trials are few.",
    studies: [
      { title: "Microneedling: Percutaneous Collagen Induction (PCI) Therapy for Management of Scars and Photoaged Skin — Scientific Evidence and Review of the Literature", url: pm("32875437"), kind: "Review" },
      { title: "Safety and efficacy of microneedling technology in the treatment of acne scars", url: pm("34596936"), kind: "Clinical study" },
    ],
  },
  prp: {
    resultsIn: "Gradually over the series",
    sideEffects: "Redness, swelling, bruising where blood is drawn",
    prices: [
      { label: "Fresha — PRP facials in Manhattan", url: "https://www.fresha.com/lp/en/tt/prp-facials/in/us-new-york/manhattan", city: "nyc" },
      { label: "Fresha — vampire facials in Miami", url: "https://www.fresha.com/lp/en/tt/vampire-facials/in/us-miami", city: "miami" },
      { label: "RealSelf — vampire facial cost (national)", url: "https://www.realself.com/nonsurgical/vampire-facial/cost" },
    ],
    evidence: 1,
    evidenceNote: "A meta-analysis favors adding PRP to microneedling for acne scars, but an overview rates the certainty as low.",
    studies: [
      { title: "Combined Effect of Microneedling and Platelet-Rich Plasma for the Treatment of Acne Scars: A Meta-Analysis", url: pm("35237616"), kind: "Meta-analysis" },
      { title: "Platelet rich plasma use for treatment of acne scars: an overview of systematic reviews", url: pm("37677095"), kind: "Systematic review" },
    ],
  },
  sculptra: {
    resultsIn: "Gradually over 2–3 months",
    sideEffects: "Swelling, bruising, tenderness; rare small lumps under the skin",
    prices: [{ label: "RealSelf — Sculptra cost (national)", url: "https://www.realself.com/nonsurgical/sculptra-aesthetic/cost" }],
    evidence: 2,
    evidenceNote: "Randomized trials and a systematic review support gradual volume restoration.",
    studies: [
      { title: "Efficacy and Safety of Poly-l-Lactic Acid in Facial Aesthetics: A Systematic Review", url: pmc("PMC11435306"), kind: "Systematic review" },
      { title: "Efficacy and Safety of Poly-l-Lactic Acid for Correction of Midfacial Volume Loss and Contour Defects: A Prospective, Multicenter, Randomized, Parallel-Controlled, Evaluator-Blinded, Superiority Trial", url: pm("40679154"), kind: "Randomized trial" },
    ],
  },
  botox: {
    resultsIn: "Starts in 3–5 days; full effect at about 2 weeks",
    sideEffects: "Small bumps, bruising, headache; rarely a droopy eyelid or brow",
    unitPrice: { nyc: "~$12–25 per unit (some practices $30+)", miami: "~$11–20 per unit" },
    prices: [
      { label: "RealSelf — Botox cost (NYC average ~$800)", url: "https://www.realself.com/nonsurgical/botox/cost", city: "nyc" },
      { label: "Dermatology & Laser Group (NYC) — Botox prices", url: "https://dermatologyandlasergroup.com/botox-cost-nyc-prices/", city: "nyc" },
      { label: "RealSelf Q&A — Botox price per unit in Miami", url: "https://www.realself.com/question/miami-fl-price-botox-unit-miami", city: "miami" },
    ],
    evidence: 3,
    evidenceNote: "Many randomized, placebo-controlled trials; a meta-analysis confirms it works for frown lines.",
    studies: [
      { title: "Efficacy and Safety of Botulinum Toxin Type A in the Treatment of Glabellar Lines: A Meta-Analysis of Randomized, Placebo-Controlled, Double-Blind Trials", url: pm("26313835"), kind: "Meta-analysis" },
      { title: "Phase 3 Study of OnabotulinumtoxinA Distributed Between Frontalis, Glabellar Complex, and Lateral Canthal Areas for Treatment of Upper Facial Lines", url: pm("30096106"), kind: "Randomized trial" },
    ],
  },
  "lip-filler": {
    resultsIn: "Right away; swelling settles in about 2 weeks",
    sideEffects: "Swelling, bruising, tenderness; rare but serious blocked blood vessel",
    prices: [
      { label: "Skinly Aesthetics (NYC) — lip filler", url: "https://skinlyaesthetics.com/lip-fillers-nyc/", city: "nyc" },
      { label: "Ethos Spa (Miami) — lip filler guide", url: "https://myethosspa.com/miami-lip-fillers-essential-guide-to-choosing-the-best-provider", city: "miami" },
      { label: "RealSelf — lip filler cost (national)", url: "https://www.realself.com/nonsurgical/lip-filler/cost" },
    ],
    evidence: 3,
    evidenceNote: "Multiple randomized controlled trials of hyaluronic acid lip fillers.",
    studies: [
      { title: "Juvéderm Volbella with lidocaine for lip and perioral enhancement: a prospective, randomized, controlled trial", url: pm("25878932"), kind: "Randomized trial" },
      { title: "Head-to-head comparison of 4 hyaluronic acid dermal fillers for lip augmentation: A multicenter randomized, quadruple-blind, controlled clinical trial", url: pm("36370906"), kind: "Randomized trial" },
    ],
  },
  "cheek-filler": {
    resultsIn: "Right away; settles in 2–4 weeks",
    sideEffects: "Swelling, bruising, tenderness; rare but serious blocked blood vessel",
    prices: [
      { label: "Skinly Aesthetics (NYC) — Juvéderm Voluma", url: "https://skinlyaesthetics.com/juvederm-voluma/", city: "nyc" },
      { label: "Dr. Kopelman (NYC) — Juvéderm cost by syringe", url: "https://drkopelman.com/juvederm-filler-cost/", city: "nyc" },
    ],
    evidence: 3,
    evidenceNote: "A pivotal randomized trial found cheek correction lasting up to 2 years.",
    studies: [
      { title: "Volumizing hyaluronic acid filler for midface volume deficit: 2-year results from a pivotal single-blind randomized controlled study", url: pm("24093664"), kind: "Randomized trial" },
      { title: "Efficacy and safety of different hyaluronic acid fillers on cheek volume augmentation: systematic review and network meta-analysis", url: pm("39708174"), kind: "Meta-analysis" },
    ],
  },
  radiesse: {
    resultsIn: "Right away, improving as collagen builds",
    sideEffects: "Swelling, bruising; rare lumps; cannot be dissolved like hyaluronic acid",
    prices: [
      { label: "Skinly Aesthetics (NYC) — Radiesse", url: "https://skinlyaesthetics.com/radiesse-nyc", city: "nyc" },
      { label: "RealSelf — Radiesse cost (national)", url: "https://www.realself.com/nonsurgical/radiesse/cost" },
    ],
    evidence: 2,
    evidenceNote: "Long-term studies show lasting results in smile lines; most studies are industry-linked.",
    studies: [
      { title: "Calcium hydroxylapatite (Radiesse) for treatment of nasolabial folds: long-term safety and efficacy results", url: pm("20442101"), kind: "Randomized trial" },
      { title: "Evaluation of a calcium hydroxylapatite-based implant (Radiesse) for facial soft-tissue augmentation", url: pm("16936541"), kind: "Clinical study" },
    ],
  },
  skinvive: {
    resultsIn: "Within 2–4 weeks",
    sideEffects: "Small bumps, redness, swelling or bruising for a few days",
    prices: [{ label: "CareCredit — Skinvive cost (national average)", url: "https://www.carecredit.com/well-u/health-wellness/skinvive-cost/" }],
    evidence: 1,
    evidenceNote: "Approved based on a manufacturer trial; we could not confirm its full results. Published guidance is expert opinion.",
    studies: [
      { title: "Expert Consensus on Injection Technique and Area-Specific Recommendations for the Hyaluronic Acid Dermal Filler VYC-12L to Treat Fine Cutaneous Lines", url: pm("32308460"), kind: "Expert consensus" },
    ],
  },
  kybella: {
    resultsIn: "After 2 or more sessions, 4–6 weeks apart",
    sideEffects: "Swelling, bruising, numbness and firmness; rare nerve injury (uneven smile) or hair loss at the site",
    prices: [
      { label: "AEDIT — Kybella cost per vial (NYC & Miami)", url: "https://aedit.com/procedure/kybella/cost", city: "nyc" },
      { label: "AEDIT — Kybella cost per vial (NYC & Miami)", url: "https://aedit.com/procedure/kybella/cost", city: "miami" },
    ],
    evidence: 3,
    evidenceNote: "Large phase 3 placebo-controlled trials (REFINE-1 and -2) showed fat reduction under the chin.",
    studies: [
      { title: "ATX-101 for reduction of submental fat: A phase III randomized controlled trial", url: pm("27430612"), kind: "Randomized trial" },
      { title: "Efficacy and Safety of ATX-101 by Treatment Session: Pooled Analysis of Data From the Phase 3 REFINE Trials", url: pm("29401213"), kind: "Meta-analysis" },
    ],
  },
  threads: {
    resultsIn: "Right away; settles over a few weeks",
    sideEffects: "Bruising, swelling, dimpling, asymmetry, a thread poking through",
    prices: [
      { label: "PFRANKMD (NYC) — thread lift", url: "https://pfrankmd.com/procedure/skin-tightening/thread-lift", city: "nyc" },
      { label: "RealSelf — thread lift cost (national)", url: "https://www.realself.com/thread-lift/cost" },
    ],
    evidence: 1,
    evidenceNote: "Mostly small or retrospective studies. A 2,000-case review found complications in about 1 in 8 patients.",
    studies: [
      { title: "Incidence and Predictors of Complications After Polydioxanone Thread Lift: A Multicenter Retrospective Cohort Study", url: pm("42236870"), kind: "Clinical study" },
      { title: "Outcomes of polydioxanone knotless thread lifting for facial rejuvenation", url: pm("25993611"), kind: "Clinical study" },
    ],
  },
  hydrafacial: {
    resultsIn: "Right away",
    sideEffects: "Mild, short-lived redness",
    prices: [{ label: "Oasis Day Spa (NYC) — HydraFacial menu", url: "https://www.oasisdayspanyc.com/hydrafacial/", city: "nyc" }],
    evidence: 1,
    evidenceNote: "We found no independent clinical trials on PubMed. Benefits are short-term and cosmetic.",
    studies: [],
  },
  dermaplaning: {
    resultsIn: "Right away",
    sideEffects: "Mild redness; rare small nicks",
    prices: [
      { label: "AEDIT — dermaplaning cost (NYC & Miami)", url: "https://aedit.com/procedure/dermaplaning/cost", city: "nyc" },
      { label: "Fresha — dermaplaning in Miami", url: "https://www.fresha.com/lp/en/tt/dermaplaning/in/us-miami", city: "miami" },
    ],
    evidence: 1,
    evidenceNote: "No clinical trials found. A lab study shows it removes the outer skin layer, which can make products absorb more.",
    studies: [
      { title: "Dermaplaning for Transdermal Drug Permeation Enhancement: A Qualitative and Quantitative Assessment", url: pm("36725790"), kind: "Lab study" },
    ],
  },
  peel: {
    resultsIn: "After peeling, about 1 week",
    sideEffects: "Redness, peeling, sensitivity; risk of dark spots, especially on deeper skin tones",
    prices: [
      { label: "Minars Dermatology (Miami area) — Miami Peel", url: "https://www.minarsdermatology.com/cosmetic-laser/skin-peel-introduction/miami-peel/", city: "miami" },
      { label: "RealSelf — VI Peel cost (national)", url: "https://www.realself.com/nonsurgical/vi-peel/cost" },
    ],
    evidence: 2,
    evidenceNote: "Good evidence for melasma and acne; melasma often returns without maintenance.",
    studies: [
      { title: "Efficacy and tolerability of chemical peeling as a single agent for melasma in dark-skinned patients: A systematic review and meta-analysis of comparative trials", url: pm("32947652"), kind: "Meta-analysis" },
      { title: "Glycolic acid peel therapy — a current review", url: pm("24399880"), kind: "Review" },
    ],
  },
  ipl: {
    resultsIn: "Spots darken and flake off in 1–2 weeks",
    sideEffects: "Redness, swelling, temporary darkening; burns or light spots if settings are wrong",
    prices: [{ label: "RealSelf — BBL cost (national)", url: "https://www.realself.com/nonsurgical/broadband-light-bbl/cost" }],
    evidence: 2,
    evidenceNote: "Works better for sun spots and redness than for wrinkles.",
    studies: [
      { title: "A split-face study of intense pulsed light on photoaging skin in Chinese population", url: pm("20166160"), kind: "Clinical study" },
      { title: "Intense pulsed light (IPL): a review", url: pm("20166155"), kind: "Review" },
    ],
  },
  pico: {
    resultsIn: "1–2 weeks after each session",
    sideEffects: "Redness, swelling, temporary darkening",
    prices: [],
    evidence: 2,
    evidenceNote: "Small studies, including a randomized trial and a 3-year follow-up, show improvement in pigment and texture.",
    studies: [
      { title: "Safety and efficacy of a novel diffractive lens array using a picosecond 755 nm alexandrite laser for treatment of wrinkles", url: pm("27681221"), kind: "Clinical study" },
      { title: "Three-Year Results of Facial Photoaging in Asian Patients After Alexandrite 755 nm Picosecond Laser With Diffractive Lens Array: A Split-Face, Single-Blinded, Randomized Controlled Comparison", url: pm("33604905"), kind: "Randomized trial" },
    ],
  },
  coolsculpting: {
    resultsIn: "From about 1 month; full result at about 3 months",
    sideEffects: "Numbness, redness, swelling; rare paradoxical fat growth (may be more common than the maker reports)",
    prices: [
      { label: "Skinney Medspa — CoolSculpting cost in NYC", url: "https://skinneymedspa.com/coolsculpting-cost-in-nyc/", city: "nyc" },
      { label: "Skinney Medspa — CoolSculpting cost in Miami", url: "https://www.skinneymedspa.com/coolsculpting-cost-miami/", city: "miami" },
    ],
    evidence: 2,
    evidenceNote: "Meta-analyses show local fat and circumference reduction, but no weight loss.",
    studies: [
      { title: "Effectiveness of Cryolipolysis in Body Contouring and Fat Reduction: A Systematic Review and Meta-analysis", url: pm("41607567"), kind: "Meta-analysis" },
      { title: "Incidence of Paradoxical Adipose Hyperplasia After Cryolipolysis: A Systematic Review and Meta-Analysis", url: pm("41322038"), kind: "Meta-analysis" },
    ],
  },
  emsculpt: {
    resultsIn: "1–3 months after the last session",
    sideEffects: "Muscle soreness, warmth, redness",
    prices: [{ label: "Dermatology & Laser Group (NYC) — Emsculpt Neo cost", url: "https://dermatologyandlasergroup.com/cost-of-emsculpt-neo/", city: "nyc" }],
    evidence: 1,
    evidenceNote: "MRI studies report fat loss and muscle gain, but a review notes nearly all were by the maker's advisors.",
    studies: [
      { title: "Efficacy and Safety of Simultaneous Application of HIFEM and Synchronized Radiofrequency for Abdominal Fat Reduction and Muscle Toning: A Multicenter Magnetic Resonance Imaging Evaluation Study", url: pm("34001694"), kind: "Clinical study" },
      { title: "Body Contouring With Electromagnetic Treatment Plus Radiofrequency: A Review", url: pm("39773625"), kind: "Review" },
    ],
  },
  "laser-hair": {
    resultsIn: "Hair sheds in 1–3 weeks; reduction builds over the series",
    sideEffects: "Redness and bumps; rare burns or pigment changes",
    prices: [
      { label: "LaserAway — pricing", url: "https://www.laseraway.com/pricing/" },
      { label: "Dr. Debra Jaliman (NYC) — laser hair removal", url: "https://dermatologist-nyc.com/laser-hair-removal", city: "nyc" },
      { label: "LaserAway — laser hair removal cost in Miami", url: "https://www.laseraway.com/faqs/hair-removal/laser-hair-removal-cost-in-miami/", city: "miami" },
    ],
    evidence: 3,
    evidenceNote: "Randomized trials show long-term partial reduction — not permanent removal.",
    studies: [
      { title: "Efficacy of lasers and light sources in long-term hair reduction: a systematic review", url: pm("35634805"), kind: "Systematic review" },
      { title: "Evidence-based review of hair removal using lasers and light sources", url: pm("16405602"), kind: "Systematic review" },
    ],
  },
};

export const EVIDENCE_LABELS = ["", "Limited", "Some", "Strong"];

/** True when a clinic or RealSelf page publishes a price for this city. */
export function priceChecked(id: string, city: City) {
  return RESEARCH[id]?.prices.some((s) => s.city === city) ?? false;
}

export const CONSULT_QUESTIONS = [
  "Who will do my treatment, and what is their license and board certification?",
  "How many of these treatments have you done? Can I see your own before-and-after photos?",
  "Is this the brand-name product or device? (For injectables, ask to see the box and lot number.)",
  "What is the total price, including numbing, consultation fees and touch-ups?",
  "How many sessions will I really need, and how long will results last for me?",
  "What could go wrong, and how would you handle a complication?",
];
