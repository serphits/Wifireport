import type { Metadata } from "next";
import Link from "next/link";
import { getTopCodes, getAllManufacturers } from "@/lib/codes";
import DiagnosticDashboardWrapper from "@/components/DiagnosticDashboardWrapper";

export const metadata: Metadata = {
  title: "WiFi Error Code Lookup – 5,000+ Diagnostic Codes",
  description:
    "Look up any WiFi error code instantly. Database of 5,000+ codes for Netgear, Linksys, Asus, TP-Link, Cisco & more. Step-by-step fixes with 88%+ success rates.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const topCodes = getTopCodes(12);
  const manufacturers = getAllManufacturers();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          WiFi Error Code{" "}
          <span className="text-blue-600 dark:text-blue-400">
            Diagnostic Tool
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          Search 5,000+ error codes for Netgear, Linksys, Asus, TP-Link,
          Cisco, and more. Get step-by-step fixes with community-verified
          success rates.
        </p>

        {/* Search Form — static HTML, always visible */}
        <form
          action="/error"
          method="get"
          className="flex gap-3 max-w-lg mx-auto"
          role="search"
          aria-label="WiFi error code search"
        >
          <input
            type="search"
            name="code"
            placeholder="Enter error code (e.g. R6700-01)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="WiFi error code"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Diagnose
          </button>
        </form>
      </section>

      {/* DiagnosticDashboard — deferred for INP optimization */}
      <div className="mb-12">
        <DiagnosticDashboardWrapper />
      </div>

      {/* Top Error Codes — static server-rendered content */}
      <section aria-labelledby="top-codes-heading" className="mb-12">
        <h2
          id="top-codes-heading"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-6"
        >
          Most Searched WiFi Error Codes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCodes.map((code) => (
            <Link
              key={code.code}
              href={`/error/${encodeURIComponent(code.code)}`}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:underline">
                  {code.code}
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                  {code.successRate}% fixed
                </span>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {code.manufacturer} – {code.categoryName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {code.cause}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Manufacturer Index */}
      <section aria-labelledby="manufacturers-heading" className="mb-12">
        <h2
          id="manufacturers-heading"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
        >
          Browse by Manufacturer
        </h2>
        <div className="flex flex-wrap gap-2">
          {manufacturers.map((mfr) => (
            <Link
              key={mfr}
              href={`/error?manufacturer=${encodeURIComponent(mfr)}`}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
            >
              {mfr}
            </Link>
          ))}
        </div>
      </section>

      {/* Feature description — Information Gain content */}
      <section
        aria-labelledby="about-heading"
        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
      >
        <h2
          id="about-heading"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
        >
          The Most Comprehensive WiFi Error Database
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
          <p>
            WiFi.report maintains a curated database of over 5,000 WiFi error
            codes sourced from router manufacturers including Netgear, Linksys,
            Asus, TP-Link, Cisco, D-Link, Ubiquiti, Arris, Motorola, Google
            Nest, Eero, Synology, Actiontec, and Belkin. Each entry includes
            the root cause, step-by-step fix instructions, and a community
            success rate based on verified user reports.
          </p>
          <p className="mt-3">
            Our real-time{" "}
            <strong>Diagnostic Dashboard</strong> uses browser-native
            APIs—<code>navigator.connection</code> and{" "}
            <code>{`performance.getEntriesByType('resource')`}</code>—to
            measure your current network latency and jitter, helping you
            correlate live performance data with the error you&apos;re
            experiencing.
          </p>
        </div>
      </section>
    </main>
  );
}
