import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WiFi.report – WiFi Error Code Diagnostic Tool",
    template: "%s | WiFi.report",
  },
  description:
    "Free WiFi error code lookup tool. Search 5,000+ error codes for Netgear, Linksys, Asus, TP-Link, Cisco, and more. Get step-by-step fixes with 88%+ success rates.",
  metadataBase: new URL("https://wifi.report"),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "WiFi.report",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
