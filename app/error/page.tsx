import type { Metadata } from "next";
import Link from "next/link";
import { getAllCodes, getAllManufacturers } from "@/lib/codes";

export const metadata: Metadata = {
  title: "WiFi Error Code Index – Browse All 5,000 Codes",
  description:
    "Browse the complete WiFi.report database of 5,000+ error codes. Filter by manufacturer, series, or error category.",
  alternates: { canonical: "/error" },
};

interface SearchParams {
  manufacturer?: string;
  category?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 50;

export default async function ErrorIndexPage({ searchParams }: Props) {
  const params = await searchParams;
  const allCodes = getAllCodes();
  const manufacturers = getAllManufacturers();

  // Filter
  let filtered = allCodes;
  if (params.manufacturer) {
    filtered = filtered.filter(
      (c) =>
        c.manufacturer.toLowerCase() ===
        params.manufacturer!.toLowerCase()
    );
  }
  if (params.category) {
    filtered = filtered.filter((c) => c.category === params.category);
  }

  // Sort by search volume
  filtered = [...filtered].sort((a, b) => b.searchVolume - a.searchVolume);

  // Paginate
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categories = [...new Set(allCodes.map((c) => c.category))].sort();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
        WiFi Error Code Index
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {total.toLocaleString()} error codes
        {params.manufacturer ? ` for ${params.manufacturer}` : ""}
        {params.category ? ` in ${params.category}` : ""}
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label
            htmlFor="mfr-filter"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Manufacturer
          </label>
          <form method="get">
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            <select
              id="mfr-filter"
              name="manufacturer"
              defaultValue={params.manufacturer ?? ""}
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              onChange={(e) => {
                (e.target.closest("form") as HTMLFormElement)?.submit();
              }}
            >
              <option value="">All Manufacturers</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button type="submit" className="sr-only">
              Apply
            </button>
          </form>
        </div>

        <div>
          <label
            htmlFor="cat-filter"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Category
          </label>
          <form method="get">
            {params.manufacturer && (
              <input
                type="hidden"
                name="manufacturer"
                value={params.manufacturer}
              />
            )}
            <select
              id="cat-filter"
              name="category"
              defaultValue={params.category ?? ""}
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Code table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                Error Code
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                Manufacturer
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                Category
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                Fix Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {paginated.map((code) => (
              <tr
                key={code.code}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/error/${encodeURIComponent(code.code)}`}
                    className="font-mono text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    {code.code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                  {code.manufacturer}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                  {code.categoryName}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${
                      code.successRate >= 85
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {code.successRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex gap-2 justify-center">
          {page > 1 && (
            <Link
              href={`/error?${new URLSearchParams({
                ...(params.manufacturer ? { manufacturer: params.manufacturer } : {}),
                ...(params.category ? { category: params.category } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/error?${new URLSearchParams({
                ...(params.manufacturer ? { manufacturer: params.manufacturer } : {}),
                ...(params.category ? { category: params.category } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
