import { type SVGProps, useId } from "react";
import { cn } from "../cn";

/** The italic "B" from the Beer Agency logo, redrawn from the original artwork. */
export const B_PATH =
  "M237 2H262C346 4 396 52 396 128C396 176 371 211 328 229C381 248 410 294 410 352C410 440 346 498 250 498H-1Z";

export const brandColors = {
  green: "#06332E",
  ink: "#081D18",
  lime: "#C6DB62",
  white: "#FAFFFE",
} as const;

type MarkProps = SVGProps<SVGSVGElement> & { shadow?: boolean; title?: string };

/**
 * The B mark. With `shadow`, adds the long diagonal shadow from the logo
 * (it always falls down-right, like the original, regardless of text direction).
 */
export function BMark({ shadow = false, title = "Beer Agency", className, ...props }: MarkProps) {
  const id = `bshadow${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox="-1 0 412 500"
      role="img"
      aria-label={title}
      className={cn("overflow-visible", className)}
      {...props}
    >
      {shadow && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0.05" stopColor={brandColors.ink} stopOpacity="0.9" />
              <stop offset="0.6" stopColor={brandColors.ink} stopOpacity="0.18" />
              <stop offset="1" stopColor={brandColors.ink} stopOpacity="0" />
            </linearGradient>
            <filter id={`${id}-blur`} x="-10%" y="-10%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {/* The B outline swept 220 units along the 45° diagonal: the long shadow. Overflows the viewBox. */}
          <path
            fill={`url(#${id})`}
            d="M362.6 39.2L582.6 259.2C604.3 280.8 616 311.1 616 348C616 396 591 431 548 449C601 468 630 514 630 572C630 660 566 718 470 718H219L-1 498H250C346 498 410 440 410 352C410 294 381 248 328 229C371 211 396 176 396 128C396 91.1 384.3 60.8 362.6 39.2Z"
            filter={`url(#${id}-blur)`}
          />
        </>
      )}
      <path fill="currentColor" d={B_PATH} />
    </svg>
  );
}

/** Deterministic bar pattern so server and client render the same barcode. */
const BARS: Array<[number, number]> = [
  [3, 4],
  [2, 3],
  [3, 6],
  [2, 3],
  [3, 3],
  [2, 6],
  [3, 4],
  [2, 3],
  [6, 4],
  [3, 2],
  [3, 2],
  [4, 3],
  [3, 2],
  [3, 5],
  [2, 3],
  [4, 5],
  [3, 3],
  [2, 5],
  [3, 3],
  [2, 4],
  [4, 3],
  [2, 5],
  [3, 2],
  [2, 3],
  [5, 4],
  [2, 3],
  [3, 6],
  [3, 2],
  [7, 0],
];

type BarcodeProps = SVGProps<SVGSVGElement> & {
  /** Fraction of bars drawn in lime before turning black then white, like the logo. */
  split?: number;
  animated?: boolean;
};

export function Barcode({ split = 0.36, animated = false, className, ...props }: BarcodeProps) {
  let x = 0;
  const total = BARS.reduce((n, [w, g]) => n + w + g, 0);
  const rects = BARS.map(([w, g], i) => {
    const pos = x / total;
    const fill =
      pos < split ? brandColors.lime : pos < split + 0.12 ? brandColors.ink : brandColors.white;
    const r = (
      <rect
        key={i}
        x={x}
        y={0}
        width={w}
        height={20}
        fill={fill}
        className={animated ? "barcode-bar" : undefined}
        style={animated ? { animationDelay: `${i * 35}ms` } : undefined}
      />
    );
    x += w + g;
    return r;
  });
  return (
    <svg
      viewBox={`0 0 ${total} 20`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {rects}
    </svg>
  );
}

/** "B e e r  A g e n c y" in wide-tracked monospace, Beer in lime and Agency in white. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("font-mono tracking-[0.35em] whitespace-nowrap", className)}>
      <span className="text-lime">Beer</span> <span className="text-paper">Agency</span>
    </span>
  );
}

/** Full lockup: B mark, barcode and wordmark stacked, as in the original logo. */
export function Logo({ className, shadow = true }: { className?: string; shadow?: boolean }) {
  return (
    <span dir="ltr" className={cn("inline-flex flex-col items-start gap-3", className)}>
      <BMark shadow={shadow} className="w-full text-lime" />
      <Barcode className="h-6 w-[92%]" />
      <Wordmark className="text-sm" />
    </span>
  );
}

/** Compact horizontal logo for headers. */
export function LogoInline({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("inline-flex items-center gap-3", className)}>
      <BMark className="h-8 w-auto text-lime" />
      <span className="flex flex-col gap-1">
        <Barcode className="h-2.5 w-[7.5rem]" />
        <Wordmark className="text-[0.7rem] tracking-[0.3em]" />
      </span>
    </span>
  );
}
