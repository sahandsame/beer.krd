import { Badge, type BadgeTone } from "@beer/ui/components/badge";
import { buttonClasses } from "@beer/ui/components/button";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-mist">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
}) {
  return (
    <Link href={href} className={buttonClasses({ variant, size: "sm" })}>
      {children}
    </Link>
  );
}

const statusTone: Record<string, BadgeTone> = {
  new: "lime",
  contacted: "info",
  proposal: "warning",
  won: "lime",
  lost: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={statusTone[status] ?? "neutral"} className="capitalize">
      {status}
    </Badge>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? <Badge tone="lime">Published</Badge> : <Badge>Draft</Badge>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-mist">
      {children}
    </div>
  );
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-sm">
        <thead className="bg-surface/80 text-start text-xs uppercase tracking-wider text-mist">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 text-start font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Baghdad",
  }).format(new Date(d));
}
