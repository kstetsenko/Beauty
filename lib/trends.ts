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
      { label: "Case series — reactions after exosome injections", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12528963/" },
    ],
  },
  {
    id: "profhilo",
    name: "Profhilo",
    status: "Not FDA-approved in the U.S.",
    why: "A popular European hyaluronic acid skin booster. Its U.S. partner plans the clinical trials the FDA requires, so it isn't legally marketed here yet. Skinvive is the FDA-approved skin booster.",
    goals: ["glow", "texture", "lift"],
    links: [
      { label: "Plastic Surgery Practice — Evolus to bring Profhilo to the U.S.", url: "https://plasticsurgerypractice.com/client-objectives/rejuvenation/injectibles/evolus-bring-profhilo-united-states-new-partnership/" },
      { label: "FDA — Skinvive approval (the approved alternative)", url: "https://www.fda.gov/medical-devices/recently-approved-devices/skinvive-juvederm-p110033s059" },
    ],
  },
];
