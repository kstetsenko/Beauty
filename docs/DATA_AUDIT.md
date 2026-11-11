# Data audit — where every fact comes from

Last full review: November 2026. This file explains the provenance of each kind of data so it can be
re-checked. Nothing in the app should be added without a source of the kind listed here.

## Kinds of data and their sources
| Data | Source | Notes |
|---|---|---|
| Price ranges | Published clinic price pages in NYC/Miami, or RealSelf patient-reported averages | Shown as "From clinic prices" only when a page for that city publishes a price; otherwise "Estimate" |
| Studies | PubMed / PubMed Central (titles copied from the index) | Found via search results; links should be clicked through once before launch (this session's network could not open PubMed directly) |
| Evidence rating (Strong / Some / Limited) | Editorial summary of the cited studies | Strong = RCTs or meta-analysis of RCTs; Some = systematic reviews or consistent controlled studies; Limited = small/uncontrolled/maker-linked or none |
| Rare-but-serious risks, warning signs | FDA labels and safety communications; CDC MMWR | `lib/safety.ts` |
| Age limits (22+) | FDA consumer pages on fillers and microneedling devices | |
| Accutane guidance | 2017 JAMA Dermatology consensus; AAD (microneedling) | |
| Timeline dates | FDA documents, company announcements and reviews (each linked) | Only dates confirmed by a source are shown |
| Learning links | AAD, ASPS, FDA, CDC, NIH StatPearls | No clinic marketing |
| Pain (1–5), results (1–3), sessions, how long it lasts, recovery days | **Editorial estimates** from the cited studies, AAD pages and provider information | Labeled as general estimates on the "How we research" page |
| Intensity groups | Calculated from recovery days and pain | `lib/insights.ts` |

## Per-treatment status
| Treatment | NYC price (Published = clinic page or RealSelf) | Miami price | Studies cited | Evidence |
|---|---|---|---|---|
| Sofwave | Published | Estimate | 2 | Limited |
| Ultherapy | Published | Published | 2 | Some |
| Thermage FLX | Published | Estimate | 2 | Limited |
| Morpheus8 | Estimate | Estimate | 2 | Some |
| CO2 Laser | Estimate | Estimate | 2 | Some |
| Fraxel | Published | Published | 2 | Some |
| Halo Laser | Estimate | Estimate | 1 | Limited |
| Moxi | Estimate | Estimate | 2 | Limited |
| Clear + Brilliant | Published | Estimate | 2 | Limited |
| Microneedling | Published | Estimate | 2 | Limited |
| PRP Microneedling | Published | Published | 2 | Limited |
| Sculptra | Estimate | Estimate | 2 | Some |
| Botox / Dysport / Daxxify | Published | Published | 3 | Strong |
| Lip Filler | Published | Published | 2 | Strong |
| Cheek & Jaw Filler | Published | Estimate | 2 | Strong |
| Radiesse | Published | Estimate | 2 | Some |
| Skinvive | Estimate | Estimate | 1 | Limited |
| PDO Thread Lift | Published | Estimate | 2 | Limited |
| HydraFacial | Published | Estimate | 0 | Limited |
| Dermaplaning | Published | Published | 1 | Limited |
| Chemical Peel | Estimate | Published | 2 | Some |
| IPL / BBL Photofacial | Estimate | Estimate | 2 | Some |
| Pico Laser | Estimate | Estimate | 2 | Some |
| Prescription Retinoid (Tretinoin) | Estimate | Estimate | 2 | Strong |
| Masseter Botox (Jaw Slimming) | Estimate | Published | 2 | Some |
| Under-Eye Filler | Published | Estimate | 2 | Strong |
| Pulsed Dye Laser (Vbeam) | Estimate | Estimate | 2 | Some |
| Microdermabrasion | Estimate | Published | 2 | Limited |
| Erbium Laser Resurfacing | Published | Estimate | 2 | Some |
| Non-Surgical Nose Job | Estimate | Estimate | 1 | Limited |
| Emface | Estimate | Estimate | 1 | Limited |
| Laser Genesis | Estimate | Estimate | 1 | Limited |
| Tixel | Published | Estimate | 1 | Limited |
| LED Light Therapy | Published | Estimate | 2 | Limited |
| Prescription Redness Cream | Estimate | Estimate | 2 | Strong |
| Prescription Melasma Cream | Estimate | Estimate | 2 | Some |
| Subcision | Estimate | Estimate | 2 | Some |
| Azelaic Acid | Estimate | Estimate | 3 | Some |

## Known gaps
- Several Miami prices (and some NYC) are estimates because clinics do not publish them.
- HydraFacial and dermaplaning have no clinical trials; the app says so.
- Scope is face beauty treatments only: hair removal, tattoo removal, fat reduction, veins and sweating were removed.
- Not included because no reliable human evidence or primary source was found: Opus Plasma, polynucleotides (injectable).
  Aerolase (evidence is for active acne) would need a "breakouts" goal.
- Pain/results ratings are editorial and should be reviewed by a board-certified dermatologist.
