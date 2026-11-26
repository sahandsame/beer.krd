"use client";
import { cn } from "@beer/ui/cn";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Sidebar on desktop; on narrow screens a compact top bar whose menu button
 * reveals the navigation (instead of the whole sidebar pushing the page down).
 */
export function SidebarShell({ brand, children }: { brand: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // biome-ignore lint/correctness/useExhaustiveDependencies: close whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <aside className="sticky top-0 z-40 flex flex-col border-b border-line bg-forest p-4 md:h-dvh md:gap-6 md:border-e md:border-b-0">
      <div className="flex items-center justify-between">
        {brand}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          aria-label={open ? "Close menu" : "Menu"}
          className="grid size-10 place-items-center rounded-full border border-line text-paper md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div
        id="admin-sidebar"
        className={cn(
          "min-h-0 flex-1 flex-col gap-6 md:flex",
          open ? "mt-4 flex max-h-[calc(100dvh-5.5rem)] overflow-y-auto" : "hidden",
        )}
      >
        {children}
      </div>
    </aside>
  );
}
