/**
 * Plain-language synthesis of the research cited for each treatment (lib/research.ts).
 * Written only from those studies and notes — no new claims. "works" answers "Does it work?";
 * "unclear" answers "What's still unclear?" (left out where the cited research doesn't say).
 */
export const PLAIN: Record<string, { works: string; unclear?: string }> = {
  sofwave: { works: "Small studies found tighter skin and new collagen.", unclear: "Most studies are linked to the device maker, and there are no large comparison trials yet." },
  ultherapy: { works: "A review of studies found modest lifting — for example, brows lifted by a few millimeters.", unclear: "Results are modest." },
  thermage: { works: "Studies report mild tightening.", unclear: "Most studies are older or look back at past patients instead of comparing groups." },
  morpheus8: { works: "Reviews of many studies find it likely helps acne scars.", unclear: "Most studies are small." },
  co2: { works: "Studies show smoother wrinkles and less sun damage.", unclear: "Most studies are small and didn't compare against another group." },
  fraxel: { works: "Randomized trials show improvement in acne scars.", unclear: "The trials we cite focus on acne scars; less is shown for other uses." },
  halo: { works: "Few studies. One comparison found CO2 worked better, but people preferred Halo's easier recovery.", unclear: "Little published research." },
  moxi: { works: "Small studies of gentle 1927 nm lasers show better sun spots and tone.", unclear: "Studies are small." },
  microneedling: { works: "Reviews are favorable for acne scars.", unclear: "Few high-quality trials with a comparison group." },
  prp: { works: "Combined studies suggest adding PRP to microneedling helps acne scars a little more.", unclear: "An overview of the reviews rates how sure we can be as low." },
  sculptra: { works: "Randomized trials and a review support gradual volume restoration." },
  botox: { works: "Many trials against a placebo (a dummy injection) show it smooths frown lines; a combined analysis confirms it." },
  "cheek-filler": { works: "A large randomized trial found cheek volume correction lasting up to 2 years." },
  radiesse: { works: "Long-term studies show lasting improvement in smile lines.", unclear: "Most studies are linked to the maker." },
  skinvive: { works: "Its FDA approval was based on the maker's trial.", unclear: "We couldn't confirm the full trial results; published guidance is expert opinion." },
  threads: { works: "Evidence comes mostly from small studies and reviews of past patients.", unclear: "In a review of about 2,000 cases, about 1 in 8 people had a complication." },
  hydrafacial: { works: "We found no independent clinical trials.", unclear: "Any benefit is short-term and cosmetic." },
  dermaplaning: { works: "No clinical trials found. A lab study shows it removes the outer skin layer, which can help products absorb.", unclear: "Its effect on how skin looks hasn't been studied." },
  peel: { works: "Good evidence that peels help melasma and acne.", unclear: "Melasma often returns without maintenance." },
  ipl: { works: "Works better for sun spots and redness than for wrinkles." },
  pico: { works: "Small studies, including a randomized trial and a 3-year follow-up, show better pigment and texture.", unclear: "Studies are small." },
  "under-eye": { works: "Several randomized trials support hyaluronic acid filler for under-eye hollows." },
  pdl: { works: "Combined trials show it reduces rosacea redness, much like IPL.", unclear: "Most trials are small." },
  microdermabrasion: { works: "Small studies show mild improvement in roughness and blotchy tone.", unclear: "No improvement in wrinkles was shown." },
  erbium: { works: "A review found erbium gentler, with fewer complications, while CO2 was somewhat more effective for wrinkles." },
  emface: { works: "One small study of 24 people reported fewer wrinkles at 3 months.", unclear: "There was no comparison group, and no longer-term studies yet." },
  "clear-brilliant": { works: "A small study found smaller-looking pores after 6 treatments; a review describes better tone and texture.", unclear: "Studies are small." },
  "laser-genesis": { works: "Studies comparing it with pulsed dye laser for rosacea redness had mixed results." },
  tixel: { works: "Only small studies so far.", unclear: "No large controlled trials yet." },
  led: { works: "Small trials report modest improvement in fine lines.", unclear: "Larger trials are lacking." },
  subcision: { works: "Reviews find it safe and effective for rolling acne scars; combined with CO2 laser it ranked among the most effective options." },
  "smile-filler": { works: "Many randomized trials; a combined analysis supports fillers for smile lines.", unclear: "Most trials compare one filler brand with another, not with no treatment." },
  bellafill: { works: "In the maker-funded trial behind its FDA approval, 64% improved versus 33% with saltwater injections.", unclear: "A Cochrane review rates the evidence for fillers in acne scars as moderate." },
  "tca-cross": { works: "Mostly small studies; a 2026 review of 937 patients found it safe and effective for narrow scars.", unclear: "A small trial found pinpoint CO2 laser worked better." },
  aerolase: { works: "A small trial against a sham (pretend) treatment and a 225-patient study, including skin of color, found less acne.", unclear: "Studies are small." },
  "laser-toning": { works: "Combined small studies show it lightens melasma, more so alongside other treatments.", unclear: "Results fade, and melasma often returns." },
  pdt: { works: "Combined trials show it helps inflammatory acne; studies also support it for sun-damaged skin.", unclear: "Methods vary, and most trials are small." },
  ktp: { works: "In a small trial it cleared facial vessels faster than pulsed dye laser; a 102-patient study reported most vessels improved or cleared.", unclear: "Studies are small." },
  microcurrent: { works: "Very little independent research.", unclear: "Most studies are small, uncontrolled or linked to makers." },
  xerf: { works: "No peer-reviewed studies found yet.", unclear: "Its FDA clearance comes from the maker's announcement." },
  aviclear: { works: "Studies report fewer acne breakouts for up to 2 years.", unclear: "Most studies have no comparison group and are linked to the maker; there's no randomized trial yet." },
  "sylfirm-x": { works: "Small randomized trials suggest it helps melasma, and a study used it to help keep melasma from returning.", unclear: "Studies are small." },
  ultraclear: { works: "One small study reported better sun damage and wrinkles.", unclear: "22 people took part and 6 dropped out; there are no comparison trials." },
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
  "Limited: small, uncontrolled or maker-linked studies, or none.",
  "Some: reviews of studies or consistent smaller studies.",
  "Strong: randomized trials or combined analyses of them.",
];
