"use client";
import { cn } from "@beer/ui/cn";
import { Link, usePathname } from "@/i18n/navigation";

export type NavItem = { href: string; label: string };

export function NavLinks({
  items,
  className,
  onNavigate,
}: {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative py-2 text-sm transition-colors hover:text-paper",
                active
                  ? "text-paper after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-lime"
                  : "text-mist",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
