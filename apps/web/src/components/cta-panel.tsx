import { BMark } from "@beer/ui/brand";
import { buttonClasses } from "@beer/ui/components/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function CtaPanel({
  title,
  body,
  button,
  href = "/contact",
}: {
  title: string;
  body: string;
  button: string;
  href?: string;
}) {
  return (
    <section className="container-site mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-lime px-8 py-14 text-ink md:px-14 md:py-20">
        <BMark
          className="pointer-events-none absolute -bottom-10 end-6 h-64 w-auto text-ink/10 md:h-80"
          aria-hidden="true"
        />
        <div className="relative flex max-w-2xl flex-col gap-5">
          <h2 className="text-3xl font-semibold leading-tight md:text-5xl">{title}</h2>
          <p className="text-lg text-ink/75">{body}</p>
          <Link
            href={href}
            className={buttonClasses({
              size: "lg",
              className:
                "self-start bg-ink text-lime shadow-[6px_6px_0_0_rgb(8_29_24/0.3)] hover:bg-forest hover:text-lime",
            })}
          >
            {button}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
