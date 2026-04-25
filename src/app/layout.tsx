import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamSense — Stop scam calls before money leaves your wallet",
  description:
    "Private on-device AI scam call protection. Real multi-cloud risk pipeline (AWS + Alibaba Cloud) for Touch 'n Go eWallet users in Malaysia.",
  applicationName: "ScamSense",
  keywords: [
    "ScamSense",
    "Touch n Go",
    "TNG",
    "scam detection",
    "fraud prevention",
    "Malaysia fintech",
    "FINHACK 2026"
  ],
  authors: [{ name: "ScamSense Team" }]
};

export const viewport: Viewport = {
  themeColor: "#05060A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink-950 text-zinc-100 antialiased min-h-screen bg-premium-gradient">
        {children}
      </body>
    </html>
  );
}
