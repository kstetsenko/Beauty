# Aesthetic Guide NYC & Miami

An educational procedure directory, built as an installable web app (PWA) with Next.js (App Router), TypeScript and Tailwind CSS.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production mode (service worker active)
```

## Deploy (Vercel)
1. Import this GitHub repo in Vercel (framework preset: Next.js; no other settings needed).
2. Optional: set `SUBSCRIBE_WEBHOOK_URL` (+ `SUBSCRIBE_WEBHOOK_TOKEN`) to forward consented sign-ups to your email provider. Without it, sign-ups are validated and acknowledged but **not stored**.
3. Add your domain. HTTPS is automatic.

## What's where
| Area | Files |
|---|---|
| 3-step flow (city → quiz → results) | `components/Guide.tsx`, `CityStep.tsx`, `QuizStep.tsx`, `Results.tsx` |
| Mandatory disclaimer (18+, versioned) | `components/DisclaimerModal.tsx` (bump `KEY` when the text changes) |
| Persistent footer disclaimer | `components/Footer.tsx` |
| Procedure data, prices, contraindications | `lib/procedures.ts`, `lib/cautions.ts` |
| Clinic listings + directory links | `lib/clinics.ts` (**ships empty**; add only vetted clinics) |
| Email capture + consent | `components/LeadCaptureForm.tsx`, `app/api/subscribe/route.ts` |
| PWA | `app/manifest.ts`, `public/sw.js`, `public/icons/`, `components/PwaSupport.tsx` |
| Security headers / CSP | `next.config.ts` |
| Privacy Policy / Terms (templates) | `app/privacy`, `app/terms` |

## Privacy design
- Quiz answers, ZIP and health cautions stay in React state in the browser. They are never stored or sent.
- The email form sends only the email, city, the procedure ids, and the consent text. The consent box starts unchecked and is checked again on the server.
- The API does not log email addresses or keep IP addresses.

## Before launch
- Have the Privacy Policy and Terms reviewed by counsel and fill in the bracketed fields.
- Check the price ranges in `lib/procedures.ts`. They are rough estimates.
- Add vetted clinics to `lib/clinics.ts`, with ratings copied from Google and the date you checked them. Never make ratings up. For live ratings, use the Google Places API (its terms require attribution and limit caching).
