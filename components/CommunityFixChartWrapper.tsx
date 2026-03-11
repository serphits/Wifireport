"use client";

import dynamic from "next/dynamic";
import { CommunityFix } from "@/lib/codes";

const CommunityFixChart = dynamic(
  () => import("@/components/CommunityFixChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
    ),
  }
);

export default function CommunityFixChartWrapper({
  fixes,
  successRate,
}: {
  fixes: CommunityFix[];
  successRate: number;
}) {
  return <CommunityFixChart fixes={fixes} successRate={successRate} />;
}
