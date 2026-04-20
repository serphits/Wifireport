import type { Metadata } from "next";
import Link from "next/link";
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
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur bg-white/90 dark:bg-slate-950/85">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="font-semibold tracking-tight">WiFi.report</span>
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/error"
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  Error Index
                </Link>
              </nav>
            </div>
          </header>

          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-blue-100/60 via-indigo-100/30 to-transparent dark:from-blue-900/20 dark:via-slate-900 dark:to-transparent pointer-events-none" />

          <div className="flex-1">{children}</div>

          <footer className="border-t border-slate-200 dark:border-slate-800 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <p>© {new Date().getFullYear()} WiFi.report. Network diagnostics and error resolution.</p>
              <p>Built for clear, fast troubleshooting.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
