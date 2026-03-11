import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCodeBySlug,
  getRelatedBySeries,
  getDeepDive,
  formatDate,
  getAllCodes,
  getRelatedCodes,
} from "@/lib/codes";
import RelatedErrors from "@/components/RelatedErrors";
import DiagnosticDashboardWrapper from "@/components/DiagnosticDashboardWrapper";
import CommunityFixChartWrapper from "@/components/CommunityFixChartWrapper";

interface Props {
  params: Promise<{ code: string }>;
}

// Generate static params for top codes — ISR handles the rest
export async function generateStaticParams() {
  const codes = getAllCodes();
  return codes.slice(0, 200).map((c) => ({ code: c.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const entry = getCodeBySlug(decodeURIComponent(code));

  if (!entry) {
    return { title: "Error Code Not Found | WiFi.report" };
  }

  // Answer Engine meta format for SGE / AI Overviews
  const shortSteps = entry.fixSteps
    .slice(0, 2)
    .map((s, i) => `${i + 1}. ${s.split(":")[0]}`)
    .join(", ");
  const answerEngineDescription = `Error ${entry.code}: Caused by ${entry.cause}. Fix: ${shortSteps}. Success rate: ${entry.successRate}%.`;

  return {
    title: `${entry.code} – ${entry.categoryName} Fix (${entry.successRate}% Success)`,
    description: answerEngineDescription,
    alternates: { canonical: `/error/${entry.code}` },
    openGraph: {
      title: `Fix ${entry.code} – ${entry.manufacturer} ${entry.categoryName}`,
      description: answerEngineDescription,
      type: "article",
    },
    keywords: [
      entry.code,
      entry.manufacturer,
      entry.series,
      entry.categoryName,
      `${entry.code} fix`,
      `${entry.manufacturer} ${entry.categoryName} error`,
    ],
  };
}

function buildHowToJsonLd(entry: ReturnType<typeof getCodeBySlug>) {
  if (!entry) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Fix ${entry.code} – ${entry.categoryName}`,
    description: `Step-by-step guide to fix ${entry.code} on ${entry.manufacturer} ${entry.series} routers. ${entry.successRate}% success rate.`,
    image: "https://wifi.report/og-image.png",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    tool: [
      { "@type": "HowToTool", name: "Web browser" },
      { "@type": "HowToTool", name: `${entry.manufacturer} ${entry.series} router` },
    ],
    step: entry.fixSteps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: step,
      url: `https://wifi.report/error/${entry.code}#step-${idx + 1}`,
    })),
    totalTime: "PT10M",
  };
}

function buildSoftwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WiFi.report Diagnostic Tool",
    applicationCategory: "NetworkingApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Real-time WiFi error code diagnostic tool with 5,000+ error codes, live latency measurement, and community fix rates.",
    url: "https://wifi.report",
    featureList: [
      "5,000+ WiFi error codes",
      "Real-time network latency measurement",
      "Step-by-step fix guides",
      "Community success rates",
    ],
  };
}

export default async function ErrorCodePage({ params }: Props) {
  const { code } = await params;
  const entry = getCodeBySlug(decodeURIComponent(code));

  if (!entry) notFound();

  const seriesErrors = getRelatedBySeries(entry, 6);
  const categoryErrors = getRelatedCodes(entry, 5).filter(
    (c) => c.manufacturer !== entry.manufacturer
  );
  const deepDive = getDeepDive(entry.deepDiveKey);
  const howToJsonLd = buildHowToJsonLd(entry);
  const softwareAppJsonLd = buildSoftwareAppJsonLd();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd),
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                WiFi.report
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/error"
                className="hover:text-blue-600 transition-colors"
              >
                Error Codes
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              className="text-slate-900 dark:text-white font-mono font-semibold"
              aria-current="page"
            >
              {entry.code}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Error Header — static, always visible */}
            <section aria-labelledby="error-title">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
                    {entry.manufacturer}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 px-2.5 py-1 rounded-full">
                    {entry.series}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2.5 py-1 rounded-full">
                    {entry.categoryName}
                  </span>
                </div>

                <h1
                  id="error-title"
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono mb-3"
                >
                  {entry.code}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  <strong>Cause:</strong> {entry.cause}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Success rate:{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {entry.successRate}%
                      </strong>
                    </span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  {/* Freshness signal */}
                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                    Technical solution verified by WiFi.report Engineering Team
                    on{" "}
                    <time dateTime={entry.lastValidated}>
                      {formatDate(entry.lastValidated)}
                    </time>
                  </span>
                </div>
              </div>
            </section>

            {/* Fix Steps — STATIC HTML, zero-JS fallback */}
            <section
              aria-labelledby="fix-steps-heading"
              id="fix-steps"
            >
              <h2
                id="fix-steps-heading"
                className="text-xl font-bold text-slate-900 dark:text-white mb-4"
              >
                Step-by-Step Fix Guide
              </h2>
              <ol className="static-fix-steps list-none p-0 space-y-0">
                {entry.fixSteps.map((step, idx) => (
                  <li
                    key={idx}
                    id={`step-${idx + 1}`}
                    className="pl-14 pr-4 py-3 relative border-l-4 border-blue-500 mb-3 bg-slate-50 dark:bg-slate-800 rounded-r-xl"
                    itemProp="step"
                    itemScope
                    itemType="https://schema.org/HowToStep"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {idx + 1}
                    </span>
                    <span itemProp="text" className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Community Fix Chart — deferred client component */}
            <CommunityFixChartWrapper
              fixes={entry.communityFixes}
              successRate={entry.successRate}
            />

            {/* Diagnostic Dashboard — deferred */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Test Your Connection Now
              </h2>
              <DiagnosticDashboardWrapper compact={false} />
            </div>

            {/* Deep Dive Section — server-rendered, minimum 300 words */}
            <section
              aria-labelledby="deep-dive-heading"
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <h2
                id="deep-dive-heading"
                className="text-xl font-bold text-slate-900 dark:text-white mb-4"
              >
                Technical Deep Dive: {entry.categoryName}
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                {deepDive.split("\n\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph.trim()}</p>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Quick Stats
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Error Code</dt>
                  <dd className="font-mono font-bold text-slate-900 dark:text-white">
                    {entry.code}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Manufacturer</dt>
                  <dd className="text-slate-700 dark:text-slate-300">
                    {entry.manufacturer}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Product Series</dt>
                  <dd className="text-slate-700 dark:text-slate-300">
                    {entry.series}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="text-slate-700 dark:text-slate-300">
                    {entry.categoryName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Success Rate</dt>
                  <dd className="font-bold text-emerald-600 dark:text-emerald-400">
                    {entry.successRate}%
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Last Validated</dt>
                  <dd className="text-slate-700 dark:text-slate-300 text-xs">
                    {formatDate(entry.lastValidated)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Related Errors — internal link mesh */}
            <RelatedErrors
              currentCode={entry}
              seriesErrors={seriesErrors}
              categoryErrors={categoryErrors}
            />
          </aside>
        </div>
      </main>
    </>
  );
}
