import { db, getSiteSettings } from "@beer/db";
import { Card } from "@beer/ui/components/card";
import { Checkbox, Field, Input } from "@beer/ui/components/form";
import { ActionForm } from "@/components/action-form";
import { LocalizedField } from "@/components/localized-field";
import { SubmitButton } from "@/components/submit-button";
import { PageTitle } from "@/components/ui";
import { requireUser } from "@/lib/session";
import { saveSettings, testDiscord } from "./actions";

export const metadata = { title: "Settings" };

const mask = (url: string) => (url ? `${url.slice(0, 40)}…${url.slice(-4)}` : "");

export default async function SettingsPage() {
  await requireUser("admin");
  const s = await getSiteSettings(db);
  const envHook = !s.discordWebhookUrl && !!process.env.DISCORD_WEBHOOK_URL;
  return (
    <>
      <PageTitle title="Settings" description="Contact details, social links and site switches." />
      <div className="grid max-w-3xl gap-6">
        <Card>
          <ActionForm action={saveSettings}>
            <h2 className="font-semibold">Contact</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="phone" label="Phone">
                <Input id="phone" name="phone" defaultValue={s.phone} dir="ltr" />
              </Field>
              <Field id="whatsapp" label="WhatsApp number">
                <Input id="whatsapp" name="whatsapp" defaultValue={s.whatsapp} dir="ltr" />
              </Field>
              <Field id="viber" label="Viber number">
                <Input id="viber" name="viber" defaultValue={s.viber} dir="ltr" />
              </Field>
            </div>
            <Field id="email" label="Public email" hint="Leave empty to hide.">
              <Input id="email" name="email" type="email" defaultValue={s.email} dir="ltr" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="instagram" label="Instagram URL">
                <Input
                  id="instagram"
                  name="instagram"
                  type="url"
                  placeholder="https://instagram.com/…"
                  defaultValue={s.instagram}
                  dir="ltr"
                />
              </Field>
              <Field id="facebook" label="Facebook URL">
                <Input
                  id="facebook"
                  name="facebook"
                  type="url"
                  defaultValue={s.facebook}
                  dir="ltr"
                />
              </Field>
            </div>

            <h2 className="mt-4 font-semibold">Location</h2>
            <LocalizedField name="city" label="City" defaultValue={s.city} />
            <LocalizedField
              name="address"
              label="Street address"
              defaultValue={s.address}
              hint="Leave empty to show the city only."
            />
            <Field
              id="mapEmbedUrl"
              label="Google Maps embed URL"
              hint="Google Maps → Share → Embed a map → copy the src link."
            >
              <Input
                id="mapEmbedUrl"
                name="mapEmbedUrl"
                type="url"
                defaultValue={s.mapEmbedUrl}
                dir="ltr"
              />
            </Field>
            <Checkbox
              name="showMap"
              label="Show the map on the contact page"
              defaultChecked={s.showMap}
            />

            <h2 className="mt-4 font-semibold">Website</h2>
            <Checkbox
              name="workSectionEnabled"
              label="Show the Work / portfolio section"
              defaultChecked={s.workSectionEnabled}
            />

            <h2 className="mt-4 font-semibold">Discord lead alerts</h2>
            <Field
              id="discordWebhookUrl"
              label="Webhook URL"
              hint={
                s.discordWebhookUrl
                  ? `Current: ${mask(s.discordWebhookUrl)} — leave empty to keep it.`
                  : envHook
                    ? "Using DISCORD_WEBHOOK_URL from the server environment."
                    : "Discord → channel settings → Integrations → Webhooks → New webhook → Copy URL."
              }
            >
              <Input
                id="discordWebhookUrl"
                name="discordWebhookUrl"
                type="url"
                autoComplete="off"
                placeholder="https://discord.com/api/webhooks/…"
                dir="ltr"
              />
            </Field>
            {s.discordWebhookUrl && (
              <Checkbox name="clearWebhook" label="Remove the saved webhook" />
            )}

            <div className="border-t border-line pt-6">
              <SubmitButton>Save settings</SubmitButton>
            </div>
          </ActionForm>
        </Card>
        <Card>
          <ActionForm
            action={testDiscord}
            className="flex-row flex-wrap items-center justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold">Test lead alerts</h2>
              <p className="text-sm text-mist">Sends a sample lead to the Discord channel.</p>
            </div>
            <SubmitButton variant="outline">Send test</SubmitButton>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
