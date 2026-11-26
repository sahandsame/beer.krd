"use client";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { type NavItem, NavLinks } from "./nav-links";

export function MobileMenu({
  items,
  labels,
}: {
  items: NavItem[];
  labels: { menu: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // biome-ignore lint/correctness/useExhaustiveDependencies: close whenever the route changes
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        className="grid size-10 place-items-center rounded-full border border-line text-paper"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={labels.menu}
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line/60 bg-forest animate-fade-up"
        >
          <div className="container-site flex min-h-full flex-col gap-7 py-7">
            <NavLinks
              items={items}
              className="flex flex-col [&_a]:block [&_a]:w-full [&_a]:border-b [&_a]:border-line [&_a]:py-3 [&_a]:text-2xl"
              onNavigate={() => setOpen(false)}
            />
            <LanguageSwitcher className="self-start" />
          </div>
        </div>
      )}
    </div>
  );
}
