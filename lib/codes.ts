import codesData from "@/data/master_codes.json";
import deepDivesData from "@/data/deep_dives.json";

export interface CommunityFix {
  method: string;
  votes: number;
  successRate: number;
}

export interface ErrorCode {
  code: string;
  manufacturer: string;
  series: string;
  category: string;
  categoryName: string;
  title: string;
  cause: string;
  fixSteps: string[];
  successRate: number;
  priority: number;
  searchVolume: number;
  lastValidated: string;
  deepDiveKey: string;
  tags: string[];
  communityFixes: CommunityFix[];
}

export type DeepDives = Record<string, string>;

const codes = codesData as ErrorCode[];
const deepDives = deepDivesData as DeepDives;

export function getAllCodes(): ErrorCode[] {
  return codes;
}

export function getCodeBySlug(code: string): ErrorCode | undefined {
  return codes.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
}

export function getCodesByManufacturer(manufacturer: string): ErrorCode[] {
  return codes.filter(
    (c) => c.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

export function getCodesBySeries(
  manufacturer: string,
  series: string
): ErrorCode[] {
  return codes.filter(
    (c) =>
      c.manufacturer.toLowerCase() === manufacturer.toLowerCase() &&
      c.series.toLowerCase() === series.toLowerCase()
  );
}

export function getRelatedCodes(
  code: ErrorCode,
  limit = 8
): ErrorCode[] {
  return codes
    .filter(
      (c) =>
        c.code !== code.code &&
        (c.manufacturer === code.manufacturer ||
          c.series === code.series ||
          c.category === code.category)
    )
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit);
}

export function getRelatedBySeries(
  code: ErrorCode,
  limit = 6
): ErrorCode[] {
  return codes
    .filter(
      (c) =>
        c.code !== code.code &&
        c.manufacturer === code.manufacturer &&
        c.series === code.series
    )
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit);
}

export function getDeepDive(key: string): string {
  return deepDives[key] ?? "";
}

export function getTopCodes(limit = 20): ErrorCode[] {
  return [...codes]
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit);
}

export function getAllManufacturers(): string[] {
  return [...new Set(codes.map((c) => c.manufacturer))].sort();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
