"use client";
import { authClient } from "@beer/auth/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/login");
        router.refresh();
      }}
      className="flex items-center gap-2 px-3 py-1 text-start text-mist hover:text-paper"
    >
      <LogOut className="size-4" /> Sign out
    </button>
  );
}
