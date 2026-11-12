/**
 * Rare-but-serious risks, warning signs and "learn more" links, taken from FDA
 * labels and safety notices or CDC reports. Only procedures with an official
 * source are listed; everything else shows only common side effects.
 */

export interface Link {
  label: string;
  url: string;
}

export interface Safety {
  serious: string;
  getHelpIf?: string;
  links: Link[];
}

const FDA_FILLERS: Link = { label: "FDA — Dermal fillers: what to know", url: "https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/dermal-fillers-soft-tissue-fillers" };
const FDA_FILLER_TIPS: Link = { label: "FDA — Dermal filler do's and don'ts", url: "https://www.fda.gov/consumers/consumer-updates/dermal-filler-dos-and-donts-wrinkles-lips-and-more" };
const FDA_LASERS: Link = { label: "FDA — Medical lasers: benefits and risks", url: "https://www.fda.gov/radiation-emitting-products/surgical-and-therapeutic-products/medical-lasers" };
const FDA_NEEDLING: Link = { label: "FDA — Microneedling devices", url: "https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/microneedling-devices" };
const FDA_NEEDLING_CONSUMER: Link = { label: "FDA — Microneedling: benefits, risks and safety", url: "https://www.fda.gov/consumers/consumer-updates/microneedling-devices-getting-point-benefits-risks-and-safety" };

const FILLER: Safety = {
  serious: "Rarely, filler injected into a blood vessel can cause skin damage, vision loss or stroke.",
  getHelpIf: "Vision changes, signs of stroke (trouble speaking, face drooping, weakness), skin near the injection turning white, gray or blue, or unusual pain during or after treatment.",
  links: [FDA_FILLERS, FDA_FILLER_TIPS],
};

const LASER: Safety = {
  serious: "Burns, scarring, infection and lasting skin color changes are possible, more often on deeper skin tones.",
  links: [FDA_LASERS],
};

export const SAFETY: Record<string, Safety> = {
  ultraclear: LASER,
  "cheek-filler": FILLER,
  "smile-filler": FILLER,
  bellafill: FILLER,
  radiesse: FILLER,
  skinvive: FILLER,
  sculptra: FILLER,
  "under-eye": FILLER,
  erbium: LASER,
  pdl: LASER,
  botox: {
    serious: "The FDA label carries a boxed warning: the effect can spread beyond the injection site.",
    getHelpIf: "Trouble swallowing, speaking or breathing, general muscle weakness, double vision or drooping eyelids — hours to weeks after injection.",
    links: [{ label: "FDA label — Botox Cosmetic (prescribing information)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" }],
  },
  morpheus8: {
    serious: "In October 2025 the FDA warned of reports of burns, scarring, fat loss, disfigurement and nerve damage after RF microneedling.",
    links: [
      { label: "FDA safety communication — RF microneedling (Oct 2025)", url: "https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication" },
      FDA_NEEDLING,
    ],
  },
  microneedling: {
    serious: "Infection and skin color changes are possible. Use only FDA-authorized devices, with new sterile needles for each person.",
    links: [FDA_NEEDLING, FDA_NEEDLING_CONSUMER],
  },
  co2: {
    serious: "Infection (including cold-sore flare-ups), scarring and lasting color changes. Antiviral medicine is standard before resurfacing around the mouth.",
    links: [FDA_LASERS, { label: "StatPearls (NIH) — Laser complications", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK532248/" }],
  },
  fraxel: LASER,
  "clear-brilliant": LASER,
  pico: LASER,
  ipl: LASER,

};
// Same FDA RF-microneedling safety communication applies to every RF microneedling device.
SAFETY["sylfirm-x"] = SAFETY.morpheus8;
