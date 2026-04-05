import { MetadataRoute } from "next";
import { getAllCodes } from "@/lib/codes";
import fs from "fs";
import path from "path";

function getBlogPosts(): string[] {
  const blogDir = path.join(process.cwd(), "blog");
  try {
    return fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".html"))
      .map((f) => f);
  } catch {
    return [];
  }
}

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
      url: `${baseUrl}/error-codes.html`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/error`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog.html`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/speed.html`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/starlink.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies.html`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = getBlogPosts().map((filename) => ({
    url: `${baseUrl}/blog/${filename}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic error code pages — prioritize by search volume
  const errorPages: MetadataRoute.Sitemap = codes.map((code) => ({
    url: `${baseUrl}/error/${encodeURIComponent(code.code)}`,
    lastModified: code.lastValidated,
    changeFrequency: "monthly" as const,
    priority: code.priority,
  }));

  return [...staticPages, ...blogPosts, ...errorPages];
}
