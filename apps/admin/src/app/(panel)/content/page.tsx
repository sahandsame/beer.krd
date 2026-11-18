import { blockDefs, contentBlock, db } from "@beer/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDate, PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Page content" };

export default async function ContentPage() {
  await requireUser();
  const saved = await db
    .select({ key: contentBlock.key, updatedAt: contentBlock.updatedAt })
    .from(contentBlock);
  const pages = [...new Set(blockDefs.map((b) => b.page))];
  return (
    <>
      <PageTitle
        title="Page content"
        description="Edit the text on the website's pages in Kurdish, English and Arabic."
      />
      <div className="flex flex-col gap-8">
        {pages.map((page) => (
          <section key={page}>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-lime">{page}</h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {blockDefs
                .filter((b) => b.page === page)
                .map((b) => {
                  const s = saved.find((x) => x.key === b.key);
                  return (
                    <li key={b.key}>
                      <Link
                        href={`/content/${b.key}`}
                        className="flex items-center justify-between gap-4 bg-surface/50 px-5 py-4 hover:bg-surface"
                      >
                        <span>
                          <span className="font-medium">{b.label}</span>
                          <span className="ms-3 font-mono text-xs text-mist">{b.key}</span>
                        </span>
                        <span className="flex items-center gap-3 text-xs text-mist">
                          {s ? `Updated ${formatDate(s.updatedAt)}` : "Default text"}
                          <ChevronRight className="size-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
