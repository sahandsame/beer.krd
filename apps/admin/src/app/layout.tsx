import "./globals.css";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Vazirmatn } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });
const arabic = Vazirmatn({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Beer Admin", template: "%s · Beer Admin" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#06332E", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${display.variable} ${code.variable} ${arabic.variable}`}>
      <body className="min-h-dvh bg-forest-deep text-paper">{children}</body>
    </html>
  );
}
