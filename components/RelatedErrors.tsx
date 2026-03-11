import Link from "next/link";
import { ErrorCode } from "@/lib/codes";

interface RelatedErrorsProps {
  currentCode: ErrorCode;
  seriesErrors: ErrorCode[];
  categoryErrors?: ErrorCode[];
}

export default function RelatedErrors({
  currentCode,
  seriesErrors,
  categoryErrors = [],
}: RelatedErrorsProps) {
  return (
    <aside aria-label="Related WiFi Errors">
      {seriesErrors.length > 0 && (
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Other {currentCode.manufacturer} {currentCode.series} Errors
          </h2>
          <ul className="space-y-2">
            {seriesErrors.map((rel) => (
              <li key={rel.code}>
                <Link
                  href={`/error/${encodeURIComponent(rel.code)}`}
                  className="flex items-center justify-between group py-1.5 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-sm">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                      {rel.code}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2 text-xs">
                      {rel.categoryName}
                    </span>
                  </span>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      rel.successRate >= 85
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {rel.successRate}% fix
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {categoryErrors.length > 0 && (
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Similar {currentCode.categoryName} Errors
          </h2>
          <ul className="space-y-2">
            {categoryErrors.map((rel) => (
              <li key={rel.code}>
                <Link
                  href={`/error/${encodeURIComponent(rel.code)}`}
                  className="flex items-center justify-between group py-1.5 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-sm">
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                      {rel.code}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs">
                      {rel.manufacturer}
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">{rel.series}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
