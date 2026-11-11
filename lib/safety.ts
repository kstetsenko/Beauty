/**
 * Rare-but-serious risks, warning signs and "learn more" links, taken from FDA
 * labels and safety notices or CDC reports. Only procedures with an official
 * source are listed; everything else falls back to "ask your provider".
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
const FDA_BODY: Link = { label: "FDA — Non-invasive body contouring", url: "https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/non-invasive-body-contouring-technologies" };
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
  "lip-filler": FILLER,
  "cheek-filler": FILLER,
  radiesse: FILLER,
  skinvive: FILLER,
  sculptra: FILLER,
  botox: {
    serious: "The FDA label carries a boxed warning: the effect can spread beyond the injection site.",
    getHelpIf: "Trouble swallowing, speaking or breathing, general muscle weakness, double vision or drooping eyelids — hours to weeks after injection.",
    links: [{ label: "FDA label — Botox Cosmetic (prescribing information)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" }],
  },
  kybella: {
    serious: "In trials, about 4% had a nerve injury causing an uneven smile and about 2% had trouble swallowing; these resolved.",
    getHelpIf: "Trouble swallowing, or an uneven smile or facial weakness.",
    links: [{ label: "FDA label — Kybella (prescribing information)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/206333s005lbl.pdf" }],
  },
  coolsculpting: {
    serious: "Rarely the treated area grows larger 2–5 months later (paradoxical adipose hyperplasia) and may need surgery. Freeze burns and nerve damage are also possible.",
    links: [FDA_BODY],
  },
  emsculpt: {
    serious: "The FDA notes any body contouring device can cause complications.",
    links: [FDA_BODY],
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
  prp: {
    serious: "The CDC traced HIV infections to PRP microneedling facials at an unlicensed spa with poor infection control. Choose a licensed medical setting only.",
    links: [
      { label: "CDC report — HIV linked to PRP microneedling at a spa (2024)", url: "https://www.cdc.gov/mmwr/volumes/73/wr/mm7316a3.htm" },
      FDA_NEEDLING,
    ],
  },
  co2: {
    serious: "Infection (including cold-sore flare-ups), scarring and lasting color changes. Antiviral medicine is standard before resurfacing around the mouth.",
    links: [FDA_LASERS, { label: "StatPearls (NIH) — Laser complications", url: "https://www.ncbi.nlm.nih.gov/sites/books/NBK532248/" }],
  },
  fraxel: LASER,
  halo: LASER,
  moxi: LASER,
  pico: LASER,
  ipl: LASER,
  "laser-hair": LASER,
};
