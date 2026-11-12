import type { Metadata } from "next";
import Link from "next/link";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";

export const metadata: Metadata = {
  title: "About — Aesthetic Guide NYC & Miami",
  description: "Find the non-surgical face treatments that fit you, and understand them before you book.",
};

const STEPS = [
  { n: "1", title: "Tell us about you.", text: "Five quick questions: your goals, skin tone, health and recent treatments. About a minute. Your answers stay on your device." },
  { n: "2", title: "See what fits.", text: "Treatments ranked for you, each with the reason. Anything usually not advised for you is set aside, and we tell you why." },
  { n: "3", title: "Choose with confidence.", text: "Local prices, recovery, risks and the certainty of the evidence, then clinics near you." },
];

const PRINCIPLES = [
  { title: "Everything in one place.", text: "Prices, recovery, risks and research for each treatment — gathered from medical journals, the FDA, dermatology associations and clinic price lists." },
  { title: "Made for you.", text: "Results change with your skin tone, health and goals — not one list for everyone." },
  { title: "FDA-cleared only.", text: "Every treatment uses an FDA-approved product or an FDA-cleared device, and each page links to the source. When the evidence is limited, we say so." },
  { title: "No paid rankings.", text: "Clinics can't buy a higher spot. The same ranking rules apply to everyone." },
];

const COVERS = ["Facials & peels", "Lasers & light", "Skin tightening", "Injectables", "Acne-scar treatments"];

export default function About() {
  return (
    <article className="animate-in space-y-14 py-2">
      <section className="text-center pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Aesthetic Guide · NYC &amp; Miami</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight">Know before you book.</h1>
        <p className="text-lg text-muted leading-snug mt-4">
          The non-surgical face treatments that fit you — explained simply, in one place. New York City and Miami.
        </p>
        <Link href="/" className="btn-main inline-block mt-7 px-8">Find what fits — about a minute</Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">How it works.</h2>
        <ol className="space-y-6">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="text-3xl font-semibold text-rose leading-none w-6 shrink-0">{s.n}</span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted leading-relaxed mt-1">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">What makes it different.</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-3xl bg-white border border-line p-5">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-muted leading-relaxed mt-1">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <p className="text-5xl font-semibold tracking-tight">{PROCEDURES.length}</p>
        <p className="text-sm text-muted mt-1">non-surgical face treatments · {Object.keys(GOAL_LABELS).length} goals · 2 cities</p>
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {COVERS.map((c) => (
            <span key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm">{c}</span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-blush p-6">
        <h2 className="text-xl font-semibold tracking-tight">A guide, not a doctor.</h2>
        <p className="text-sm leading-relaxed mt-2">
          Aesthetic Guide is a search and learning tool. It isn&apos;t a clinic and doesn&apos;t give medical advice. Use it to
          understand your options, then decide together with a board-certified dermatologist or plastic surgeon.
        </p>
        <p className="text-sm mt-3">
          <Link href="/sources" className="underline">How we research</Link> · <Link href="/privacy" className="underline">Privacy</Link>
        </p>
      </section>

      <section className="text-center pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ready when you are.</h2>
        <Link href="/" className="btn-main inline-block mt-5 px-8">Start</Link>
      </section>
    </article>
  );
}
