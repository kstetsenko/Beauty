"use client";
import { track, tagUrl, type TrackEvent } from "@/lib/tracking";

/**
 * An outbound link that records the tap (lib/tracking.ts) before the browser follows it.
 * With `tag`, the clinic's address gets UTM tags and a click id so the visit shows up in
 * the clinic's own analytics as coming from us.
 */
export function TrackedLink({
  href,
  ev,
  tag = false,
  className,
  children,
}: {
  href: string;
  ev: TrackEvent;
  tag?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={tag ? tagUrl(href, ev.treatment) : href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      onClick={(e) => {
        const click = track(ev);
        if (tag) e.currentTarget.href = tagUrl(href, ev.treatment, click);
      }}
    >
      {children}
    </a>
  );
}
