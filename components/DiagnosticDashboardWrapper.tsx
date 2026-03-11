"use client";

import dynamic from "next/dynamic";

const DiagnosticDashboard = dynamic(
  () => import("@/components/DiagnosticDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 p-6 text-center text-slate-400 animate-pulse h-48 flex items-center justify-center">
        Loading Network Diagnostics…
      </div>
    ),
  }
);

export default function DiagnosticDashboardWrapper({
  compact = false,
}: {
  compact?: boolean;
}) {
  return <DiagnosticDashboard compact={compact} />;
}
