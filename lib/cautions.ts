import type { Caution } from "./types";

export const CAUTIONS: Record<Caution, { label: string; short: string }> = {
  pregnancy: { label: "Pregnant, trying to conceive, or nursing", short: "Pregnancy or nursing" },
  "active-skin": { label: "Rash, infection or open wound right now", short: "Active skin infection or rash" },
  isotretinoin: { label: "On isotretinoin (Accutane) now", short: "Accutane" },
  keloid: { label: "Prone to keloids or raised scars", short: "Keloid scarring" },
  autoimmune: { label: "Autoimmune or neuromuscular condition", short: "Autoimmune conditions" },
  "blood-thinners": { label: "Take blood thinners or have a bleeding disorder", short: "Blood thinners" },
};
