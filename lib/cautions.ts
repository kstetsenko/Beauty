import type { Caution } from "./types";

export const CAUTIONS: Record<Caution, { label: string; short: string }> = {
  pregnancy: { label: "Pregnant, trying to conceive, or nursing", short: "Pregnancy / Nursing" },
  "active-skin": { label: "Active infection, cold sore, rash or open wound in the area", short: "Active Skin Condition" },
  isotretinoin: { label: "Took isotretinoin (Accutane) in the last 6–12 months", short: "Recent Isotretinoin" },
  keloid: { label: "Prone to keloids or raised scars", short: "Keloid / Scarring Risk" },
  autoimmune: { label: "Autoimmune or neuromuscular condition", short: "Autoimmune / Neuromuscular" },
  "blood-thinners": { label: "Take blood thinners or have a bleeding disorder", short: "Blood Thinners" },
};
