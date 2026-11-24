# Compliance checklist (New York and Florida) — for review by a healthcare lawyer

This is a working list, not legal advice. Every item needs a lawyer's sign-off before launch or before charging clinics.

## What the guide does today
| Topic | What's in place | Where |
|---|---|---|
| Not medical advice; no doctor–patient relationship | Disclaimer gate (must tick 18+ and Terms), footer on every page, Terms | `DisclaimerModal`, `Footer`, `/terms` |
| No instructions | The guide only reports what labels and studies say; "Your provider will give you before-treatment and aftercare instructions" on every treatment page; test blocks directive wording | `ProcedureFacts`, `tests/unit/wording.test.ts` |
| Emergencies | "Call 911" in the gate, footer and Terms; FDA warning signs labeled as the FDA's | — |
| Not a referral service; no per-patient payments | Terms, footer, gate; Partner label with `PARTNER_NOTE`; partners can't change order or content | `/terms`, `lib/clinics.ts` |
| Paid relationships disclosed (FTC Endorsement Guides) | "Partner" label on every partner card and explanation | `ClinicCard`, `/sources` |
| Credentials | Shown "as stated by the source" with link and date; Terms point to ABMS, NY Office of the Professions and Florida license lookups | `ClinicCard`, `/terms` |
| FDA status and off-label use | Each treatment links its FDA source; off-label goals are labeled on cards and rank lower | `lib/basis.ts`, `lib/match.ts` |
| Prices and costs | "Not a quote"; estimates labeled; course and yearly costs labeled as arithmetic | `/sources`, `lib/cost.ts` |
| Health data | Quiz answers stay in the browser tab; never sent; share links contain only treatment names and city | `lib/profile.ts`, `/privacy` |
| Adults only | 18+ confirmation; no knowing collection from children | gate, `/terms`, `/privacy` |
| Accessibility (ADA website claims are common in New York) | Accessibility statement with a contact route; WCAG 2.1 AA goal; tests at 390px and 1100px | `/accessibility` |
| Trademarks | Brand names used only to identify treatments | `/terms`, `/sources` |

## Open questions for the lawyer
1. **Florida Patient Brokering Act (Fla. Stat. § 817.505).** It prohibits paying or receiving any payment to induce the
   referral of patients. Our research found no explicit exception for flat advertising fees, so whether a flat
   "Partner" listing fee is allowed must be confirmed before charging Florida clinics. Also check Fla. Stat. § 456.054
   (kickbacks).
2. **New York fee-splitting and referral rules for physicians** (Education Law § 6530, professional misconduct, which covers fee-splitting and referral payments): confirm the flat-fee
   model is acceptable for New York clinics.
3. **Florida advertising of board certification** (Fla. Stat. § 458.3312 and rule 64B8-11.001) applies to physicians'
   own advertising. We quote clinics' own statements with a link; confirm this framing is enough.
4. **Health-data privacy.** New York's Health Information Privacy Act (S.929) was vetoed on December 19, 2025, and a
   revised bill was introduced; check its status before launch. The guide sends no health answers, but tap counts
   include the treatment viewed.
5. Fill in the bracketed business name, address, governing law and contact emails in Terms, Privacy and Accessibility.

Sources: Fla. Stat. § 817.505 (flsenate.gov/Laws/Statutes/2018/817.505); Fla. Stat. § 458.3312
(m.flsenate.gov/Statutes/458.3312); NY S.929 veto (ebglaw.com Health Law Advisor update; nycbar.org report).
