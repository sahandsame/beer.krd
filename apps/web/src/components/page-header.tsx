import { Eyebrow } from "./eyebrow";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-site relative flex flex-col gap-5 py-16 md:py-24">
        <Eyebrow className="animate-fade-up">{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.15] animate-fade-up [animation-delay:80ms] md:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="max-w-2xl text-lg text-mist animate-fade-up [animation-delay:160ms]">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
