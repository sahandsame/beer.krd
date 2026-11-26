import { can } from "@beer/auth/roles";
import { db, lead } from "@beer/db";
import { Barcode, BMark } from "@beer/ui/brand";
import { count, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { type SidebarItem, SidebarNav } from "@/components/sidebar";
import { SidebarShell } from "@/components/sidebar-shell";
import { SignOutButton } from "@/components/sign-out-button";
import { requireUser } from "@/lib/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [{ value: newLeads } = { value: 0 }] = await db
    .select({ value: count() })
    .from(lead)
    .where(eq(lead.status, "new"));

  const items: SidebarItem[] = [
    { href: "/", label: "Dashboard", icon: "dashboard" },
    { href: "/leads", label: "Leads", icon: "leads", badge: newLeads },
    { href: "/services", label: "Services", icon: "services" },
    { href: "/projects", label: "Portfolio", icon: "projects" },
    { href: "/content", label: "Page content", icon: "content" },
    { href: "/team", label: "Team", icon: "team" },
    { href: "/media", label: "Media", icon: "media" },
    ...(can.manageSettings(user.role)
      ? [{ href: "/settings", label: "Settings", icon: "settings" } as const]
      : []),
    ...(can.manageUsers(user.role)
      ? [{ href: "/users", label: "Users", icon: "users" } as const]
      : []),
    ...(can.viewAudit(user.role)
      ? [{ href: "/audit", label: "Audit log", icon: "audit" } as const]
      : []),
  ];

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <SidebarShell
        brand={
          <Link href="/" className="flex items-center gap-3 px-2 md:pt-2" aria-label="Dashboard">
            <BMark className="h-8 w-auto text-lime" />
            <span className="flex flex-col gap-1">
              <Barcode className="h-2 w-24" />
              <span className="font-mono text-[0.65rem] tracking-[0.3em] text-mist">ADMIN</span>
            </span>
          </Link>
        }
      >
        <nav aria-label="Admin" className="flex-1 overflow-y-auto">
          <SidebarNav items={items} />
        </nav>
        <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <a
            href={process.env.WEB_URL ?? "http://localhost:3000"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 text-mist hover:text-lime"
          >
            <ExternalLink className="size-4" /> View site
          </a>
          <Link href="/account" className="flex flex-col rounded-lg px-3 py-2 hover:bg-white/5">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-mist">
              <span className="capitalize">{user.role}</span> · {user.email}
            </span>
          </Link>
          <SignOutButton />
        </div>
      </SidebarShell>
      <main className="min-w-0 p-5 md:p-10">{children}</main>
    </div>
  );
}
