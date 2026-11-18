"use client";
import { type Localized, localeMeta, locales, missingLocales } from "@beer/i18n";
import { cn } from "@beer/ui/cn";
import { Input, Label, Textarea } from "@beer/ui/components/form";
import { useId, useState } from "react";

/**
 * One translatable field: a tab per language (ckb / en / ar). All three inputs stay in the
 * form so every translation is submitted; tabs only switch which one is visible.
 */
export function LocalizedField({
  name,
  label,
  defaultValue,
  multiline = false,
  rows = 4,
  required = false,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: Partial<Localized> | null;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  hint?: string;
}) {
  const id = useId();
  const [active, setActive] = useState<(typeof locales)[number]>("ckb");
  const [values, setValues] = useState<Localized>({
    ckb: defaultValue?.ckb ?? "",
    en: defaultValue?.en ?? "",
    ar: defaultValue?.ar ?? "",
  });
  const missing = missingLocales(values);

  return (
    <fieldset className="flex flex-col gap-2" aria-labelledby={`${id}-label`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label id={`${id}-label`} htmlFor={`${id}-${active}`}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </Label>
        <div
          role="tablist"
          aria-label={`${label} language`}
          className="flex rounded-full border border-line p-0.5 text-xs"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={active === l}
              onClick={() => setActive(l)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono uppercase transition-colors",
                active === l ? "bg-lime text-ink" : "text-mist hover:text-paper",
              )}
            >
              {l}
              {missing.includes(l) && (
                <span
                  className={cn("size-1.5 rounded-full", active === l ? "bg-ink/60" : "bg-warning")}
                  title={`Missing ${localeMeta[l].label}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {locales.map((l) => {
        const props = {
          id: `${id}-${l}`,
          name: `${name}.${l}`,
          dir: localeMeta[l].dir,
          lang: localeMeta[l].htmlLang,
          value: values[l],
          onChange: (e: { target: { value: string } }) =>
            setValues((v) => ({ ...v, [l]: e.target.value })),
          placeholder: localeMeta[l].label,
          className: l === "en" ? undefined : "font-[family-name:var(--font-arabic)]",
        };
        return (
          <div key={l} hidden={active !== l}>
            {multiline ? <Textarea rows={rows} {...props} /> : <Input {...props} />}
          </div>
        );
      })}
      {hint && <p className="text-xs text-mist/80">{hint}</p>}
    </fieldset>
  );
}
