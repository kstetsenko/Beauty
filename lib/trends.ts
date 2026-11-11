import type { Goal } from "./types";

/** Trending treatments people ask about that are not FDA-approved. Shown as cautions, never recommended. */
export interface Trend {
  id: string;
  name: string;
  status: string;
  why: string;
  goals: Goal[];
  links: { label: string; url: string }[];
}

export const TRENDS: Trend[] = [
  {
    id: "exosomes",
    name: "Exosome facials & injections",
    status: "Not FDA-approved",
    why: "The FDA says there are no approved exosome products and has warned clinics marketing them. Case reports describe lasting nodules, scarring and skin death after injections.",
    goals: ["glow", "texture", "acne", "lines"],
    links: [
      { label: "FDA — Public safety notification on exosome products", url: "https://www.fda.gov/vaccines-blood-biologics/safety-availability-biologics/public-safety-notification-exosome-products" },
      { label: "FDA — Consumer alert on stem cells and exosomes", url: "https://www.fda.gov/vaccines-blood-biologics/consumers-biologics/consumer-alert-regenerative-medicine-products-including-stem-cells-and-exosomes" },
      { label: "Case series — reactions after exosome injections", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12528963/" },
    ],
  },
];
