"use client";
import { cn } from "@beer/ui/cn";
import {
  Briefcase,
  FileText,
  Image,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  ScrollText,
  Settings,
  Shapes,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  leads: Inbox,
  services: Shapes,
  projects: Briefcase,
  content: FileText,
  team: Users,
  media: Image,
  settings: Settings,
  users: UserCog,
  audit: ScrollText,
};

export type SidebarItem = { href: string; label: string; icon: keyof typeof icons; badge?: number };

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = icons[item.icon] ?? LayoutDashboard;
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-lime text-ink" : "text-mist hover:bg-white/5 hover:text-paper",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {!!item.badge && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs",
                    active ? "bg-ink/15" : "bg-lime/15 text-lime",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
