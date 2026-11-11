/**
 * Hand-picked explainer videos per treatment. EMPTY on purpose: add a video only after
 * someone has watched it and confirmed (1) the presenter is a board-certified
 * dermatologist or plastic surgeon, or a medical organization (AAD, ASPS…), and
 * (2) it isn't clinic advertising. We link out (no embedded player) so YouTube
 * doesn't track visitors on our pages.
 *
 * Example:
 * botox: [{ title: "…", url: "https://www.youtube.com/watch?v=…", presenter: "Dr. … (board-certified dermatologist)", checked: "2026-11-15" }],
 */
export interface Video {
  title: string;
  url: string;
  presenter: string;
  checked: string;
}

export const VIDEOS: Record<string, Video[]> = {};
