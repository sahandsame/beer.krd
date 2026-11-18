import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { saveService } from "../actions";
import { ServiceForm } from "../service-form";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireUser();
  return (
    <>
      <Link href="/services" className="mb-4 inline-block text-sm text-mist hover:text-lime">
        ← Services
      </Link>
      <PageTitle title="New service" />
      <ServiceForm action={saveService.bind(null, null)} />
    </>
  );
}
