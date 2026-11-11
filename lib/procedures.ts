import type { Approach, Budget, Procedure } from "./types";

/**
 * Educational reference data for popular procedures in NYC and Miami.
 * Prices are rough typical ranges per visit (or per syringe / area) and vary
 * widely by provider, product amount and area treated. Pain and results are
 * general typical ratings, not guarantees. Review periodically.
 * Brand names are used only to identify the treatments people search for.
 */
type Raw = Omit<Procedure, "tier">;

const RAW: Raw[] = [
  // ── Boosts your own collagen (natural) ─────────────────────────────
  {
    id: "sofwave", name: "Sofwave", what: "Ultrasound skin tightening", approach: "energy", onset: 3,
    summary: "Ultrasound energy heats the skin's middle layer to trigger new collagen, gently lifting brows, jawline and neck.",
    goals: ["lift", "lines"], cost: { nyc: [3000, 4500], miami: [2500, 4000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1 year; results build over 3 months", downtimeDays: [0, 0], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Known for being more comfortable than older ultrasound devices.",
  },
  {
    id: "ultherapy", name: "Ultherapy", what: "Focused ultrasound lifting", approach: "energy", onset: 3,
    summary: "Focused ultrasound reaches the deep support layer under the skin to lift and tighten over time.",
    goals: ["lift", "contour"], cost: { nyc: [2700, 5000], miami: [2000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "1–2 years; results build over 3–6 months", downtimeDays: [0, 1], pain: 4, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Ask what pain relief is offered — it can be uncomfortable.",
  },
  {
    id: "thermage", name: "Thermage FLX", what: "Radiofrequency skin tightening", approach: "energy", onset: 3,
    summary: "Radiofrequency heat tightens existing collagen and stimulates new collagen for firmer skin.",
    goals: ["lift", "texture"], cost: { nyc: [3500, 4500], miami: [3000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1–2 years", downtimeDays: [0, 0], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Not suitable with some implanted electronic devices — tell your provider.",
  },
  {
    id: "morpheus8", name: "Morpheus8", what: "Radiofrequency microneedling", approach: "energy", onset: 3, minAge: 22,
    summary: "Tiny needles deliver radiofrequency heat under the skin to tighten, smooth texture and soften acne scars.",
    goals: ["texture", "acne", "lift"], cost: { nyc: [1000, 2000], miami: [1000, 2000] }, priceUnit: "per session",
    sessions: "1–3, about 4–6 weeks apart", lasts: "1 year or more with maintenance", downtimeDays: [2, 5], pain: 4, results: 2,
    performedBy: "Dermatologist, plastic surgeon or supervised clinician",
    contraindications: ["pregnancy", "active-skin", "keloid", "blood-thinners", "isotretinoin"],
    notes: "Ask whether numbing cream is included in the price.",
  },
  {
    id: "co2", name: "CO2 Laser", what: "Ablative laser resurfacing", approach: "laser", onset: 3,
    summary: "The strongest laser resurfacing: removes damaged layers and triggers major collagen renewal.",
    goals: ["texture", "lines", "acne", "pigment"], cost: { nyc: [2000, 6000], miami: [2000, 5000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "Years, with sun protection", downtimeDays: [7, 14], pain: 5, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Plan 1–2 weeks off. Fully ablative laser is usually delayed while on isotretinoin (Accutane). Higher risk of pigment changes on deeper skin tones.",
  },
  {
    id: "fraxel", name: "Fraxel", what: "Fractional laser", approach: "laser", onset: 3,
    summary: "Laser treats tiny columns of skin to improve sun damage, fine lines, texture and scars.",
    goals: ["texture", "pigment", "lines", "acne"], cost: { nyc: [850, 2000], miami: [500, 1500] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin", "keloid"],
    notes: "Expect a few days of redness and a sandpaper feel.",
  },
  {
    id: "halo", name: "Halo Laser", what: "Hybrid fractional laser", approach: "laser", onset: 2,
    summary: "Combines two laser wavelengths to brighten tone and refine texture.",
    goals: ["pigment", "texture", "glow"], cost: { nyc: [1200, 2500], miami: [1200, 2200] }, priceUnit: "per session",
    sessions: "1–3", lasts: "Long-lasting with sun protection", downtimeDays: [5, 7], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "keloid"],
    notes: "Tiny dark dots flake off over about a week.",
  },
  {
    id: "moxi", name: "Moxi / Clear + Brilliant", what: "Gentle fractional laser", approach: "laser", onset: 2,
    summary: "A light 'baby laser' for glow, early sun spots and pore size with almost no recovery.",
    goals: ["glow", "texture", "pigment"], cost: { nyc: [450, 900], miami: [450, 850] }, priceUnit: "per session",
    sessions: "3–4, about 4 weeks apart", lasts: "Months; often done as maintenance", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Popular before events — skin looks fresher in a few days.",
  },
  {
    id: "microneedling", name: "Microneedling", what: "Collagen induction therapy", approach: "skin", onset: 3, minAge: 22,
    summary: "Fine needles make tiny controlled channels that prompt new collagen for smoother texture.",
    goals: ["texture", "acne", "glow", "lines"], cost: { nyc: [300, 600], miami: [250, 500] }, priceUnit: "per session",
    sessions: "3–6, about 4–6 weeks apart", lasts: "Long-lasting; gradual", downtimeDays: [1, 3], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["active-skin", "keloid", "blood-thinners", "isotretinoin"],
    notes: "Avoid at-home rollers for deep treatment — infection risk.",
  },
  {
    id: "prp", name: "PRP Microneedling", what: "\"Vampire facial\"", approach: "skin", onset: 3, minAge: 22,
    summary: "Microneedling with platelet-rich plasma from your own blood, aimed at glow and texture.",
    goals: ["texture", "glow", "acne"], cost: { nyc: [550, 1200], miami: [200, 900] }, priceUnit: "per session",
    sessions: "3, about 4–6 weeks apart", lasts: "Gradual; maintenance yearly", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin", "blood-thinners", "isotretinoin"],
    notes: "Evidence is still growing; make sure blood is handled in a medical setting.",
  },
  {
    id: "sculptra", name: "Sculptra", what: "Collagen-stimulating injectable", approach: "biostim", onset: 3, minAge: 22,
    summary: "An injectable that prompts your body to rebuild its own collagen, restoring volume gradually and naturally.",
    goals: ["volume", "lift", "lines"], cost: { nyc: [1000, 1500], miami: [800, 1100] }, priceUnit: "per vial",
    sessions: "Usually 2–3 vials over a few months", lasts: "Up to about 2 years", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "keloid", "autoimmune", "blood-thinners"],
    notes: "Injected product, but the result comes from your own collagen over 2–3 months.",
  },

  // ── Injectables & threads (instant, product-based) ──────────────────
  {
    id: "botox", name: "Botox / Dysport / Daxxify", what: "Neuromodulator injections (also Xeomin, Jeuveau)", approach: "toxin", onset: 2,
    summary: "Relaxes the muscles behind forehead lines, frown lines and crow's feet.",
    goals: ["lines"], cost: { nyc: [450, 1200], miami: [300, 900] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 3–4 months", downtimeDays: [0, 1], pain: 1, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "autoimmune", "active-skin"],
    notes: "Often priced per unit — ask for the total. Daxxify lasted a median of about 6 months in its trials; others about 3–4 months.",
  },
  {
    id: "lip-filler", name: "Lip Filler", what: "Hyaluronic acid filler", approach: "ha", onset: 1, minAge: 22,
    summary: "A gel made from hyaluronic acid — a substance naturally found in skin — injected to add shape and volume to the lips.",
    goals: ["volume"], cost: { nyc: [550, 1200], miami: [600, 1000] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 6–12 months", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Reversible with an enzyme if needed. Ask for a natural amount.",
  },
  {
    id: "cheek-filler", name: "Cheek & Jaw Filler", what: "Hyaluronic acid filler", approach: "ha", onset: 1, minAge: 22,
    summary: "Restores lost volume and sharpens cheekbones, chin or jawline right away.",
    goals: ["volume", "contour", "lift"], cost: { nyc: [800, 1500], miami: [750, 1200] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 2, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Rare but serious risks — choose an experienced medical injector.",
  },
  {
    id: "radiesse", name: "Radiesse", what: "Calcium-based filler", approach: "biostim", onset: 1, minAge: 22,
    summary: "Adds instant structure to cheeks, jawline and smile lines, and also stimulates some collagen.",
    goals: ["volume", "contour", "lift", "lines"], cost: { nyc: [900, 1400], miami: [700, 1100] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Not dissolvable like hyaluronic acid filler.",
  },
  {
    id: "skinvive", name: "Skinvive", what: "Hyaluronic skin booster", approach: "ha", onset: 2, minAge: 22,
    summary: "Micro-droplets of hyaluronic acid under the skin for a smoother, dewy glow — no added volume.",
    goals: ["glow", "texture"], cost: { nyc: [700, 1200], miami: [600, 1000] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 6 months", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners"],
    notes: "Subtle by design — think hydration, not shape.",
  },
  {
    id: "kybella", name: "Kybella", what: "Under-chin fat dissolving injections", approach: "fat", onset: 3,
    summary: "Injections that destroy fat cells in a small pocket of fat under the chin.",
    goals: ["contour"], cost: { nyc: [600, 750], miami: [500, 750] }, priceUnit: "per vial (2–4 per visit)",
    sessions: "2–4, about 4–6 weeks apart", lasts: "Long-lasting", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners"],
    notes: "Expect noticeable swelling for several days.",
  },
  {
    id: "threads", name: "PDO Thread Lift", what: "Dissolvable lifting threads", approach: "threads", onset: 1,
    summary: "Dissolvable threads placed under the skin lift sagging areas and prompt some collagen.",
    goals: ["lift", "contour"], cost: { nyc: [2000, 6000], miami: [1500, 4000] }, priceUnit: "per area",
    sessions: "Single visit", lasts: "About 6–12 months", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "keloid", "autoimmune"],
    notes: "Results vary a lot by injector skill.",
  },

  // ── Resurface & brighten ────────────────────────────────────────────
  {
    id: "hydrafacial", name: "HydraFacial", what: "Hydradermabrasion facial", approach: "skin", onset: 1,
    summary: "Cleanses, gently exfoliates and hydrates for an instant glow with zero recovery.",
    goals: ["glow", "texture"], cost: { nyc: [200, 330], miami: [175, 325] }, priceUnit: "per session",
    sessions: "Single; monthly for upkeep", lasts: "Days to weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin"],
    notes: "Great before an event.",
  },
  {
    id: "dermaplaning", name: "Dermaplaning", what: "Manual exfoliation", approach: "skin", onset: 1,
    summary: "A blade gently removes dead skin and peach fuzz for smooth, bright skin.",
    goals: ["glow", "texture"], cost: { nyc: [100, 250], miami: [60, 200] }, priceUnit: "per session",
    sessions: "Single; every 4 weeks", lasts: "About 3–4 weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin"],
    notes: "Hair does not grow back thicker.",
  },
  {
    id: "peel", name: "Chemical Peel", what: "Superficial to medium acid peel", approach: "skin", onset: 2,
    summary: "An acid solution removes the outer layer to brighten tone, smooth texture and calm breakouts.",
    goals: ["glow", "texture", "pigment", "acne"], cost: { nyc: [150, 500], miami: [150, 400] }, priceUnit: "per session",
    sessions: "3–6, about 4 weeks apart", lasts: "Months with skincare", downtimeDays: [0, 5], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised aesthetician", contraindications: ["pregnancy", "active-skin"],
    notes: "Deeper skin tones: choose a provider experienced with peels.",
  },
  {
    id: "ipl", name: "IPL / BBL Photofacial", what: "Broadband light therapy", approach: "laser", onset: 2,
    summary: "Light targets sun spots, redness and broken capillaries for a clearer, even tone. Also used for rosacea redness.",
    goals: ["pigment", "redness", "glow"], cost: { nyc: [400, 850], miami: [350, 750] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Months to years with sun protection", downtimeDays: [1, 7], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Usually not suitable for deeper or tanned skin tones.",
  },
  {
    id: "pico", name: "Pico Laser", what: "PicoSure / PicoWay", approach: "laser", onset: 2,
    summary: "Ultra-fast laser pulses break up pigment and refresh texture with little downtime.",
    goals: ["pigment", "texture", "acne"], cost: { nyc: [500, 900], miami: [400, 800] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Often chosen for melasma and stubborn spots — ask about your skin type.",
  },

  // ── Body & hair ─────────────────────────────────────────────────────
  {
    id: "coolsculpting", name: "CoolSculpting", what: "Fat freezing", approach: "fat", onset: 3,
    summary: "Controlled cooling destroys some fat cells in areas like the belly, flanks or chin; the body clears them over about 3 months.",
    goals: ["contour"], cost: { nyc: [800, 1800], miami: [750, 1500] }, priceUnit: "per cycle (one applicator)",
    sessions: "1–3 per area", lasts: "Long-lasting if weight stays stable", downtimeDays: [0, 1], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy"],
    notes: "Not a weight-loss treatment. Rare risk of fat enlarging instead.",
  },
  {
    id: "emsculpt", name: "Emsculpt Neo", what: "Muscle toning + fat reduction", approach: "fat", onset: 3,
    summary: "Combines muscle contractions and heat to tone muscle and reduce fat on belly, buttocks or arms.",
    goals: ["contour"], cost: { nyc: [850, 1000], miami: [750, 1000] }, priceUnit: "per session",
    sessions: "4, about 1 week apart", lasts: "Months; maintenance helps", downtimeDays: [0, 0], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy"],
    notes: "Feels like an intense workout. Not for metal implants in the area.",
  },
  {
    id: "laser-hair", name: "Laser Hair Removal", what: "Laser targeting hair follicles", approach: "laser", onset: 3,
    summary: "Laser energy reduces hair regrowth over a series of treatments.",
    goals: ["hair"], cost: { nyc: [100, 500], miami: [100, 450] }, priceUnit: "per area",
    sessions: "6–8, about 4–8 weeks apart", lasts: "Long-term reduction", downtimeDays: [0, 1], pain: 2, results: 3,
    performedBy: "Physician or trained laser technician", contraindications: ["pregnancy", "active-skin"],
    notes: "Ask which laser is used for your skin tone.",
  },
  // ── Added: foundation, trending and specialist options ────────────────
  {
    id: "tretinoin", name: "Prescription Retinoid (Tretinoin)", what: "Prescription vitamin A cream", approach: "topical", onset: 3,
    summary: "The best-studied at-home treatment for fine lines, rough texture and sun spots. Used nightly, results build over months.",
    goals: ["lines", "texture", "pigment", "acne", "glow"], cost: { nyc: [30, 100], miami: [30, 100] }, priceUnit: "per 45 g tube, plus a doctor visit",
    sessions: "Nightly at home", lasts: "As long as you keep using it", downtimeDays: [0, 0], pain: 1, results: 2,
    performedBy: "Prescribed by a dermatologist or other clinician", contraindications: ["pregnancy"],
    notes: "Start slowly — dryness and peeling are common at first. Pair with daily SPF 30+.",
  },
  {
    id: "masseter", name: "Masseter Botox (Jaw Slimming)", what: "Neuromodulator in the jaw muscle", approach: "toxin", onset: 2,
    summary: "Injections relax an enlarged chewing muscle so the lower face looks slimmer over several weeks.",
    goals: ["contour"], cost: { nyc: [800, 1500], miami: [800, 1200] }, priceUnit: "per treatment (both sides)",
    sessions: "Single visit; repeated to maintain", lasts: "Several months; needs repeat treatments", downtimeDays: [0, 1], pain: 1, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "autoimmune", "active-skin"],
    notes: "Off-label in the U.S. (FDA-approved uses are certain face and neck lines). Usually priced by units used.",
  },
  {
    id: "under-eye", name: "Under-Eye Filler", what: "Hyaluronic acid for under-eye hollows", approach: "ha", onset: 1, minAge: 22,
    summary: "A soft filler placed under the eyes to soften hollows and shadows. Some products are FDA-approved for this area.",
    goals: ["volume"], cost: { nyc: [1000, 2500], miami: [850, 1200] }, priceUnit: "per syringe",
    sessions: "Single visit; sometimes a touch-up", lasts: "About 1 year (studies followed people for 12–18 months)", downtimeDays: [2, 7], pain: 2, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended", contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "A delicate area: swelling and visible lumps are more likely. Choose an experienced injector.",
  },
  {
    id: "pdl", name: "Pulsed Dye Laser (Vbeam)", what: "Laser for redness and broken capillaries", approach: "laser", onset: 2,
    summary: "A yellow-light laser that targets blood vessels to reduce persistent redness, rosacea flushing and visible capillaries.",
    goals: ["redness"], cost: { nyc: [400, 800], miami: [400, 800] }, priceUnit: "per session",
    sessions: "Usually several, about 4 weeks apart", lasts: "Months to years; redness can return", downtimeDays: [0, 7], pain: 2, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin"],
    notes: "Some settings cause temporary purple bruising for 1–2 weeks — ask which to expect.",
  },
];

function tierOf(nycLow: number): Budget {
  return nycLow <= 350 ? 1 : nycLow <= 1000 ? 2 : 3;
}

export const PROCEDURES: Procedure[] = RAW.map((p) => ({ ...p, tier: tierOf(p.cost.nyc[0]) }));

export const APPROACHES: Record<Approach, { label: string; short: string; hint: string }> = {
  topical: { label: "Prescription skincare", short: "Skincare", hint: "Daily treatment at home, prescribed by a clinician; results build over months" },
  energy: { label: "Ultrasound & radiofrequency", short: "Energy devices", hint: "Heat under the skin triggers collagen remodeling; results build over months" },
  laser: { label: "Lasers & light", short: "Lasers & light", hint: "Light energy resurfaces skin or targets pigment, redness or hair" },
  biostim: { label: "Collagen-stimulating injectables", short: "Biostimulators", hint: "Injected materials that prompt your own collagen over time" },
  ha: { label: "Hyaluronic acid fillers", short: "HA fillers", hint: "Gel that adds volume or hydration right away; dissolvable" },
  toxin: { label: "Muscle-relaxing injections", short: "Neuromodulators", hint: "Relax specific muscles to soften expression lines" },
  fat: { label: "Fat reduction & toning", short: "Fat reduction", hint: "Destroy fat cells with cold or injections, or tone muscle" },
  skin: { label: "Needling, peels & facials", short: "Needling & peels", hint: "Controlled skin injury or exfoliation to renew the surface" },
  threads: { label: "Thread lifts", short: "Threads", hint: "Dissolvable threads that lift tissue" },
};

export const ONSET_LABELS = ["", "Right away", "Within days–weeks", "Gradually (months)"];

export const GOAL_LABELS: Record<string, string> = {
  texture: "Texture & Pores",
  lines: "Lines & Wrinkles",
  lift: "Lifting & Firmness",
  volume: "Volume & Lips",
  pigment: "Spots & Even Tone",
  redness: "Redness",
  acne: "Acne Scars",
  glow: "Overall Glow",
  contour: "Jawline, Chin & Body",
  hair: "Hair Removal",
};

export const PAIN_LABELS = ["", "Minimal", "Mild", "Moderate", "Strong", "Intense"];
export const RESULT_LABELS = ["", "Subtle", "Noticeable", "Dramatic"];
