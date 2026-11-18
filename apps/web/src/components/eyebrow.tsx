import { Barcode } from "@beer/ui/brand";
import { cn } from "@beer/ui/cn";

/** Small label above headings: a mini barcode and monospace text, echoing the logo. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-lime",
        className,
      )}
    >
      <Barcode className="h-3 w-10 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
