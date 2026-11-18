import { Barcode, BMark, Wordmark } from "@beer/ui/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-forest p-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex items-end gap-4" dir="ltr">
          <BMark shadow className="h-16 w-auto text-lime" />
          <div className="flex flex-col gap-1.5 pb-1">
            <Barcode className="h-3 w-36" />
            <Wordmark className="text-xs" />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface/80 p-7 shadow-long">
          {children}
        </div>
      </div>
    </div>
  );
}
