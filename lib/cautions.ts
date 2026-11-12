import type { Caution } from "./types";

export interface Source { label: string; url: string }
const VOLUMA = "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S070D.pdf";
const BELLAFILL = "https://www.accessdata.fda.gov/cdrh_docs/pdf2/P020012S009c.pdf";

/** The label or guideline behind each health question: shown next to every treatment it hides. */
export const CAUTION_SOURCE: Record<Caution, Source> = {
  pregnancy: { label: "FDA filler labeling: safety in pregnancy and breastfeeding has not been established", url: VOLUMA },
  "active-skin": { label: "FDA labeling: treat only once skin inflammation or infection has cleared", url: BELLAFILL },
  isotretinoin: { label: "JAMA Dermatology expert consensus on procedures during isotretinoin (2017)", url: "https://pubmed.ncbi.nlm.nih.gov/28658462/" },
  keloid: { label: "FDA labeling: not advised for people prone to keloid or raised scars", url: BELLAFILL },
  autoimmune: { label: "Botox FDA label: warnings for neuromuscular disorders", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/103000s5306lbl.pdf" },
  "blood-thinners": { label: "FDA labeling: caution with bleeding disorders", url: BELLAFILL },
  "severe-allergy": { label: "FDA filler labeling: severe allergies and lidocaine allergy", url: VOLUMA },
  "bovine-collagen": { label: "Bellafill FDA labeling: bovine collagen allergy (skin test required)", url: BELLAFILL },
  "implant-device": { label: "Thermage labeling: pacemakers and other implanted electronic devices", url: "https://www.thermage.com/hcp/" },
  "light-sensitivity": { label: "Levulan FDA label: porphyria and sensitivity to light", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/020965s015lbl.pdf" },
};

export const CAUTIONS: Record<Caution, { label: string; short: string }> = {
  pregnancy: { label: "Pregnant, trying to conceive, or nursing", short: "Pregnancy or nursing" },
  "active-skin": { label: "Rash, infection or open wound right now", short: "Active skin infection or rash" },
  isotretinoin: { label: "On isotretinoin (Accutane) now", short: "Accutane" },
  keloid: { label: "Prone to keloids or raised scars", short: "Keloid scarring" },
  autoimmune: { label: "Autoimmune or neuromuscular condition", short: "Autoimmune conditions" },
  "blood-thinners": { label: "Take blood thinners or have a bleeding disorder", short: "Blood thinners or bleeding disorder" },
  // FDA labeling for hyaluronic acid fillers (e.g. Juvéderm) and Bellafill: severe allergies / anaphylaxis, lidocaine allergy.
  "severe-allergy": { label: "Severe allergies (anaphylaxis) or allergy to lidocaine", short: "Severe allergies or lidocaine allergy" },
  // Bellafill FDA labeling: contraindicated with any bovine collagen allergy; a skin test is required first.
  "bovine-collagen": { label: "Allergy to bovine (cow) collagen", short: "Bovine collagen allergy" },
  // Thermage maker's labeling: contraindicated with a pacemaker, ICD or other implanted electrical device.
  "implant-device": { label: "Pacemaker or other implanted electronic device", short: "Implanted electronic device" },
  // Levulan (PDT) label: contraindicated with porphyria, porphyrin allergy or sensitivity to blue light.
  "light-sensitivity": { label: "Porphyria or skin sensitivity to light", short: "Porphyria or light sensitivity" },
};

/** Where each newer caution comes from (shown on "How we research"). */
export const CAUTION_SOURCES: { label: string; url: string }[] = [
  { label: "FDA labeling — Juvéderm Voluma XC (severe allergies, lidocaine)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf11/P110033S070D.pdf" },
  { label: "FDA labeling — Bellafill (bovine collagen, skin test)", url: "https://www.accessdata.fda.gov/cdrh_docs/pdf2/P020012S009c.pdf" },
  { label: "Thermage FLX — important safety information (implanted devices)", url: "https://www.thermage.com/hcp/" },
  { label: "FDA label — Levulan Kerastick (porphyria, light sensitivity)", url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2018/020965s015lbl.pdf" },
];
