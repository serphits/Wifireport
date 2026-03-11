"use client";

import { useEffect, useState, useCallback } from "react";

interface NetworkStats {
  latency: number | null;
  jitter: number | null;
  connectionType: string | null;
  downlink: number | null;
  rtt: number | null;
  effectiveType: string | null;
}

interface DiagnosticDashboardProps {
  compact?: boolean;
}

function StatCard({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string | number | null;
  unit?: string;
  status?: "good" | "warn" | "bad" | "neutral";
}) {
  const statusColors = {
    good: "text-emerald-600 dark:text-emerald-400",
    warn: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
    neutral: "text-slate-600 dark:text-slate-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span
        className={`text-2xl font-bold ${statusColors[status ?? "neutral"]}`}
      >
        {value !== null ? (
          <>
            {value}
            {unit && (
              <span className="text-sm font-normal ml-1 text-slate-500">
                {unit}
              </span>
            )}
          </>
        ) : (
          <span className="text-slate-400 text-base">Measuring…</span>
        )}
      </span>
    </div>
  );
}

function getLatencyStatus(ms: number | null): "good" | "warn" | "bad" | "neutral" {
  if (ms === null) return "neutral";
  if (ms < 50) return "good";
  if (ms < 150) return "warn";
  return "bad";
}

function getJitterStatus(ms: number | null): "good" | "warn" | "bad" | "neutral" {
  if (ms === null) return "neutral";
  if (ms < 10) return "good";
  if (ms < 30) return "warn";
  return "bad";
}

export default function DiagnosticDashboard({
  compact = false,
}: DiagnosticDashboardProps) {
  const [stats, setStats] = useState<NetworkStats>({
    latency: null,
    jitter: null,
    connectionType: null,
    downlink: null,
    rtt: null,
    effectiveType: null,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [resourceStats, setResourceStats] = useState<{
    avgLoadTime: number | null;
    totalResources: number;
  }>({ avgLoadTime: null, totalResources: 0 });

  const measureResourceTiming = useCallback(() => {
    if (typeof window === "undefined" || !window.performance) return;
    const entries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    if (entries.length === 0) return;
    const durations = entries
      .filter((e) => e.duration > 0)
      .map((e) => e.duration);
    if (durations.length === 0) return;
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    setResourceStats({
      avgLoadTime: Math.round(avg),
      totalResources: entries.length,
    });
  }, []);

  const readNetworkInfo = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
    if (!conn) return;
    setStats((prev) => ({
      ...prev,
      connectionType: conn.type ?? null,
      downlink: conn.downlink ?? null,
      rtt: conn.rtt ?? null,
      effectiveType: conn.effectiveType ?? null,
    }));
  }, []);

  const measureLatency = useCallback(async () => {
    if (typeof window === "undefined") return;
    const samples: number[] = [];
    const runs = 5;

    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      try {
        await fetch(
          `https://www.cloudflare.com/cdn-cgi/trace?_=${Date.now()}`,
          {
            cache: "no-store",
            mode: "no-cors",
          }
        );
      } catch {
        // no-cors will throw, timing is still valid
      }
      const end = performance.now();
      samples.push(end - start);
      await new Promise((r) => setTimeout(r, 100));
    }

    if (samples.length < 2) return;
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const jitterVal =
      Math.max(...samples) - Math.min(...samples);

    setStats((prev) => ({
      ...prev,
      latency: Math.round(avg),
      jitter: Math.round(jitterVal),
    }));
  }, []);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    readNetworkInfo();
    measureResourceTiming();
    await measureLatency();
    setIsRunning(false);
  }, [readNetworkInfo, measureResourceTiming, measureLatency]);

  useEffect(() => {
    // Defer diagnostics so initial page load is not blocked
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 500);
    return () => clearTimeout(timer);
  }, [runDiagnostics]);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2 border border-slate-200 dark:border-slate-700">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-amber-400 animate-pulse" : "bg-emerald-400 status-pulse"
            }`}
          />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Latency:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {stats.latency !== null ? `${stats.latency}ms` : "…"}
          </span>
        </span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="flex items-center gap-1.5">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Jitter:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {stats.jitter !== null ? `${stats.jitter}ms` : "…"}
          </span>
        </span>
      </div>
    );
  }

  return (
    <section
      aria-label="Real-Time Network Diagnostics"
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Real-Time Network Diagnostics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live measurements using browser APIs — no plugins required
          </p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          aria-label="Re-run network diagnostics"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-white animate-spin" : "bg-white"
            }`}
          />
          {isRunning ? "Measuring…" : "Re-run Test"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Latency"
          value={stats.latency}
          unit="ms"
          status={getLatencyStatus(stats.latency)}
        />
        <StatCard
          label="Jitter"
          value={stats.jitter}
          unit="ms"
          status={getJitterStatus(stats.jitter)}
        />
        <StatCard
          label="Connection"
          value={stats.effectiveType?.toUpperCase() ?? stats.connectionType}
          status="neutral"
        />
        <StatCard
          label="Downlink"
          value={stats.downlink}
          unit="Mbps"
          status={
            stats.downlink !== null
              ? stats.downlink > 25
                ? "good"
                : stats.downlink > 10
                ? "warn"
                : "bad"
              : "neutral"
          }
        />
      </div>

      {resourceStats.avgLoadTime !== null && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Page Resource Performance
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Avg resource load:{" "}
              <strong className="text-slate-900 dark:text-white">
                {resourceStats.avgLoadTime}ms
              </strong>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">
              Total resources:{" "}
              <strong className="text-slate-900 dark:text-white">
                {resourceStats.totalResources}
              </strong>
            </span>
          </div>
          <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(
                  100,
                  ((resourceStats.avgLoadTime ?? 0) / 500) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
        Latency measured via{" "}
        <code className="font-mono">{`performance.getEntriesByType('resource')`}</code> and
        network fetch timing. Connection info from{" "}
        <code className="font-mono">navigator.connection</code> API.
      </p>
    </section>
  );
}
