import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/");
  const { next, welcome } = (await searchParams) as { next?: string; welcome?: string };
  // Only allow same-site relative redirects.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-mist">Staff access to beer.krd</p>
      </div>
      {welcome && (
        <p
          role="status"
          className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-lime"
        >
          Your account is ready. Sign in with your new password.
        </p>
      )}
      <LoginForm next={safeNext} />
    </div>
  );
}
