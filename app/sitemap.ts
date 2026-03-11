import { MetadataRoute } from "next";
import { getAllCodes } from "@/lib/codes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wifi.report";
  const codes = getAllCodes();
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/error`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic error code pages — prioritize by search volume
  const errorPages: MetadataRoute.Sitemap = codes.map((code) => ({
    url: `${baseUrl}/error/${encodeURIComponent(code.code)}`,
    lastModified: code.lastValidated,
    changeFrequency: "monthly" as const,
    priority: code.priority,
  }));

  return [...staticPages, ...errorPages];
}
