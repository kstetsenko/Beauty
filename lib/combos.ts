import type { Source } from "./cautions";

/**
 * Treatments often combined, listed only where a cited study or expert consensus supports the pairing.
 * Shown on both treatments' pages as "Often combined with".
 */
export interface Combo { ids: [string, string]; text: string; source: Source }

export const COMBOS: Combo[] = [
  {
    ids: ["botox", "smile-filler"],
    text: "In a randomized trial of lower-face treatment, Botox combined with a hyaluronic acid filler gave greater improvement than either alone.",
    source: { label: "Randomized trial, Dermatologic Surgery (2010)", url: "https://pubmed.ncbi.nlm.nih.gov/21134044/" },
  },
  {
    ids: ["botox", "skinvive"],
    text: "A randomized split-face trial studied Botox combined with Skinvive for wrinkles around the eyes.",
    source: { label: "Randomized split-face trial (2025)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12355333/" },
  },
  {
    ids: ["fraxel", "morpheus8"],
    text: "A randomized split-face trial studied a 1550 nm fractional laser combined with radiofrequency microneedling for acne scars.",
    source: { label: "Randomized split-face trial", url: "https://pubmed.ncbi.nlm.nih.gov/28512669/" },
  },
  {
    ids: ["laser-toning", "ipl"],
    text: "A meta-analysis found that adding low-energy laser toning to IPL gave greater improvement in melasma than IPL alone.",
    source: { label: "Meta-analysis, Journal of Cosmetic Dermatology (2022)", url: "https://pubmed.ncbi.nlm.nih.gov/35621242/" },
  },
  {
    ids: ["pdt", "ipl"],
    text: "In a split-face study, adding a light-sensitizing solution before IPL (photodynamic therapy) gave greater improvement in sun-damaged skin than IPL alone.",
    source: { label: "Split-face study", url: "https://pubmed.ncbi.nlm.nih.gov/15696983/" },
  },
];

export function combosFor(id: string) {
  return COMBOS.filter((c) => c.ids.includes(id)).map((c) => ({ partner: c.ids[0] === id ? c.ids[1] : c.ids[0], text: c.text, source: c.source }));
}
