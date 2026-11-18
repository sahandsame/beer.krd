import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-sm tracking-[0.4em] text-lime">404</p>
        <h1 className="text-2xl font-semibold">Not found</h1>
        <Link href="/" className="text-lime underline underline-offset-4">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
