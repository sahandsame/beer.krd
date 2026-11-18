"use client";
import { Button } from "@beer/ui/components/button";
import { Field, Input, Select, Textarea } from "@beer/ui/components/form";
import { budgetRanges } from "@beer/validators";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { type ContactState, submitContact } from "./actions";

type Props = { services: { slug: string; name: string }[]; defaultService?: string };

/** Remounting the inner form (new key) resets the action state for "send another message". */
export function ContactForm(props: Props) {
  const [round, setRound] = useState(0);
  return <ContactFormInner key={round} {...props} onReset={() => setRound((r) => r + 1)} />;
}

function ContactFormInner({ services, defaultService, onReset }: Props & { onReset: () => void }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {
    status: "idle",
  });
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const err = (k: string) => (errors[k] ? t(`errors.${errors[k]}` as "errors.generic") : undefined);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error" && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-2xl border border-lime/40 bg-lime/10 p-8 outline-none"
      >
        <CheckCircle2 className="size-10 text-lime" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">{t("success.title")}</h2>
        <p className="text-mist">{t("success.body")}</p>
        <Button variant="outline" onClick={onReset}>
          {t("success.again")}
        </Button>
      </div>
    );
  }

  const describedBy = (k: string) => (errors[k] ? `${k}-error` : undefined);

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePage" value={`/${locale}/contact`} />
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={t("form.name")} error={err("name")}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
          />
        </Field>
        <Field id="phone" label={t("form.phone")} error={err("phone")}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+964 7xx xxx xxxx"
            required
            defaultValue={values.phone}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className="text-start rtl:text-right"
          />
        </Field>
      </div>

      <Field
        id="email"
        label={
          <>
            {t("form.email")} <span className="text-mist/60">({t("form.optional")})</span>
          </>
        }
        error={err("email")}
      >
        <Input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          defaultValue={values.email}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          className="rtl:text-right"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="serviceSlug" label={t("form.service")}>
          <Select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue={values.serviceSlug ?? defaultService ?? ""}
          >
            <option value="">{t("form.servicePlaceholder")}</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="other">{t("form.serviceOther")}</option>
          </Select>
        </Field>
        <Field id="budget" label={t("form.budget")}>
          <Select id="budget" name="budget" defaultValue={values.budget ?? ""}>
            <option value="">{t("form.budgetPlaceholder")}</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {t(`budgets.${b}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field id="message" label={t("form.message")} error={err("message")}>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder={t("form.messagePlaceholder")}
          defaultValue={values.message}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
        />
      </Field>

      {state.status === "error" && state.formError && (
        <p
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {t(`errors.${state.formError}` as "errors.generic")}
        </p>
      )}

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
          {pending ? t("form.sending") : t("form.submit")}
        </Button>
        <Link href="/privacy" className="text-xs text-mist underline-offset-4 hover:underline">
          {t("privacyNote")}
        </Link>
      </div>
    </form>
  );
}
