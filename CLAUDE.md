# Aesthetic Guide NYC & Miami — instructions for Claude

Educational, evidence-based guide to aesthetic treatments (NYC & Miami). Next.js App Router + TypeScript + Tailwind.
Read `README.md` for structure and commands. This repo is unrelated to any other project; keep changes here.

## Non-negotiables
- **Never make anything up.** Every price, study, date, FDA status, side effect claim and link must come from a source
  you actually found (PubMed for studies; FDA/CDC for safety; AAD/ASPS/FDA for learning links; clinic pages or RealSelf
  for prices). If you can't confirm something, leave it out or label it "Estimate" and say so to the user.
- Not medical advice: keep disclaimers on every page; no clinic endorsements; no invented ratings.
- Partner clinics: flat listing fee only (never per patient), always labeled "Partner" with `PARTNER_NOTE`, never
  allowed to change treatment ranking or research. Clinic links go through `TrackedLink`; every "Find a clinic" button opens `/clinics` (see `docs/TRACKING.md`).
- Health answers stay in the browser tab (`lib/profile.ts`); never send them anywhere, including in tracking or requests.
- Every list/compare page must use the person's profile (`ProfileGate` + `personalize`). Unsafe treatments are hidden
  with a visible reason, never silently.
- Compare only treatments for the same goal that fit the person.
- Scope: face beauty treatments only (no hair/tattoo removal, body or fat treatments, surgery).
- Skip anything that would need a lawyer (e.g. celebrity or influencer content).

## Workflow
1. Edit data in `lib/` (see README "Editing data") or UI in `components/`.
2. `npm run typecheck && npm run build`.
3. Test with Playwright at 390px and 1100px: no console errors, `scrollWidth` equals viewport width.
4. `npm run prototype`, then republish the prototype artifact (slug `3985c6c9-7b2d-403e-a693-bf04a884c274`;
   it is shared publicly, so pass `shared_live: "public"` and the artifact title).
5. Commit with a message that explains what changed for users, and push to `main`.

## Weekly data check
Issues labeled `data-check` (from `.github/workflows/weekly-data-check.yml`) list broken links, new PubMed papers and
stale prices. Review each item against the primary source before changing data; update `CHECKED` in `lib/research.ts`.

## Feedback
Visitor feedback arrives as GitHub issues labeled `feedback` (website) or as comments on the prototype artifact.
