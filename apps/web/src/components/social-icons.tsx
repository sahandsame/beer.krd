import type { SVGProps } from "react";

// Simple brand glyphs (lucide no longer ships brand icons).
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.2Z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4.5 4.5 0 0 1-2.3-2.3l.8-1-1-2Z" />
    </svg>
  );
}
export function ViberIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c-5 0-8 1.8-8 7.5 0 3.4 1.2 5.3 3 6.3V21l3-2.6c.6.1 1.3.1 2 .1 5 0 8-1.8 8-7.5S17 3 12 3Z" />
      <path d="M9.5 8c0 3 2.4 5.5 5.5 5.5l.8-1.2-1.6-.8-.8.6a3.6 3.6 0 0 1-1.9-1.9l.6-.8L11.3 7.7Z" />
    </svg>
  );
}
