import type { SiteSettings } from "@beer/validators";

const digits = (s: string) => s.replace(/[^\d+]/g, "");

/** Click-to-call / chat links built from the settings saved in the admin. */
export function contactLinks(s: SiteSettings) {
  const wa = digits(s.whatsapp).replace(/^\+/, "");
  const viber = digits(s.viber);
  return {
    tel: s.phone ? `tel:${digits(s.phone)}` : null,
    whatsapp: wa ? `https://wa.me/${wa}` : null,
    viber: viber
      ? `viber://chat?number=${encodeURIComponent(viber.startsWith("+") ? viber : `+${viber}`)}`
      : null,
    instagram: s.instagram || null,
    facebook: s.facebook || null,
    email: s.email ? `mailto:${s.email}` : null,
  };
}
