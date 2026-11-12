import type { Approach, Procedure, Tier } from "./types";

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
    id: "sofwave", name: "Sofwave", what: "Ultrasound skin tightening", approach: "energy", collagen: true, onset: 3,
    summary: "Ultrasound energy heats the skin's middle layer to trigger new collagen, gently lifting brows, jawline and neck.",
    goals: ["lift", "lines"], cost: { nyc: [3000, 4500], miami: [2500, 4000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1 year; results build over 3 months", downtimeDays: [0, 0], pain: 2, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Known for being more comfortable than older ultrasound devices.",
  },
  {
    id: "ultherapy", name: "Ultherapy", what: "Focused ultrasound lifting", aka: ["Ultherapy PRIME", "Microfocused ultrasound"], approach: "energy", collagen: true, onset: 3,
    summary: "Focused ultrasound reaches the deep support layer under the skin to lift and tighten over time.",
    goals: ["lift"], cost: { nyc: [2700, 5000], miami: [2000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "1–2 years; results build over 3–6 months", downtimeDays: [0, 1], pain: 4, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin"],
    notes: "Ask what pain relief is offered — it can be uncomfortable.",
  },
  {
    id: "thermage", name: "Thermage FLX", what: "Radiofrequency skin tightening", aka: ["Monopolar radiofrequency"], approach: "energy", collagen: true, onset: 3,
    summary: "Radiofrequency heat tightens existing collagen and stimulates new collagen for firmer skin.",
    goals: ["lift", "lines"], cost: { nyc: [3500, 4500], miami: [3000, 4500] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "About 1–2 years", downtimeDays: [0, 0], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin", "implant-device"],
    notes: "Not suitable with some implanted electronic devices — tell your provider.",
  },
  {
    id: "morpheus8", name: "Morpheus8", what: "Radiofrequency microneedling", aka: ["RF microneedling", "Vivace", "Potenza"], approach: "energy", collagen: true, onset: 3, minAge: 22,
    summary: "Tiny needles deliver radiofrequency heat under the skin to tighten, smooth texture and soften acne scars.",
    goals: ["texture", "acne"], cost: { nyc: [1000, 2000], miami: [1000, 2000] }, priceUnit: "per session",
    sessions: "1–3, about 4–6 weeks apart", lasts: "1 year or more with maintenance", downtimeDays: [2, 5], pain: 4, results: 2,
    performedBy: "Dermatologist, plastic surgeon or supervised clinician",
    contraindications: ["pregnancy", "active-skin", "keloid", "blood-thinners", "isotretinoin"],
    notes: "Ask whether numbing cream is included in the price.",
  },
  {
    id: "co2", name: "CO2 Laser", what: "Ablative laser resurfacing", aka: ["Fractional CO2", "CO2RE", "UltraPulse", "ActiveFX", "DeepFX"], approach: "laser", collagen: true, onset: 3,
    summary: "The strongest laser resurfacing: removes damaged layers and triggers major collagen renewal.",
    goals: ["texture", "lines", "acne", "pigment"], cost: { nyc: [2000, 6000], miami: [2000, 5000] }, priceUnit: "full face",
    sessions: "Usually 1", lasts: "Years, with sun protection", downtimeDays: [7, 14], pain: 5, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Plan 1–2 weeks off. Fully ablative laser is usually delayed while on isotretinoin (Accutane). Higher risk of pigment changes on deeper skin tones.",
  },
  {
    id: "fraxel", name: "Fraxel", what: "Fractional laser", aka: ["Fraxel Dual", "Fraxel Restore", "1550 nm fractional laser"], approach: "laser", collagen: true, onset: 3,
    summary: "Laser treats tiny columns of skin to improve sun damage, fine lines, texture and scars.",
    goals: ["texture", "pigment", "lines", "acne"], cost: { nyc: [850, 2000], miami: [500, 1500] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin", "keloid"],
    notes: "Expect a few days of redness and a sandpaper feel.",
  },
  {
    id: "halo", name: "Halo Laser", what: "Hybrid fractional laser", aka: ["Sciton Halo", "Hybrid fractional laser"], approach: "laser", collagen: true, onset: 2,
    summary: "Combines two laser wavelengths to brighten tone and refine texture.",
    goals: ["pigment", "texture", "glow"], cost: { nyc: [1200, 2500], miami: [1200, 2200] }, priceUnit: "per session",
    sessions: "1–3", lasts: "Long-lasting with sun protection", downtimeDays: [5, 7], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin", "keloid"],
    notes: "Tiny dark dots flake off over about a week.",
  },
  {
    id: "moxi", name: "Moxi", what: "Gentle 1927 nm fractional laser", aka: ["Sciton Moxi", "1927 nm thulium laser"], approach: "laser", collagen: true, onset: 2,
    summary: "A light 'baby laser' for glow, early sun spots and pore size with almost no recovery.",
    goals: ["glow", "texture", "pigment"], cost: { nyc: [600, 900], miami: [600, 900] }, priceUnit: "per session",
    sessions: "3–4, about 4 weeks apart", lasts: "Months; often done as maintenance", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Popular before events — skin looks fresher in a few days.",
  },
  {
    id: "clear-brilliant", name: "Clear + Brilliant", what: "Gentle 1440/1927 nm fractional laser", aka: ["C+B", "Clear + Brilliant Touch"], approach: "laser", collagen: true, onset: 2,
    summary: "A low-energy laser for pores, texture and early sun spots, often done as a series with little downtime.",
    goals: ["glow", "texture", "pigment"], cost: { nyc: [450, 500], miami: [400, 600] }, priceUnit: "per session",
    sessions: "Usually a series of 3–6, about a month apart", lasts: "Months; often done as maintenance", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "A study of the 1440 nm laser found smaller-looking pores after 6 treatments.",
  },
  {
    id: "microneedling", name: "Microneedling", what: "Collagen induction therapy", aka: ["SkinPen", "Collagen induction therapy"], approach: "skin", collagen: true, onset: 3, minAge: 22,
    summary: "Fine needles make tiny controlled channels that prompt new collagen for smoother texture.",
    goals: ["texture", "acne", "lines"], cost: { nyc: [300, 600], miami: [250, 500] }, priceUnit: "per session",
    sessions: "3–6, about 4–6 weeks apart", lasts: "Long-lasting; gradual", downtimeDays: [1, 3], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["active-skin", "keloid", "blood-thinners", "isotretinoin"],
    notes: "Avoid at-home rollers for deep treatment — infection risk.",
  },
  {
    id: "prp", name: "PRP Microneedling", what: "\"Vampire facial\"", aka: ["Vampire facial", "Platelet-rich plasma"], approach: "skin", collagen: true, onset: 3, minAge: 22,
    summary: "Microneedling with platelet-rich plasma from your own blood, aimed at glow and texture.",
    goals: ["acne"], cost: { nyc: [550, 1200], miami: [200, 900] }, priceUnit: "per session",
    sessions: "3, about 4–6 weeks apart", lasts: "Gradual; maintenance yearly", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy", "active-skin", "blood-thinners", "isotretinoin"],
    notes: "Evidence is still growing; make sure blood is handled in a medical setting.",
  },
  {
    id: "sculptra", name: "Sculptra", what: "Collagen-stimulating injectable", aka: ["Poly-L-lactic acid", "Biostimulator"], approach: "biostim", collagen: true, onset: 3, minAge: 22,
    summary: "An injectable that prompts your body to rebuild its own collagen, restoring volume gradually and naturally.",
    goals: ["volume", "lines"], cost: { nyc: [1000, 1500], miami: [800, 1100] }, priceUnit: "per vial",
    sessions: "Usually 2–3 vials over a few months", lasts: "Up to about 2 years", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "keloid", "autoimmune", "blood-thinners"],
    notes: "Injected product, but the result comes from your own collagen over 2–3 months.",
  },

  // ── Injectables & threads (instant, product-based) ──────────────────
  {
    id: "botox", name: "Botox / Dysport / Daxxify", what: "Neuromodulator injections (also Xeomin, Jeuveau)", aka: ["Xeomin", "Jeuveau", "Dysport", "Daxxify", "Neurotoxin"], approach: "toxin", onset: 2,
    summary: "Relaxes the muscles behind forehead lines, frown lines and crow's feet.",
    goals: ["lines"], cost: { nyc: [450, 1200], miami: [300, 900] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 3–4 months", downtimeDays: [0, 1], pain: 1, results: 2,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "autoimmune", "active-skin"],
    notes: "Often priced per unit — ask for the total. Daxxify lasted a median of about 6 months in its trials; others about 3–4 months. Botox Cosmetic is also FDA-approved for vertical neck bands (2024).",
  },
  {
    id: "cheek-filler", name: "Cheek Filler", what: "Hyaluronic acid filler", aka: ["Juvéderm Voluma", "Restylane Lyft"], approach: "ha", onset: 1, minAge: 22,
    summary: "Restores volume the cheeks lose with age, right away.",
    goals: ["volume"], cost: { nyc: [800, 1500], miami: [750, 1200] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 2, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune", "severe-allergy"],
    notes: "Rare but serious risks — choose an experienced medical injector.",
  },
  {
    id: "radiesse", name: "Radiesse", what: "Calcium-based filler", aka: ["Calcium hydroxylapatite", "Biostimulator"], approach: "biostim", collagen: true, onset: 1, minAge: 22,
    summary: "Adds instant volume to cheeks and smile lines, and also stimulates some collagen.",
    goals: ["volume", "lines"], cost: { nyc: [900, 1400], miami: [700, 1100] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 12–18 months", downtimeDays: [1, 3], pain: 3, results: 3,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune"],
    notes: "Not dissolvable like hyaluronic acid filler.",
  },
  {
    id: "skinvive", name: "Skinvive", what: "Hyaluronic skin booster", aka: ["Skin booster", "Juvéderm Skinvive"], approach: "ha", onset: 2, minAge: 22,
    summary: "Micro-droplets of hyaluronic acid under the skin for a smoother, dewy glow — no added volume.",
    goals: ["glow", "texture"], cost: { nyc: [700, 1200], miami: [600, 1000] }, priceUnit: "per treatment",
    sessions: "Single visit", lasts: "About 6 months", downtimeDays: [0, 2], pain: 2, results: 1,
    performedBy: "Physician, PA or NP", contraindications: ["pregnancy", "active-skin", "blood-thinners", "severe-allergy"],
    notes: "Subtle by design — think hydration, not shape.",
  },
  {
    id: "threads", name: "PDO Thread Lift", what: "Dissolvable lifting threads", aka: ["PDO threads", "Thread lift"], approach: "threads", onset: 1,
    summary: "Dissolvable threads placed under the skin lift sagging areas and prompt some collagen.",
    goals: ["lift"], cost: { nyc: [2000, 6000], miami: [1500, 4000] }, priceUnit: "per area",
    sessions: "Single visit", lasts: "About 6–12 months", downtimeDays: [3, 7], pain: 3, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "keloid", "autoimmune"],
    notes: "Results vary a lot by injector skill.",
  },

  // ── Resurface & brighten ────────────────────────────────────────────
  {
    id: "hydrafacial", name: "HydraFacial", what: "Hydradermabrasion facial", aka: ["Hydradermabrasion"], approach: "skin", onset: 1,
    summary: "Cleanses, gently exfoliates and hydrates for an instant glow with zero recovery.",
    goals: ["glow"], cost: { nyc: [200, 330], miami: [175, 325] }, priceUnit: "per session",
    sessions: "Single; monthly for upkeep", lasts: "Days to weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin"],
    notes: "Great before an event.",
  },
  {
    id: "dermaplaning", name: "Dermaplaning", what: "Manual exfoliation", aka: ["Blade exfoliation"], approach: "skin", onset: 1,
    summary: "A blade gently removes dead skin and peach fuzz for smooth, bright skin.",
    goals: ["glow"], cost: { nyc: [100, 250], miami: [60, 200] }, priceUnit: "per session",
    sessions: "Single; every 4 weeks", lasts: "About 3–4 weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["active-skin"],
    notes: "Hair does not grow back thicker.",
  },
  {
    id: "peel", name: "Chemical Peel", what: "Superficial to medium acid peel", aka: ["VI Peel", "Glycolic peel", "TCA peel", "Salicylic peel"], approach: "skin", onset: 2,
    summary: "An acid solution removes the outer layer to brighten tone, smooth texture and calm breakouts.",
    goals: ["glow", "texture", "pigment", "breakouts"], cost: { nyc: [150, 500], miami: [150, 400] }, priceUnit: "per session",
    sessions: "3–6, about 4 weeks apart", lasts: "Months with skincare", downtimeDays: [0, 5], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised aesthetician", contraindications: ["pregnancy", "active-skin"],
    notes: "Deeper skin tones: choose a provider experienced with peels.",
  },
  {
    id: "ipl", name: "IPL / BBL Photofacial", what: "Broadband light therapy", aka: ["BBL", "BBL HERO", "Lumecca", "Photofacial"], approach: "laser", onset: 2,
    summary: "Light targets sun spots, redness and broken capillaries for a clearer, even tone. Also used for rosacea redness.",
    goals: ["pigment", "redness", "glow", "breakouts"], cost: { nyc: [400, 850], miami: [350, 750] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Months to years with sun protection", downtimeDays: [1, 7], pain: 2, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Usually not suitable for deeper or tanned skin tones.",
  },
  {
    id: "pico", name: "Pico Laser", what: "PicoSure / PicoWay", aka: ["PicoSure", "PicoWay", "Pico Genesis"], approach: "laser", onset: 2,
    summary: "Ultra-fast laser pulses break up pigment and refresh texture with little downtime.",
    goals: ["pigment", "texture", "lines"], cost: { nyc: [500, 900], miami: [400, 800] }, priceUnit: "per session",
    sessions: "3–5, about 4 weeks apart", lasts: "Long-lasting with sun protection", downtimeDays: [1, 3], pain: 3, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Often chosen for melasma and stubborn spots — ask about your skin type.",
  },

  // ── Body & hair ─────────────────────────────────────────────────────
  // ── Added: foundation, trending and specialist options ────────────────
  {
    id: "under-eye", name: "Under-Eye Filler", what: "Hyaluronic acid for under-eye hollows", aka: ["Restylane Eyelight", "Tear trough filler"], approach: "ha", onset: 1, minAge: 22,
    summary: "A soft filler placed under the eyes to soften hollows and shadows. Some products are FDA-approved for this area.",
    goals: ["volume"], cost: { nyc: [1000, 2500], miami: [850, 1200] }, priceUnit: "per syringe",
    sessions: "Single visit; sometimes a touch-up", lasts: "About 1 year (studies followed people for 12–18 months)", downtimeDays: [2, 7], pain: 2, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended", contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune", "severe-allergy"],
    notes: "A delicate area: swelling and visible lumps are more likely. Choose an experienced injector.",
  },
  {
    id: "pdl", name: "Pulsed Dye Laser (Vbeam)", what: "Laser for redness and broken capillaries", aka: ["Vbeam Perfecta", "Pulsed dye laser"], approach: "laser", onset: 2,
    summary: "A yellow-light laser that targets blood vessels to reduce persistent redness, rosacea flushing and visible capillaries.",
    goals: ["redness", "breakouts"], cost: { nyc: [400, 800], miami: [400, 800] }, priceUnit: "per session",
    sessions: "Usually several, about 4 weeks apart", lasts: "Months to years; redness can return", downtimeDays: [0, 7], pain: 2, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin"],
    notes: "Some settings cause temporary purple bruising for 1–2 weeks — ask which to expect.",
  },
  // ── Added: other key face options ──────────────────────────────────────
  {
    id: "microdermabrasion", name: "Microdermabrasion", what: "Mechanical exfoliation", aka: ["Diamond-tip exfoliation"], approach: "skin", onset: 1,
    summary: "A device gently sands away the outermost skin layer for smoother, brighter-looking skin.",
    goals: ["glow", "texture"], cost: { nyc: [150, 250], miami: [75, 200] }, priceUnit: "per session",
    sessions: "Often a series; monthly for upkeep", lasts: "Weeks", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Aesthetician or dermatology office", contraindications: ["active-skin"],
    notes: "Studies show mild improvement in roughness and tone, not in wrinkles.",
  },
  {
    id: "erbium", name: "Erbium Laser Resurfacing", what: "Er:YAG ablative laser", aka: ["Er:YAG laser"], approach: "laser", collagen: true, onset: 3,
    summary: "A resurfacing laser that removes thin layers of damaged skin to smooth wrinkles, texture and sun damage.",
    goals: ["lines", "texture", "pigment"], cost: { nyc: [1500, 4000], miami: [1000, 3500] }, priceUnit: "full face",
    sessions: "One deeper treatment, or a lighter series", lasts: "Long-lasting with sun protection", downtimeDays: [5, 14], pain: 4, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon", contraindications: ["pregnancy", "active-skin", "isotretinoin", "keloid"],
    notes: "Gentler recovery than CO2 with somewhat smaller results in comparison studies.",
  },
  {
    id: "emface", name: "Emface", what: "Muscle stimulation + radiofrequency", aka: ["HIFES + radiofrequency"], approach: "energy", collagen: true, onset: 3,
    summary: "Combines electrical muscle stimulation with radiofrequency heat to firm the face and soften lines, with no needles.",
    goals: ["lines"], cost: { nyc: [900, 1200], miami: [900, 1200] }, priceUnit: "per session (usually 4)",
    sessions: "Usually 4, about a week apart", lasts: "Unclear — studies followed people for 3 months", downtimeDays: [0, 0], pain: 1, results: 2,
    performedBy: "Physician-supervised clinic", contraindications: ["pregnancy"],
    notes: "Newer device; published studies are small and linked to the manufacturer.",
  },
  // ── Added: more lasers & light devices ────────────────────────────────
  {
    id: "laser-genesis", name: "Laser Genesis", what: "Microsecond 1064 nm Nd:YAG laser", aka: ["Cutera Laser Genesis"], approach: "laser", onset: 2,
    summary: "A gentle, no-downtime laser that warms the skin to calm redness and refresh tone and texture.",
    goals: ["redness", "glow"], cost: { nyc: [275, 600], miami: [275, 600] }, priceUnit: "per session",
    sessions: "Usually 3–6, a few weeks apart", lasts: "Months; maintenance helps", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "For rosacea redness, studies comparing it with pulsed dye laser have mixed results.",
  },
  {
    id: "tixel", name: "Tixel", what: "Heat-based fractional resurfacing (not a laser)", approach: "energy", collagen: true, onset: 3,
    summary: "A heated tip makes tiny controlled marks in the skin's surface to smooth texture and fine lines, with short downtime.",
    goals: ["texture", "lines"], cost: { nyc: [400, 800], miami: [400, 800] }, priceUnit: "per session",
    sessions: "Usually 2–3", lasts: "Months", downtimeDays: [1, 3], pain: 2, results: 1,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Newer technology; published studies are small.",
  },
  {
    id: "led", name: "LED Light Therapy", what: "Red and near-infrared light", aka: ["Red light therapy", "Photobiomodulation"], approach: "laser", onset: 3,
    summary: "Panels of red or near-infrared LED light used in a series of short sessions to support skin quality. No heat, no downtime.",
    goals: ["lines", "glow"], cost: { nyc: [200, 300], miami: [130, 200] }, priceUnit: "per session",
    sessions: "A series of sessions; ongoing for upkeep", lasts: "Needs ongoing sessions", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Clinic or aesthetician (at-home devices also exist)", contraindications: [],
    notes: "Results in studies are modest; it's often added to facials.",
  },
  // ── Added: prescription options and scar surgery ───────────────────────
  {
    id: "subcision", name: "Subcision", what: "Releasing tethered acne scars with a needle or cannula", approach: "skin", onset: 2,
    summary: "A dermatologist slips a needle or blunt cannula under rolling acne scars to cut the bands pulling them down.",
    goals: ["acne"], cost: { nyc: [400, 2600], miami: [200, 1500] }, priceUnit: "per session",
    sessions: "Often 1–3", lasts: "Long-lasting, though some scars sink back", downtimeDays: [2, 7], pain: 3, results: 2,
    performedBy: "Board-certified dermatologist", contraindications: ["active-skin", "keloid", "blood-thinners"],
    notes: "Works best on rolling scars; ice-pick and boxcar scars respond less. Often combined with lasers.",
  },
  // ── Added: more in-clinic options (Nov 2026) ───────────────────────────
  {
    id: "smile-filler", name: "Smile-Line Filler", what: "Hyaluronic acid filler for folds and lines", aka: ["Nasolabial fold filler", "Marionette line filler", "Juvéderm Vollure", "Restylane Refyne", "Restylane Defyne"], approach: "ha", onset: 1, minAge: 22,
    summary: "A hyaluronic acid gel placed under the folds from nose to mouth (smile lines) or the lines below the mouth, softening them right away.",
    goals: ["lines", "volume"], cost: { nyc: [800, 1500], miami: [700, 1500] }, priceUnit: "per syringe",
    sessions: "Single visit", lasts: "About 6–12 months (trials followed people for 6–12 months)", downtimeDays: [1, 3], pain: 2, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon recommended",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune", "severe-allergy"],
    notes: "Dissolvable with an enzyme if needed. Most trials compare one filler brand with another, and results are similar.",
  },
  {
    id: "bellafill", name: "Bellafill", what: "Long-lasting collagen + PMMA filler", aka: ["PMMA filler", "Polymethylmethacrylate-collagen filler"], approach: "biostim", collagen: true, onset: 1, minAge: 22,
    summary: "A filler made of bovine collagen with tiny permanent beads. FDA-approved for smile lines and for rolling acne scars.",
    goals: ["acne", "lines"], cost: { nyc: [1050, 3300], miami: [1050, 3300] }, priceUnit: "per treatment (often several syringes)",
    sessions: "Usually 1–2 visits", lasts: "Long-lasting; the main acne-scar trial followed people for 12 months", downtimeDays: [1, 3], pain: 2, results: 2,
    performedBy: "Board-certified dermatologist or plastic surgeon",
    contraindications: ["pregnancy", "active-skin", "blood-thinners", "autoimmune", "keloid", "severe-allergy", "bovine-collagen"],
    notes: "Not dissolvable. A review warns that too much placed too close to the surface can leave a lasting bump.",
  },
  {
    id: "tca-cross", name: "TCA CROSS", what: "Pinpoint acid for ice-pick scars", aka: ["Chemical reconstruction of skin scars", "CROSS technique"], approach: "skin", collagen: true, onset: 3,
    summary: "A dermatologist dabs a strong acid into the bottom of narrow, deep acne scars so they fill in with new collagen over several sessions.",
    goals: ["acne"], cost: { nyc: [750, 4000], miami: [750, 4000] }, priceUnit: "per course (depends on the number of scars)",
    sessions: "Often several, a few weeks apart", lasts: "Long-lasting", downtimeDays: [3, 7], pain: 2, results: 2,
    performedBy: "Board-certified dermatologist", contraindications: ["pregnancy", "active-skin", "keloid"],
    notes: "Best for narrow ice-pick and boxcar scars. On deeper skin tones, providers often prepare the skin first to lower the risk of dark marks.",
  },
  {
    id: "aerolase", name: "Aerolase (650-µs laser)", what: "Gentle Nd:YAG laser for active acne", aka: ["Aerolase Neo Elite", "NeoClear", "650-microsecond laser"], approach: "laser", onset: 2,
    summary: "A short-pulse 1064 nm laser that calms active breakouts with little discomfort and no downtime.",
    goals: ["breakouts"], cost: { nyc: [250, 500], miami: [250, 500] }, priceUnit: "per session",
    sessions: "About 4–6, every 2 weeks", lasts: "Varies; maintenance is common", downtimeDays: [0, 0], pain: 1, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Studies included people with skin of color. Studies are small; ask how it fits with any acne medicine you use.",
  },
  {
    id: "laser-toning", name: "Laser Toning (Q-switched Nd:YAG)", what: "Low-energy laser for melasma and uneven tone", aka: ["Q-switched Nd:YAG", "Spectra laser", "Hollywood Spectra"], approach: "laser", onset: 2,
    summary: "Many gentle passes of a low-energy laser that gradually lighten melasma and blotchy pigment.",
    goals: ["pigment"], cost: { nyc: [400, 500], miami: [250, 500] }, priceUnit: "per session",
    sessions: "Often 4–8, a few weeks apart", lasts: "Melasma often returns; maintenance is needed", downtimeDays: [0, 1], pain: 1, results: 2,
    performedBy: "Dermatologist or supervised clinician", contraindications: ["pregnancy", "active-skin"],
    notes: "Too many sessions can leave white spots (loss of pigment); a meta-analysis linked this to the number of sessions.",
  },
  {
    id: "pdt", name: "Photodynamic Therapy (PDT)", what: "Light-activated solution for acne and sun damage", aka: ["Blue light therapy", "Levulan PDT", "BLU-U", "ALA-PDT"], approach: "laser", onset: 2,
    summary: "A light-sensitizing solution is applied to the skin, then activated with blue or red light to calm acne and improve sun-damaged skin.",
    goals: ["breakouts", "texture", "lines"], cost: { nyc: [100, 400], miami: [100, 400] }, priceUnit: "per session",
    sessions: "Often 2–4, a few weeks apart", lasts: "Months; acne often needs repeat sessions", downtimeDays: [1, 7], pain: 2, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin", "light-sensitivity"],
    notes: "FDA-approved for precancerous spots (actinic keratoses); use for acne or cosmetic sun damage is off-label. Expect redness and peeling, and strict sun avoidance right after.",
  },
  {
    id: "ktp", name: "KTP Laser (Excel V)", what: "Green-light laser for broken capillaries and redness", aka: ["Excel V", "Excel V+", "532 nm KTP laser"], approach: "laser", onset: 2,
    summary: "A 532 nm laser that targets small visible vessels and redness on the face.",
    goals: ["redness"], cost: { nyc: [200, 500], miami: [200, 500] }, priceUnit: "per session",
    sessions: "Usually 1–3", lasts: "Months to years; new vessels can appear", downtimeDays: [0, 7], pain: 2, results: 2,
    performedBy: "Dermatologist", contraindications: ["pregnancy", "active-skin"],
    notes: "In a small split-face study it cleared vessels faster than pulsed dye laser but caused more swelling and redness.",
  },
  {
    id: "microcurrent", name: "Microcurrent Facial", what: "Low-level electrical current facial", aka: ["Microcurrent lifting facial", "Microcurrent toning"], approach: "skin", onset: 1,
    summary: "A spa facial that passes a gentle electrical current over the face, marketed for a toned, lifted look.",
    goals: ["glow"], cost: { nyc: [100, 180], miami: [95, 185] }, priceUnit: "per session",
    sessions: "Often sold as a series", lasts: "Temporary", downtimeDays: [0, 0], pain: 1, results: 1,
    performedBy: "Licensed aesthetician", contraindications: ["pregnancy"],
    notes: "Very little independent research. Tell the provider if you have a pacemaker or other implanted electronic device.",
  },
];

function tierOf(nycLow: number): Tier {
  return nycLow <= 350 ? 1 : nycLow <= 1000 ? 2 : 3;
}

export const PROCEDURES: Procedure[] = RAW.map((p) => ({ ...p, tier: tierOf(p.cost.nyc[0]) }));

export const APPROACHES: Record<Approach, { label: string; short: string; hint: string }> = {
  energy: { label: "Energy-based devices", short: "Energy devices", hint: "Ultrasound, radiofrequency, microwave or heat works in the skin; results build over weeks to months" },
  laser: { label: "Lasers & light", short: "Lasers & light", hint: "Light energy resurfaces skin or targets pigment, redness or hair" },
  biostim: { label: "Collagen-stimulating injectables", short: "Biostimulators", hint: "Injected materials that prompt your own collagen over time" },
  ha: { label: "Hyaluronic acid fillers", short: "HA fillers", hint: "Gel that adds volume or hydration right away; dissolvable" },
  toxin: { label: "Muscle-relaxing injections", short: "Neuromodulators", hint: "Relax specific muscles to soften expression lines" },
  skin: { label: "Needling, peels & facials", short: "Needling & peels", hint: "Controlled skin injury or exfoliation to renew the surface" },
  threads: { label: "Thread lifts", short: "Threads", hint: "Dissolvable threads that lift tissue" },
};

export const ONSET_LABELS = ["", "Right away", "Within days–weeks", "Gradually (months)"];

export const GOAL_LABELS: Record<string, string> = {
  texture: "Texture & Pores",
  lines: "Lines & Wrinkles",
  lift: "Lifting & Firmness",
  volume: "Lost Volume",
  pigment: "Spots & Even Tone",
  redness: "Redness",
  acne: "Acne Scars",
  glow: "Overall Glow",
  breakouts: "Breakouts",
};

export const PAIN_LABELS = ["", "Minimal", "Mild", "Moderate", "Strong", "Intense"];
export const RESULT_LABELS = ["", "Subtle", "Noticeable", "Dramatic"];
