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
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-forest/98 backdrop-blur animate-fade-up"
        >
          <div className="container-site flex flex-col gap-8 py-8">
            <NavLinks
              items={items}
              className="flex flex-col gap-2 text-2xl [&_a]:text-xl"
              onNavigate={() => setOpen(false)}
            />
            <LanguageSwitcher className="self-start" />
          </div>
        </div>
      )}
    </div>
  );
}
