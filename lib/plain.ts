/**
 * Plain-language synthesis of the research cited for each treatment (lib/research.ts).
 * Written only from those studies and notes — no new claims. "works" answers "Does it work?";
 * "unclear" answers "What's still unclear?" (left out where the cited research doesn't say).
 */
export const PLAIN: Record<string, { works: string; unclear?: string }> = {
  sofwave: { works: "Small studies report tighter skin and new collagen formation.", unclear: "Most studies are linked to the manufacturer, and no large comparative trials have been published." },
  ultherapy: { works: "A systematic review found modest lifting, such as a brow lift of a few millimeters.", unclear: "The improvement is modest." },
  thermage: { works: "Studies report mild skin tightening.", unclear: "Most studies are older or retrospective, without a comparison group." },
  morpheus8: { works: "Systematic reviews conclude that radiofrequency microneedling likely improves acne scars.", unclear: "Most of the underlying studies are small." },
  co2: { works: "Studies show improvement in wrinkles and sun damage.", unclear: "Most studies are small and lack a comparison group." },
  fraxel: { works: "Randomized trials show improvement in acne scars.", unclear: "The cited trials focus on acne scars; evidence for other uses is thinner." },
  microneedling: { works: "Reviews of the evidence are favorable for acne scars.", unclear: "Few high-quality controlled trials have been published." },
  sculptra: { works: "Randomized trials and a systematic review support gradual restoration of facial volume." },
  botox: { works: "Placebo-controlled trials show that it smooths frown lines, and a pooled analysis confirms the effect." },
  "cheek-filler": { works: "A large randomized trial found that cheek volume correction lasted up to two years." },
  radiesse: { works: "Long-term studies show lasting improvement in smile lines.", unclear: "Most studies are funded by the manufacturer." },
  skinvive: { works: "FDA approval was based on the manufacturer's clinical trial.", unclear: "We could not confirm the full trial results; published guidance reflects expert opinion." },
  threads: { works: "The evidence comes mainly from small studies and reviews of past patients.", unclear: "In a review of about 2,000 cases, roughly 1 in 8 patients had a complication." },
  ipl: { works: "It is more effective for sun spots and redness than for wrinkles." },
  pico: { works: "Small studies, including a randomized trial with three years of follow-up, show improvement in pigmentation and texture.", unclear: "The studies are small." },
  "under-eye": { works: "Several randomized trials support hyaluronic acid filler for under-eye hollows." },
  pdl: { works: "A pooled analysis of trials shows that it reduces rosacea redness, with results similar to IPL.", unclear: "Most of the trials are small." },
  erbium: { works: "A systematic review found erbium gentler, with fewer complications, while CO2 was somewhat more effective for wrinkles." },
  emface: { works: "A single study of 24 people reported fewer wrinkles after three months.", unclear: "The study had no comparison group, and longer-term data are lacking." },
  "clear-brilliant": { works: "A small study found smaller-looking pores after six treatments, and a review describes improvements in tone and texture.", unclear: "The studies are small." },
  tixel: { works: "Only small clinical and laboratory studies have been published.", unclear: "No large controlled trials exist yet." },
  led: { works: "Small trials report a modest improvement in fine lines.", unclear: "Larger trials are needed." },
  "smile-filler": { works: "Many randomized trials, summarized in a meta-analysis, support fillers for smile lines.", unclear: "Most trials compare one filler brand with another rather than with no treatment." },
  bellafill: { works: "In the manufacturer-funded trial that led to FDA approval, 64% of patients improved, compared with 33% after saline injections.", unclear: "A Cochrane review rates the evidence for fillers in acne scars as moderate." },
  aerolase: { works: "A small trial against a sham treatment and a study of 225 patients, including people with darker skin, found fewer breakouts.", unclear: "The studies are small." },
  "laser-toning": { works: "Pooled analyses of small studies show that it lightens melasma, especially when combined with other treatments.", unclear: "Results fade over time, and melasma often returns." },
  pdt: { works: "A meta-analysis of randomized trials shows that it improves inflammatory acne, and a systematic review supports it for sun-damaged skin.", unclear: "Treatment protocols vary, and most trials are small." },
  ktp: { works: "In a small randomized trial it cleared facial blood vessels faster than pulsed dye laser, and a study of 102 patients reported that most vessels improved or cleared.", unclear: "The studies are small." },
  microcurrent: { works: "There is very little independent research.", unclear: "Most studies are small, uncontrolled or linked to manufacturers." },
  xerf: { works: "No peer-reviewed studies have been published yet.", unclear: "Its FDA clearance is known only from the manufacturer's announcement." },
  aviclear: { works: "Studies report fewer acne breakouts for up to two years.", unclear: "Most studies have no comparison group and are linked to the manufacturer; no randomized trial has been published." },
  "sylfirm-x": { works: "Small randomized trials suggest that it improves melasma, and one study used it to help prevent melasma from returning.", unclear: "The studies are small." },
  ultraclear: { works: "One small study reported improvement in sun damage and wrinkles.", unclear: "Only 22 people took part and 6 did not finish; no comparative trials exist." },
};

/** What each kind of study means, in plain words. */
export const STUDY_KIND: Record<string, string> = {
  "Meta-analysis": "Combines the results of several studies",
  "Systematic review": "A careful review of all the studies on a question",
  "Randomized trial": "People randomly assigned to compare treatments",
  "Clinical study": "A study of patients, without random assignment",
  Review: "An expert summary of published research",
  "Expert consensus": "Agreed advice from a panel of specialists",
  "Lab study": "Done on skin samples in a lab, not on outcomes in people",
};

/** What each research level means and how we assign it. */
export const LEVEL_MEANING = [
  "",
  "Based on small or uncontrolled studies, often funded by the manufacturer, or on no published studies.",
  "Supported by systematic reviews or by several smaller studies with consistent results.",
  "Supported by randomized controlled trials or pooled analyses of them.",
];

const KIND_NOUN: Record<string, [string, string]> = {
  "Randomized trial": ["randomized controlled trial", "randomized controlled trials"],
  "Meta-analysis": ["meta-analysis", "meta-analyses"],
  "Systematic review": ["systematic review", "systematic reviews"],
  "Clinical study": ["clinical study", "clinical studies"],
  Review: ["expert review", "expert reviews"],
  "Expert consensus": ["expert consensus statement", "expert consensus statements"],
  "Lab study": ["laboratory study", "laboratory studies"],
};
const ORDER = ["Meta-analysis", "Systematic review", "Randomized trial", "Clinical study", "Review", "Expert consensus", "Lab study"];

/** One plain sentence describing the cited studies, e.g. "Based on 3 published studies: 2 randomized controlled trials and 1 meta-analysis." */
export function studySummary(kinds: string[]): string {
  if (!kinds.length) return "We found no published clinical studies.";
  const counts = ORDER.filter((k) => kinds.includes(k)).map((k) => {
    const n = kinds.filter((x) => x === k).length;
    return `${n} ${KIND_NOUN[k][n === 1 ? 0 : 1]}`;
  });
  const list = counts.length > 1 ? `${counts.slice(0, -1).join(", ")} and ${counts[counts.length - 1]}` : counts[0];
  return kinds.length === 1 ? `Based on one published study: ${list.replace(/^1 /, "a ")}.` : `Based on ${kinds.length} published studies: ${list}.`;
}
