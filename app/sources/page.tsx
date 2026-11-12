import { CAUTION_SOURCES } from "@/lib/cautions";
import type { Metadata } from "next";
import { CHECKED } from "@/lib/research";

export const metadata: Metadata = { title: "How we research — Aesthetic Guide NYC & Miami" };

export default function Sources() {
  return (
    <article className="space-y-5 text-sm leading-relaxed animate-in">
      <h1 className="text-2xl font-semibold">How we research</h1>

      <section>
        <h2 className="font-semibold mb-1">Prices</h2>
        <p>
          We check prices against pages that publish them: clinic price lists in New York City and Miami, and RealSelf
          averages of what patients report paying. Each procedure page lists its sources. Where no clinic publishes a price
          for a city, we mark the range as an <strong>estimate</strong>. Last checked: {CHECKED}.
        </p>
        <p className="text-muted mt-1">
          Many clinics only quote in person, prices change often, and listed prices may not include numbing, consultation
          fees or touch-ups. Our ranges are never a quote.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Research</h2>
        <p>
          We only cite peer-reviewed studies indexed on PubMed, the U.S. National Library of Medicine&apos;s database, and link
          to their summaries. We rate the evidence for each procedure:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>High certainty:</strong> several randomized controlled trials or a meta-analysis of them.</li>
          <li><strong>Moderate certainty:</strong> systematic reviews or smaller controlled studies with consistent results.</li>
          <li><strong>Low certainty:</strong> few, small or uncontrolled studies, often funded by the maker, or none found.</li>
        </ul>
        <p className="text-muted mt-1">
          This is our plain-language summary, not a formal grading. A study result describes a group of people and does not
          predict your result.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Notes based on your answers</h2>
        <p>
          Age, skin tone, conditions and recent treatments only change what we show when there is an official source or
          published study behind it — for example FDA age limits for fillers and microneedling devices (22+), the Botox
          label on repeat dosing, studies on lasers in darker skin, melasma and rosacea, and a 2017 expert consensus on
          procedures during isotretinoin (Accutane). Each note links to its source. Where no official guidance exists (for
          example, how long to wait between energy-device sessions), we say so instead of guessing.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Learning links</h2>
        <p>
          &ldquo;Learn more&rdquo; links go to patient guides from the American Academy of Dermatology (AAD), the American
          Society of Plastic Surgeons (ASPS), the FDA and the CDC. We don&apos;t link to clinic marketing. Trending treatments
          that are not FDA-approved (such as exosomes) are shown only as cautions, with the FDA&apos;s own warnings.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Safety information</h2>
        <p>
          &ldquo;Rare but serious&rdquo; risks and &ldquo;get help right away&rdquo; signs come from FDA labels and safety
          communications and CDC reports, linked on each procedure page. They are not a complete list — ask your provider
          for the full risks.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Pain, results and recovery</h2>
        <p>
          These ratings are general, typical descriptions drawn from published studies and provider information. Your
          experience depends on the provider, settings, numbing and your own skin.
        </p>
      </section>

      <section id="logic">
        <h2 className="font-semibold mb-1">How the guide decides</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Which treatments are included:</strong> only treatments that use an FDA-approved product or an FDA-cleared device. We checked each one against FDA records, FDA labels or the maker&apos;s clearance announcement, and every treatment page links to that source. Techniques with no FDA-approved product, such as chemical peels and dermaplaning, are not included.</li>
          <li><strong>Which treatments appear for a goal:</strong> those whose FDA approval or clearance, or the published studies, cover that goal. When a treatment is listed for a goal its FDA clearance doesn&apos;t cover, the card says so.</li>
          <li><strong>What&apos;s hidden:</strong> treatments that a product label or medical guideline says are not advised with your answers, such as pregnancy, an age below the FDA-authorized age, certain allergies or an implanted device. They are listed separately, with the reason and its source.</li>
          <li><strong>Order:</strong> each treatment receives 3 points for every one of your goals it is used for, 2 points per level of evidence (low 1, moderate 2, high 3) and 1 to 3 points for typical results, which count only when the evidence is at least moderate. It gains 3 points when it specifically targets a condition you have (for example, laser toning for melasma) and loses 2 or 3 points when your answers raise a known risk (for example, dark marks on deeper skin tones). Ties go to the option with fewer cautions, then the higher certainty of evidence, then the lower price.</li>
          <li><strong>Recent treatments:</strong> after a one-session treatment whose results develop over months (for example, Sofwave), similar options move to a separate &ldquo;Later&rdquo; section, with the reason.</li>
          <li><strong>Certainty of evidence:</strong> graded by us from the published studies. High: supported by randomized controlled trials or pooled analyses of them. Moderate: supported by systematic reviews or several smaller studies with consistent results. Low: based on small or uncontrolled studies, often funded by the manufacturer, or on no published studies. For low-certainty treatments we make no claim about how well they work.</li>
          <li><strong>Expected results:</strong> how big a change to expect, from the size of the improvement in the published studies. Subtle: a small change that you may notice more than others do. Noticeable: a clear improvement that others are likely to notice. Dramatic: a marked change, usually with more recovery time or cost. For low-certainty treatments this is our estimate and is labeled as such.</li>
          <li><strong>No instructions:</strong> the guide describes treatments and what sources report. It never tells you how to prepare, what to stop or when to book; your provider gives those instructions.</li>
          <li><strong>Prices:</strong> &ldquo;From clinic prices&rdquo; when a NYC or Miami clinic page publishes one; &ldquo;Estimate&rdquo; when based on national ranges; &ldquo;Price not available at the moment&rdquo; when we found no published price.</li>
          <li><strong>Filters and plans:</strong> only shown when they fit your goals and leave at least one option.</li>
          <li><strong>Clinics:</strong> listed for free if their own pages show board-certified doctors and the treatment; your neighborhood first, then alphabetical; partners can&apos;t change this order.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Health questions in the quiz</h2>
        <p>
          The quiz only asks about conditions that a product label or medical guideline says change whether a treatment is
          advised — for example pregnancy, isotretinoin, keloids, bleeding disorders, severe or lidocaine allergies (filler
          labels), bovine collagen allergy (Bellafill), implanted electronic devices (radiofrequency devices such as Thermage) and
          porphyria or light sensitivity (photodynamic therapy). It is not a full medical history; your provider will ask more.
        </p>
        <ul className="mt-2 space-y-1">
          {CAUTION_SOURCES.map((l) => (
            <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="underline">{l.label}</a></li>
          ))}
        </ul>
      </section>

      <section id="clinics">
        <h2 className="font-semibold mb-1">How clinics are listed</h2>
        <p>
          A clinic appears in the clinic finder only if (1) its own website or a university directory says board-certified
          dermatologists or plastic surgeons are on staff, (2) its own website lists the treatment, and (3) it has an address in
          one of our neighborhoods. Each card shows the source and the date we checked. We don&apos;t copy star ratings; each card
          links to the clinic&apos;s Google reviews so you can read them yourself. Clinics appear with your chosen neighborhood
          first, then A to Z. Clinics marked &ldquo;Partner&rdquo; pay a flat monthly fee and are labeled; paying never removes or
          reorders the free list, and never changes which treatments we show. Being listed is not an endorsement: always check
          the doctor&apos;s license and reviews before booking.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-1">Important</h2>
        <p>
          This guide is for education only and is not medical advice, diagnosis or treatment. It does not endorse any
          clinic, product or provider. Clinics marked &ldquo;Partner&rdquo; pay a flat monthly listing fee, never a fee per
          patient, and partners have no say in which treatments we show, how we rank them, or what the research says. Brand names (such as Botox, Sofwave or
          Clear + Brilliant) are trademarks of their owners and are used only to identify treatments. Always consult a
          board-certified dermatologist or plastic surgeon. In an emergency, call 911.
        </p>
      </section>
    </article>
  );
}
