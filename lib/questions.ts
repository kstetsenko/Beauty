/**
 * Questions to ask a provider, written for each treatment. Each one comes from
 * that treatment's own facts and risks in this app (lib/procedures.ts,
 * lib/research.ts, lib/safety.ts) — no generic list.
 */
export const QUESTIONS: Record<string, string[]> = {
  sofwave: [
    "Is this the Sofwave device itself, and which areas will you treat — brows, jawline, neck?",
    "Results build over about 3 months. When should I judge whether it worked?",
    "Do I need a second treatment, or a yearly touch-up, to keep the result?",
  ],
  ultherapy: [
    "Will you use ultrasound imaging to see the layers you're treating?",
    "It can be uncomfortable. What pain relief do you offer, and is it in the price?",
    "Results build over 3–6 months. How much lift is realistic for my skin?",
  ],
  thermage: [
    "Is Thermage safe with implanted devices such as a pacemaker? (Tell them if you have one.)",
    "Which tip size and how many pulses are included for my face?",
    "How much tightening is realistic, given that studies show mild results?",
  ],
  morpheus8: [
    "The FDA warned in 2025 about burns, scarring and fat loss after RF microneedling. How do you choose depth and energy for my face?",
    "Is it a genuine, FDA-authorized device, with new sterile tips for each person?",
    "How many sessions for my acne scars or texture, and is numbing included in the price?",
    "What settings do you use for my skin tone to avoid dark marks?",
  ],
  co2: [
    "How many CO2 treatments have you done on my skin tone? Can I see your own before-and-afters?",
    "Will you prescribe antiviral medicine beforehand to prevent cold sores?",
    "I'll need 1–2 weeks off. What does each day of healing look like, and when can I wear makeup?",
    "If I've taken isotretinoin (Accutane) recently, how long should I wait?",
  ],
  fraxel: [
    "Which Fraxel wavelength will you use for my goal — scars, spots or lines?",
    "How many sessions do I need (usually 3–5), and is there a package price?",
    "How do you adjust settings for my skin tone to avoid dark patches?",
  ],
  halo: [
    "How will you set the two wavelengths for my goal, spots or texture?",
    "Is one session enough, or will I need 2–3?",
    "How long will the dark dots and redness last before I'm back to normal?",
  ],
  moxi: [
    "How many sessions (usually 3–4) do I need, and how often for maintenance?",
    "I have an event coming up. How many days before should I book?",
    "Is MOXI safe for my skin tone, and what settings will you use?",
  ],
  "clear-brilliant": [
    "Which handpiece will you use for my goal: 1440 nm (pores and texture) or 1927 nm (tone and spots)?",
    "How many treatments in my series (usually 3–6), and is there a package price?",
    "How often would I need maintenance to keep the result?",
  ],
  microneedling: [
    "Is your device FDA-authorized, and do you use new sterile needles for every client?",
    "How deep will you go for my acne scars or lines, and how many sessions (usually 3–6)?",
    "What skincare should I avoid before and after, and for how long?",
  ],
  prp: [
    "Is my blood drawn and processed here, in a licensed medical setting, by licensed staff?",
    "What evidence is there for PRP for my goal? It's strongest for acne scars, combined with microneedling.",
    "How much does adding PRP cost compared with microneedling alone?",
  ],
  sculptra: [
    "How many vials will I need (often 2–3), over how many visits?",
    "Results come gradually over 2–3 months. How will we judge progress?",
    "What should I do afterward, such as massage, to reduce the risk of bumps?",
    "What would you do if the injection blocked a blood vessel?",
  ],
  botox: [
    "Which product will you use (Botox, Dysport, Xeomin, Jeuveau or Daxxify), and why that one for me?",
    "How many units for each area, and what is the total price?",
    "Can I see the box and lot number to confirm it's genuine?",
    "Is a touch-up visit at about 2 weeks included?",
  ],
  "cheek-filler": [
    "Which filler (e.g. Voluma or Restylane Lyft), how many syringes, and what is the total price?",
    "Do you use a needle or a blunt cannula in the cheeks, and why?",
    "Do you keep hyaluronidase (the dissolving enzyme) on site in case of a blocked vessel?",
    "Can I see the box and lot number?",
  ],
  radiesse: [
    "Radiesse can't be dissolved like hyaluronic acid filler. Why is it the better choice for me?",
    "Will it be full-strength or diluted (for collagen), and how many syringes?",
    "Since it can't be dissolved, how do you handle a blocked blood vessel?",
  ],
  skinvive: [
    "Am I a good candidate for a skin booster, or would another option suit my goal better?",
    "How many injection points and syringes, and what is the total price?",
    "Results last about 6 months. When should I come back?",
  ],
  threads: [
    "How many thread lifts have you done? Can I see results at 6 months, not just right after?",
    "What problems have your own patients had, such as dimpling, visible threads or infection, and how did you fix them?",
    "How many threads, which brand, and what is the total price?",
    "Would a non-surgical tightening device or a surgical consult suit my degree of sagging better?",
  ],
  hydrafacial: [
    "Which add-ons (boosters, LED, extractions) are included, and which cost extra?",
    "Is this suitable for my skin if I have rosacea or sensitive skin?",
    "How often would you recommend it, and what does a membership cost?",
  ],
  dermaplaning: [
    "Who does it, and are they a licensed aesthetician?",
    "Is it safe for me if I have active breakouts or rosacea?",
    "What should I skip on my skin for a few days afterward, such as retinoids or acids?",
  ],
  peel: [
    "Which acid and what strength do you recommend for my goal and skin tone?",
    "How many peels (usually 3–6), and how much peeling should I expect?",
    "If I have melasma, how will we keep it from coming back?",
    "When should I stop retinoids before the peel?",
  ],
  ipl: [
    "Is IPL safe for my skin tone? Usually it isn't for deeper or tanned skin.",
    "Will you do a test spot first?",
    "How many sessions (usually 3–5), and how long should I avoid sun before and after?",
    "Could I have melasma? IPL can make it worse.",
  ],
  pico: [
    "Which picosecond laser and wavelength will you use for my spots, texture or lines?",
    "How many sessions (usually 3–5), and what results do you expect for my skin type?",
    "If I have melasma, what is your plan to keep it from getting darker?",
  ],
  "under-eye": [
    "Am I a good candidate, or is my under-eye issue puffiness or pigment that filler won't help?",
    "Which filler and how much? Do you use a needle or a blunt cannula here?",
    "How many under-eye treatments do you do each month? Can I see your own results?",
    "Do you keep hyaluronidase on site in case of lumps or a blocked vessel?",
  ],
  pdl: [
    "Will your settings cause purple bruising, and for how long, or can you avoid it?",
    "How many sessions for my redness or broken vessels?",
    "Has a dermatologist confirmed this is rosacea, and will I also need a cream?",
  ],
  microdermabrasion: [
    "What results can I expect? Studies show mild changes in roughness and tone, not wrinkles.",
    "Is it suitable for my skin if I have rosacea or active acne?",
    "How many sessions, and what does a series cost?",
  ],
  erbium: [
    "Will this be a single deeper treatment or a lighter series, and why for me?",
    "How many days of downtime should I plan for, given the depth you choose?",
    "How do you lower the risk of pigment changes on my skin tone?",
    "If you treat around my mouth, will I need medicine to prevent a cold-sore flare?",
  ],
  emface: [
    "Published studies are small and followed people for 3 months. What results have you seen past that?",
    "Is the price for the usual series of 4, and what maintenance would I need?",
    "Would Botox or another option be better for my lines?",
  ],
  "laser-genesis": [
    "For my redness, why this laser instead of pulsed dye laser or IPL?",
    "How many sessions (usually 3–6), and what maintenance afterward?",
    "What results are realistic for my skin?",
  ],
  tixel: [
    "Tixel is newer and studies are small. How many have you done, and can I see your results?",
    "How many sessions (usually 2–3), and what does each one cost?",
    "How many days of redness and flaking should I expect?",
  ],
  led: [
    "How many sessions, how often, and what will a full course cost?",
    "Results in studies are modest. What is realistic for my lines or glow?",
    "Would a home device give a similar result for less?",
  ],
  subcision: [
    "Which of my scars are rolling scars that subcision helps most?",
    "Will you combine it with a laser or microneedling, and in what order?",
    "How many sessions (often 1–3), and how much bruising should I expect?",
  ],
  "smile-filler": [
    "Which filler is right for my smile lines (e.g. Vollure, Refyne or Defyne), and how many syringes?",
    "Would treating my cheeks give a more natural result than filling the folds directly?",
    "Do you keep hyaluronidase on site in case a vessel is blocked?",
  ],
  bellafill: [
    "Bellafill contains bovine collagen. Will I need an allergy skin test first?",
    "It's permanent and can't be dissolved. How do you avoid lumps, and what if I don't like the result?",
    "Are my scars the rolling type it was approved for, and how many syringes will I need?",
  ],
  "tca-cross": [
    "Which of my scars are ice-pick or boxcar scars that CROSS suits?",
    "What acid strength will you use, and how many sessions apart?",
    "With my skin tone, how will you prepare my skin to lower the risk of dark marks?",
  ],
  aerolase: [
    "How many sessions (often 4–6, two weeks apart) and what does the full course cost?",
    "Should I keep using my acne medicine during treatment?",
    "What maintenance will I need once my skin is clear?",
  ],
  "laser-toning": [
    "How many sessions do you plan, and how do you avoid white spots from too many?",
    "Will you combine it with another melasma treatment?",
    "What's the maintenance plan, since melasma often comes back?",
  ],
  pdt: [
    "Is this for acne, sun damage or both, and which light (blue or red) will you use?",
    "How long must I avoid daylight afterward, and how bad is the peeling?",
    "How many sessions do I need, and is any of it covered by insurance?",
  ],
  ktp: [
    "Are my vessels small enough for KTP, or would pulsed dye laser suit them better?",
    "How much swelling and redness should I expect, and for how long?",
    "Is it safe for my skin tone at the settings you'll use?",
  ],
  microcurrent: [
    "What result should I expect, and how long does it last after each session?",
    "How many sessions are in the series, and what does it cost in total?",
    "Is it safe if I have a pacemaker or other implanted device?",
  ],
  xerf: [
    "XERF is new and unstudied in journals. What results have you seen in your own patients after 3–6 months?",
    "How many sessions do you recommend, and is the price for face and neck?",
    "How does it compare with Thermage or Ultherapy for my skin?",
    "Is it safe with any implanted electronic device I have?",
  ],
  aviclear: [
    "Is my acne the inflammatory type AviClear is cleared for?",
    "Is the price for all 3 sessions, and what if I need more?",
    "Should I keep or change my acne medicine during the course?",
    "What happens if my acne flares in the first weeks?",
  ],
};
