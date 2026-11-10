import type { Caution } from "./types";

export const CAUTIONS: Record<Caution, { label: string; short: string }> = {
  pregnancy: { label: "Pregnant, trying to conceive, or nursing", short: "Pregnancy or nursing" },
  "active-skin": { label: "Active infection, cold sore, rash or open wound in the area", short: "Skin irritation" },
  isotretinoin: { label: "Took isotretinoin (Accutane) in the last 6–12 months", short: "Recent Accutane" },
  keloid: { label: "Prone to keloids or raised scars", short: "Keloid scarring" },
  autoimmune: { label: "Autoimmune or neuromuscular condition", short: "Autoimmune conditions" },
  "blood-thinners": { label: "Take blood thinners or have a bleeding disorder", short: "Blood thinners" },
};
