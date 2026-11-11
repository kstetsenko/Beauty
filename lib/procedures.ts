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
    id: "sofwave", name: "Sofwave", what: "Ultrasound skin tightening", approach: "collagen",
    summary: "Ultrasound energy heats the skin's middle layer to trigger new collagen, gently lifting brows, jawline and neck.",
    goals: ["lift", "lines", "texture"], cost: { nyc: [3000, 4500], miami: [2500, 4000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1 year; results build over 3 months", downtimeDays: [0, 0], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Known for being more comfortable than older ultrasound devices.",
  },
  {
    id: "ultherapy", name: "Ultherapy", what: "Focused ultrasound lifting", approach: "collagen",
    summary: "Focused ultrasound reaches the deep support layer under the skin to lift and tighten over time.",
    goals: ["lift", "contour"], cost: { nyc: [2700, 5000], miami: [2000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "1–2 years; results build over 3–6 months", downtimeDays: [0, 1], pain: 4, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Ask what pain relief is offered — it can be uncomfortable.",
  },
  {
    id: "thermage", name: "Thermage FLX", what: "Radiofrequency skin tightening", approach: "collagen",
    summary: "Radiofrequency heat tightens existing collagen and stimulates new collagen for firmer skin.",
    goals: ["lift", "texture"], cost: { nyc: [3500, 4500], miami: [3000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1–2 years", downtimeDays: [0, 0], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Not suitable with some implanted electronic devices — tell your provider.",
  },
  {
    id: "morpheus8", name: "Morpheus8", what: "Radiofrequency microneedling", approach: "collagen",
    summary: "Tiny needles deliver radiofrequency heat under the skin to tighten, smooth texture and soften acne scars.",
    goals: ["texture", "acne", "lift", "contour"], cost: { nyc: [1000, 2000], miami: [1000, 2000] }, priceUnit: "per session",
    sessions: "1–3, about 4–6 weeks apart", lasts: "1 year or more with maintenance", downtimeDays: [2, 5], pain: 4, results: 3,
    performedBy: "Dermatologist, plastic surgeon or supervised clinician",
    contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid", "blood-thinners"],
    notes: "Ask whether numbing cream is included in the price.",
  },
  {
    id: "co2", name: "CO2 Laser", what: "Ablative laser resurfacing", approach: "collagen",
    summary: "The strongest laser resurfacing: removes damaged layers and triggers major collagen renewal.",
    goals: ["texture", "lines", "acne", "pigment"], cost: { nyc: [2000, 6000], miami: [2000, 5000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "Years, with sun protection", downtimeDays: [7, 14], pain: 5, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Plan 1–2 weeks off. Higher risk of pigment changes on deeper skin tones.",
  },
  {
    id: "fraxel", name: "Fraxel", what: "Fractional laser", approach: "collagen",
    summary: "Laser treats tiny columns of skin to improve sun damage, fine lines, texture and scars.",
    goals: ["texture", "pigment", "lines", "acne"], cost: { nyc: [850, 2000], miami: [500, 1500] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Expect a few days of redness and a sandpaper feel.",
  },
  {
    id: "halo", name: "Halo Laser", what: "Hybrid fractional laser", approach: "collagen",
    summary: "Combines two laser wavelengths to brighten tone and refine texture in fewer sessions.",
    goals: ["pigment", "texture", "glow"], cost: { nyc: [1200, 2500], miami: [1200, 2200] }, priceUnit: "per session",
    sessions: "1–3", lasts: "Long-lasting with sun protection", downtimeDays: [5, 7], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Tiny dark dots flake off over about a week.",
  },
  {
    id: "moxi", name: "Moxi / Clear + Brilliant", what: "Gentle fractional laser", approach: "collagen",
    summary: "A light 'baby laser' for glow, early sun spots and pore size with almost no recovery.",
    goals: ["glow", "texture", "pigment"], cost: { nyc: [450, 900], miami: [450, 850] }, priceUnit: "per session",
    sessions: "3–4, about 4 weeks apart", lasts: "Months; often done as maintenance", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "isotretinoin"],
    notes: "Popular before events — skin looks fresher in a few days.",
  },
  {
    id: "microneedling", name: "Microneedling", what: "Collagen induction therapy", approach: "collagen",
    summary: "Fine needles make tiny controlled channels that prompt new collagen for smoother texture.",
    goals: ["texture", "acne", "glow"], cost: { nyc: [300, 600], miami: [250, 500] }, priceUnit: "per session",
    sessions: "3–6, about 4–6 weeks apart", lasts: "Long-lasting; gradual", downtimeDays: [1, 3], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["active-skin", "isotretinoin", "keloid", "blood-thinners"],
    notes: "Avoid at-home rollers for deep treatment — infection risk.",
  },
  {
    id: "prp", name: "PRP Microneedling", what: "\"Vampire facial\"", approach: "collagen",
    summary: "Microneedling with platelet-rich plasma from your own blood, aimed at glow and texture.",
    goals: ["texture", "glow", "acne"], cost: { nyc: [550, 1200], miami: [200, 900] }, priceUnit: "per session",
    sessions: "3, about 4–6 weeks apart", lasts: "Gradual; maintenance yearly", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin", "blood-thinners"],
    notes: "Evidence is still growing; make sure blood is handled in a medical setting.",
  },
  {
    id: "sculptra", name: "Sculptra", what: "Collagen-stimulating injectable", approach: "collagen",
    summary: "An injectable that prompts your body to rebuild its own collagen, restoring volume gradually and naturally.",
    goals: ["volume", "lift", "lines"], cost: { nyc: [1000, 1500], miami: [800, 1100] }, priceUnit: "per vial",
    sessions: "Usually 2–3 vials over a few months", lasts: "Up to about 2 years", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "keloid", "autoimmune", "blood-thinners"],
    notes: "Injected product, but the result comes from your own collagen over 2–3 months.",
  },

  // ── Injectables & threads (instant, product-based) ──────────────────
  {
    id: "botox", name: "Botox / Dysport", what: "Neuromodulator injections", approach: "injectable",
    summary: "Relaxes the muscles behind forehead lines, frown lines and crow's feet.",
    goals: ["lines"], cost: { nyc: [450, 1200], miami: [300, 900] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 3–4 months", downtimeDays: [0, 1], pain: 1, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "autoimmune", "active-skin"],
    notes: "Often priced per unit — ask for the total.",
  },
  {
    id: "lip-filler", name: "Lip Filler", what: "Hyaluronic acid filler", approach: "injectable",
    summary: "A gel your body naturally contains, injected to add shape, hydration and volume to the lips.",
    goals: ["volume"], cost: { nyc: [550, 1200], miami: [600, 1000] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 6–12 months", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Reversible with an enzyme if needed. Ask for a natural amount.",
  },
  {
    id: "cheek-filler", name: "Cheek & Jaw Filler", what: "Hyaluronic acid filler", approach: "injectable",
    summary: "Restores lost volume and sharpens cheekbones, chin or jawline right away.",
    goals: ["volume", "contour", "lift"], cost: { nyc: [800, 1500], miami: [750, 1200] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 2, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Rare but serious risks — choose an experienced medical injector.",
  },
  {
    id: "radiesse", name: "Radiesse", what: "Calcium-based filler", approach: "injectable",
    summary: "Adds instant structure to cheeks and jawline and also stimulates some collagen.",
    goals: ["volume", "contour", "lift"], cost: { nyc: [900, 1400], miami: [700, 1100] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Not dissolvable like hyaluronic acid filler.",
  },
  {
    id: "skinvive", name: "Skinvive", what: "Hyaluronic skin booster", approach: "injectable",
    summary: "Micro-droplets of hyaluronic acid under the skin for a smoother, dewy glow — no added volume.",
    goals: ["glow", "texture"], cost: { nyc: [700, 1200], miami: [600, 1000] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 6 months", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners"],
    notes: "Subtle by design — think hydration, not shape.",
  },
  {
    id: "kybella", name: "Kybella", what: "Under-chin fat dissolving injections", approach: "injectable",
    summary: "Injections that permanently break down small pockets of fat under the chin.",
    goals: ["contour"], cost: { nyc: [600, 750], miami: [500, 750] }, priceUnit: "per vial (2–4 per visit)",
    sessions: "2–4, about 4–6 weeks apart", lasts: "Long-lasting", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners"],
    notes: "Expect noticeable swelling for several days.",
  },
  {
    id: "threads", name: "PDO Thread Lift", what: "Dissolvable lifting threads", approach: "injectable",
    summary: "Dissolvable threads placed under the skin lift sagging areas and prompt some collagen.",
    goals: ["lift", "contour"], cost: { nyc: [2000, 6000], miami: [1500, 4000] }, priceUnit: "per area",
    sessions: "Single visit", lasts: "About 6–12 months", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "keloid", "autoimmune"],
    notes: "Results vary a lot by injector skill.",
  },

  // ── Resurface & brighten ────────────────────────────────────────────
  {
    id: "hydrafacial", name: "HydraFacial", what: "Hydradermabrasion facial", approach: "surface",
    summary: "Cleanses, gently exfoliates and hydrates for an instant glow with zero recovery.",
    goals: ["glow", "texture"], cost: { nyc: [200, 330], miami: [175, 325] }, priceUnit: "per session",
    sessions: "Single; monthly for upkeep", lasts: "Days to weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin"],
    notes: "Great before an event.",
  },
  {
    id: "dermaplaning", name: "Dermaplaning", what: "Manual exfoliation", approach: "surface",
    summary: "A blade gently removes dead skin and peach fuzz for smooth, bright skin.",
    goals: ["glow", "texture"], cost: { nyc: [100, 250], miami: [60, 200] }, priceUnit: "per session",
    sessions: "Single; every 4 weeks", lasts: "About 3–4 weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin", "isotretinoin"],
    notes: "Hair does not grow back thicker.",
  },
  {
    id: "peel", name: "Chemical Peel", what: "Superficial to medium acid peel", approach: "surface",
    summary: "An acid solution removes the outer layer to brighten tone, smooth texture and calm breakouts.",
    goals: ["glow", "texture", "pigment", "acne"], cost: { nyc: [150, 500], miami: [150, 400] }, priceUnit: "per session",
    sessions: "3–6, about 4 weeks apart", lasts: "Months with skincare", downtimeDays: [0, 5], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised aesthetician", contraindications: ["pregnancy", "active-skin", "isotretinoin"],
    notes: "Deeper skin tones: choose a provider experienced with peels.",
  },
  {
    id: "ipl", name: "IPL / BBL Photofacial", what: "Broadband light therapy", approach: "surface",
    summary: "Light targets sun spots, redness and broken capillaries for a clearer, even tone.",
    goals: ["pigment", "glow"], cost: { nyc: [400, 850], miami: [350, 750] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Months to years with sun protection", downtimeDays: [1, 7], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "isotretinoin"],
    notes: "Usually not suitable for deeper or tanned skin tones.",
  },
  {
    id: "pico", name: "Pico Laser", what: "PicoSure / PicoWay", approach: "surface",
    summary: "Ultra-fast laser pulses break up pigment and refresh texture with little downtime.",
    goals: ["pigment", "texture"], cost: { nyc: [500, 900], miami: [400, 800] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "isotretinoin"],
    notes: "Often chosen for melasma and stubborn spots — ask about your skin type.",
  },

  // ── Body & hair ─────────────────────────────────────────────────────
  {
    id: "coolsculpting", name: "CoolSculpting", what: "Fat freezing", approach: "body",
    summary: "Controlled cooling permanently reduces stubborn fat in areas like the belly, flanks or chin.",
    goals: ["body", "contour"], cost: { nyc: [800, 1800], miami: [750, 1500] }, priceUnit: "per cycle (one applicator)",
    sessions: "1–3 per area", lasts: "Long-lasting if weight stays stable", downtimeDays: [0, 1], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy"],
    notes: "Not a weight-loss treatment. Rare risk of fat enlarging instead.",
  },
  {
    id: "emsculpt", name: "Emsculpt Neo", what: "Muscle toning + fat reduction", approach: "body",
    summary: "Combines muscle contractions and heat to tone muscle and reduce fat on belly, buttocks or arms.",
    goals: ["body"], cost: { nyc: [850, 1000], miami: [750, 1000] }, priceUnit: "per session",
    sessions: "4, about 1 week apart", lasts: "Months; maintenance helps", downtimeDays: [0, 0], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy"],
    notes: "Feels like an intense workout. Not for metal implants in the area.",
  },
  {
    id: "laser-hair", name: "Laser Hair Removal", what: "Laser targeting hair follicles", approach: "body",
    summary: "Laser energy reduces hair regrowth over a series of treatments.",
    goals: ["hair"], cost: { nyc: [100, 500], miami: [100, 450] }, priceUnit: "per area",
    sessions: "6–8, about 4–8 weeks apart", lasts: "Long-term reduction", downtimeDays: [0, 1], pain: 2, results: 3,
    performedBy: "Physician or trained laser technician", contraindications: ["pregnancy", "active-skin", "isotretinoin"],
    notes: "Ask which laser is used for your skin tone.",
  },
];

function tierOf(nycLow: number): Budget {
  return nycLow <= 350 ? 1 : nycLow <= 1000 ? 2 : 3;
}

export const PROCEDURES: Procedure[] = RAW.map((p) => ({ ...p, tier: tierOf(p.cost.nyc[0]) }));

export const APPROACHES: Record<Approach, { label: string; short: string; hint: string }> = {
  collagen: { label: "Boosts your own collagen", short: "Natural collagen", hint: "Energy, lasers and needling — gradual, natural-looking results" },
  injectable: { label: "Injectables & threads", short: "Product-based", hint: "Adds or relaxes with a product — results right away" },
  surface: { label: "Resurface & brighten", short: "Resurfacing", hint: "Facials, peels and light — glow and even tone" },
  body: { label: "Body & hair", short: "Body", hint: "Fat reduction, toning and hair removal" },
};

export const GOAL_LABELS: Record<string, string> = {
  lift: "Tightening & Lifting",
  lines: "Fine Lines & Wrinkles",
  texture: "Smoother Texture",
  glow: "Glow & Radiance",
  volume: "Volume & Lips",
  pigment: "Sun Spots & Even Tone",
  acne: "Acne Scars",
  contour: "Jawline & Chin",
  body: "Body Contouring",
  hair: "Hair Removal",
};

export const PAIN_LABELS = ["", "Minimal", "Mild", "Moderate", "Strong", "Intense"];
export const RESULT_LABELS = ["", "Subtle", "Noticeable", "Dramatic"];
