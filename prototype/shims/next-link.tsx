import { forwardRef } from "react";

/** Stand-in for next/link: a plain anchor; the prototype's click handler routes it. */
const Link = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
  function Link(props, ref) {
    return <a ref={ref} {...props} />;
  },
);
export default Link;
