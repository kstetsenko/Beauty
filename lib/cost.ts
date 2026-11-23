import type { City, Procedure } from "./types";

/**
 * Cost arithmetic from data already in the guide (price range × the usual number of sessions in `sessions`,
 * or × repeats per year from `lasts`). Not a quote: always labeled as an estimate.
 * Only treatments whose session count or duration is stated as numbers are listed.
 */
export const COURSE: Record<string, [number, number]> = {
  morpheus8: [1, 3], fraxel: [3, 5], "clear-brilliant": [3, 6], microneedling: [3, 6], sculptra: [2, 3],
  ipl: [3, 5], pico: [3, 5], emface: [4, 4], tixel: [2, 3], aerolase: [4, 6], "laser-toning": [4, 8],
  pdt: [2, 4], ktp: [1, 3], ultraclear: [3, 3],
};

/** Repeats per year to keep the result, from "how long it lasts" (e.g. 3–4 months gives 3–4 a year). */
export const PER_YEAR: Record<string, [number, number]> = {
  botox: [3, 4], skinvive: [2, 2], threads: [1, 2], "smile-filler": [1, 2],
};

const usd = (n: number) => "$" + n.toLocaleString("en-US");
const range = (a: number, b: number) => (a === b ? usd(a) : `${usd(a)}–${usd(b)}`);

export function courseCost(p: Procedure, city: City): string | undefined {
  const c = COURSE[p.id], price = p.cost[city];
  if (!c || !price) return undefined;
  return range(price[0] * c[0], price[1] * c[1]);
}

export function yearlyCost(p: Procedure, city: City): string | undefined {
  const y = PER_YEAR[p.id], price = p.cost[city];
  if (!y || !price) return undefined;
  return range(price[0] * y[0], price[1] * y[1]);
}

export const courseNote = (p: Procedure) => {
  const c = COURSE[p.id];
  return c ? `${c[0] === c[1] ? c[0] : `${c[0]}–${c[1]}`} sessions × price per session` : "";
};
export const yearNote = (p: Procedure) => {
  const y = PER_YEAR[p.id];
  return y ? `${y[0] === y[1] ? y[0] : `${y[0]}–${y[1]}`} times a year × price, if repeated to keep the result` : "";
};
